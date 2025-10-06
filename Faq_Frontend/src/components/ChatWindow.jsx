import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'

function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1">
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  )
}

export default function ChatWindow({ messages, loading }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border bg-white/80 backdrop-blur p-4 shadow-lg">
          <div ref={ref} className="h-[65vh] overflow-y-auto space-y-4 p-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-16">Ask anything about the FAQs to get started.</div>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role}>{m.content}</MessageBubble>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 border bg-white text-gray-500 shadow"><TypingDots /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


