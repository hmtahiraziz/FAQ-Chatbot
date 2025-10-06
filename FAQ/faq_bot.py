from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from pinecone_text.sparse import BM25Encoder
from langchain_huggingface import HuggingFaceEmbeddings
from sentence_transformers import CrossEncoder
from langchain_ollama import ChatOllama

load_dotenv()

app = FastAPI()

#Pinecone setup 
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = os.getenv("PINECONE_INDEX_NAME", "faq-hybrid")

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=384,         
        metric="dotproduct",
        spec=ServerlessSpec(cloud="aws", region=os.getenv("PINECONE_ENVIRONMENT", "us-east-1"))
    )

index = pc.Index(index_name)

# Embeddings + reranker + LLM 
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
llm = ChatOllama(model=os.getenv("OLLAMA_MODEL", "mistral"), temperature=0)

bm25 = BM25Encoder()

#Load FAQ dataset
with open("faqs.json", "r") as f:
    faq_data = json.load(f)

def process_faqs():
    texts = [f"Q: {faq['question']}\nA: {faq['answer']}" for faq in faq_data]

    # Fit BM25 on the FAQs
    bm25.fit(texts)

    # Create dense + sparse embeddings
    dense_embs= embeddings.embed_documents(texts)
    sparse_embs = bm25.encode_documents(texts) 

    # Upsert both into Pinecone
    vectors = []
    for i, text in enumerate(texts):
        vectors.append({
            "id": f"faq-{i}",
            "values": dense_embs[i],
            "sparse_values": sparse_embs[i],
            "metadata": {"text": text}
        })

    index.upsert(vectors)
    print(f"✅ Uploaded {len(vectors)} FAQs into Pinecone (dense + sparse).")

class ChatMessage(BaseModel):
    role: str  
    content: str


class QuestionRequest(BaseModel):
    question: str
    history: list[ChatMessage] | None = None

@app.post("/ask")
async def ask_faq(req: QuestionRequest):
    try:
        # Create hybrid query 
        dense_q = embeddings.embed_query(req.question)
        sparse_q = bm25.encode_queries([req.question])[0]

        results = index.query(
            vector=dense_q,
            sparse_vector=sparse_q,
            top_k=10,
            include_metadata=True
        )

        docs = [r["metadata"]["text"] for r in results.get("matches", [])]

        if not docs:
            return {"answer": "I don’t know. I couldn’t find anything relevant in the FAQ."}

        #Rerank
        pairs = [(req.question, doc) for doc in docs]
        scores = reranker.predict(pairs)
        reranked = [doc for _, doc in sorted(zip(scores, docs), reverse=True)]

        # Pick top docs
        top_docs = reranked[:4]
        context = "\n\n".join(top_docs)

        # Prepare limited conversation history (last 3 messages)
        history_msgs = req.history or []
        history_msgs = history_msgs[-3:]
        history_formatted = "\n".join([f"{m.role.capitalize()}: {m.content}" for m in history_msgs])

        # LLM prompt 
        prompt = f"""
        You are a helpful FAQ assistant.
        Answer ONLY using the FAQ context below.
        If the answer is not found, say "I don’t know."

        Context:
        {context}

        Conversation (last messages):
        {history_formatted}

        Question: {req.question}
        """
        answer = llm.invoke(prompt)
        return {"answer": answer.content}

    except Exception as e:
        print(f"⚠️ ERROR: {e}")
        return {"answer": "Sorry, something went wrong while searching the FAQs. Please try again."}

# Allow CORS for local development and simple deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

process_faqs()
