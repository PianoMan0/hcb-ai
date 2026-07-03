'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [token, setToken] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function onSubmit() {
    window.localStorage.setItem('hcb_token', token.trim());
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h1 className="text-xl font-semibold">Login to HCB</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Paste your HCB token (or whatever credential the MCP server expects). This prototype stores it in
          localStorage.
        </p>

        <label className="mt-4 block text-sm text-zinc-200" htmlFor="token">
          HCB token
        </label>
        <input
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-blue-500/60"
          placeholder="e.g. hcb_xxx"
        />

        <button
          onClick={onSubmit}
          disabled={!token.trim()}
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Save
        </button>

        {submitted ? (
          <div className="mt-4 text-sm text-emerald-400">Token saved. Go ask a question.</div>
        ) : null}
      </div>
    </div>
  );
}

