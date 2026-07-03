# HCB Chatbot (Next.js)

This is a ChatGPT-like UI that forwards questions to the Hack Club HCB MCP server.

## Setup

1. Install dependencies
```bash
cd web
npm install
```

2. Configure environment variables
Copy `.env.local.example` to `.env.local` and fill values as needed.

3. Run
```bash
npm run dev
```

## What it does
- Renders a chat UI
- Sends user questions to `/api/chat`
- `/api/chat` calls the HCB MCP server (read-only)


