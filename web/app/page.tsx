'use client';

import { useEffect, useMemo, useState } from 'react';

type Role = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

function getTokenFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem('hcb_token');
  } catch {
    return null;
  }
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: 'assistant',
      content:
        'Hi! Ask me read-only questions about HCB (payments, spend breakdowns, etc.).'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function onSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');

    const userMsg: ChatMessage = { id: uid(), role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);

    setLoading(true);
    try {
      const token = getTokenFromStorage();

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, hcb_token: token || undefined })
      });

      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(t || `Request failed: ${res.status}`);
      }

      const data = (await res.json()) as { answer: string };
      const assistantMsg: ChatMessage = { id: uid(), role: 'assistant', content: data.answer };
      setMessages((m) => [...m, assistantMsg]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: `Error: ${msg}`
      };
      setMessages((m) => [...m, assistantMsg]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void onSend();
    }
  }

  useEffect(() => {
    // Scroll to bottom
    const el = document.getElementById('chat-scroll');
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-3xl flex-col px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">HCB Chatbot</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Read-only Q&A powered by the HCB MCP server.
          </p>
        </header>

        <div
          id="chat-scroll"
          className="h-[60vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
        >
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-xl bg-blue-600/20 px-4 py-3 text-sm border border-blue-500/30'
                      : 'max-w-[85%] rounded-xl bg-zinc-800/60 px-4 py-3 text-sm border border-zinc-700/60'
                  }
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl bg-zinc-800/60 px-4 py-3 text-sm border border-zinc-700/60">
                  Thinking…
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
          <label className="sr-only" htmlFor="message">Message</label>
          <textarea
            id="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question about HCB…"
            className="min-h-[84px] w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm outline-none focus:border-blue-500/60"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-500">
              Tip: try “breakdown of spend for flavortown” or “payments to X over time”.
            </div>
            <button
              onClick={() => void onSend()}
              disabled={!canSend}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

