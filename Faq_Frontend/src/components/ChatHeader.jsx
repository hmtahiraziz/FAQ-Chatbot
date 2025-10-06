import React from 'react'

export default function ChatHeader({ onClear, loading }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center shadow">🤖</div>
          <div>
            <h1 className="text-lg font-semibold">FAQ Chatbot</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {loading && <span className="text-xs text-blue-600">Thinking…</span>}
          <button className="text-sm text-gray-500 hover:text-gray-700" onClick={onClear}>Clear</button>
        </div>
      </div>
    </header>
  )
}




