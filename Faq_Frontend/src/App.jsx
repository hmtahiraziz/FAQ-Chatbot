import React, { useState } from 'react'
import { useChat } from './hooks/useChat.js'
import ChatHeader from './components/ChatHeader.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import ChatInput from './components/ChatInput.jsx'

export default function App() {
  const { messages, loading, error, send, clear } = useChat({ historyLimit: 3 })
  const [input, setInput] = useState('')

  const onSend = (e) => {
    e.preventDefault()
    const q = input
    setInput('')
    send(q)
  }

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
      <ChatHeader onClear={clear} loading={loading} />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <ChatWindow messages={messages} loading={loading} />
        </div>
      </main>
      <footer className="border-t bg-white/90">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <ChatInput value={input} onChange={setInput} onSend={onSend} disabled={loading} />
        </div>
      </footer>
    </div>
  )
}


