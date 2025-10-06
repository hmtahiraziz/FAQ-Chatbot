import React from 'react'

export default function MessageBubble({ role, children }) {
  const isUser = role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center shadow">🤖</div>
      )}
      <div className={`rounded-2xl px-4 py-3 max-w-[78%] shadow ${isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-900 border rounded-bl-sm'} whitespace-pre-wrap`}> 
        {children}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-gray-800 text-white grid place-items-center shadow">🧑</div>
      )}
    </div>
  )
}


