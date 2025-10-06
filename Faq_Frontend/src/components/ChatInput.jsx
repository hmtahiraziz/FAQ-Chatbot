import React from 'react'

export default function ChatInput({ value, onChange, onSend, disabled }) {
  return (
    <form onSubmit={onSend} className="w-full flex gap-2">
      <input
        className="flex-1 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
        placeholder="Ask a question…"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl bg-blue-600 text-white px-5 py-3 disabled:opacity-50 shadow hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  )
}



