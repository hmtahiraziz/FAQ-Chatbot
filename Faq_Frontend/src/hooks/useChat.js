import { useCallback, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export function useChat({ historyLimit = 3 } = {}) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const lastLimited = useMemo(() => messages.slice(-historyLimit), [messages, historyLimit])

  const clear = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const send = useCallback(async (question) => {
    const trimmed = String(question || '').trim()
    if (!trimmed || loading) return

    setMessages(prev => [...prev, { role: 'user', content: trimmed }])
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, history: lastLimited })
      })
      const data = await res.json()
      const answer = data.answer || data.error || 'No answer.'
      setMessages(prev => [...prev, { role: 'assistant', content: String(answer) }])
    } catch (err) {
      setError('Failed to reach server')
      setMessages(prev => [...prev, { role: 'assistant', content: 'Request failed.' }])
    } finally {
      setLoading(false)
    }
  }, [lastLimited, loading])

  return { messages, loading, error, send, clear }
}



