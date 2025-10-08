# FAQ Chatbot – AI-Powered Hybrid Search Assistant

An AI-powered chatbot that answers questions using a preloaded FAQ dataset.
It combines dense embeddings + sparse BM25 + reranking to give accurate answers from your FAQs.

---

# Key Features

* Ask any question from your FAQ dataset
* Hybrid search: dense embeddings + sparse BM25 for better results
* Reranks results with CrossEncoder for high accuracy
* Supports conversational context (last 3 messages)
* Built with LangChain LLMs (Ollama)

---

# How It Works

1. Load FAQs from `faqs.json`
2. Encode FAQs using:

   * Dense embeddings (HuggingFace)
   * Sparse embeddings (BM25)
3. Upload embeddings to Pinecone for hybrid search
4. When a question is asked:

   * Hybrid search retrieves relevant FAQs
   * Reranker ranks them
   * LLM generates the final answer using top results and recent conversation

---

# Example Questions You Can Ask

* "How do I reset my password?"
* "What is your refund policy?"

---

# Chatbot UI

<img width="1288" height="897" alt="ScreenShot1 (1)" src="https://github.com/user-attachments/assets/cdb5c658-368c-468b-8884-f570c3bf553a" />

<img width="1165" height="892" alt="ScreenShot2 (1)" src="https://github.com/user-attachments/assets/1f05235f-bbe7-45cf-9fcd-581604fe1d31" />


---

# Getting Started

# Clone the repo

git clone https://github.com/hmtahiraziz/FAQ-Chatbot.git

# Backend

cd FAQ

# Install dependencies

pip install -r requirements.txt

# Run the backend

uvicorn faq_bot:app --reload

---

# Frontend

cd Faq_Frontend

# Install dependencies

npm install

# Run the frontend

npm run dev

---


MIT License
