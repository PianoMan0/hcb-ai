# Deploy this Next.js app to Vercel

This app provides a ChatGPT-like UI that calls the Hack Club HCB MCP server via `POST /api/chat`.

## 0) Prereqs
- A GitHub repo containing the code (this repo: `hcb-ai`)
- A Vercel account
- A Vercel project linked to that GitHub repo

## 1) Ensure the Vercel build uses the `web/` folder
In your repo, the Next.js app lives at:
- `web/`

So when configuring Vercel, set:
- **Project root**: `web`

## 2) Commit/push changes
Commit and push anything you added/updated.

## 3) Create a new Vercel project
1. Go to https://vercel.com/dashboard
2. **Add New...** → **Project**
3. Import from GitHub
4. Select this repo
5. Set these settings:
   - **Framework preset**: Next.js (Vercel will auto-detect)
   - **Project root**: `web`
   - **Build command**: `npm run build`
   - **Output directory**: (leave default / empty)

If Vercel asks, set install command to the default `npm install`.

## 4) Configure environment variables in Vercel
In the Vercel project:
- **Settings → Environment Variables**

Add:
- `HCB_MCP_URL` = `https://hcb-mcp.k.hackclub.dev/mcp`
- `HCB_MCP_TOKEN` = *(token/credential required by the MCP server auth method)*

> Note: the current prototype also has a simple UI login page that stores `hcb_token` in browser localStorage.
> The backend currently uses `HCB_MCP_TOKEN` from server env vars for the outbound MCP request.
> If you want *per-user* login forwarded to the MCP server, update the API route accordingly.

## 5) Deploy
Click **Deploy**.

## 6) Verify in Production
1. Open the deployed URL
2. Visit `/auth`
3. If `/api/chat` works, ask a test question like:
   - “breakdown of spend for flavortown”

## 7) Important security note (must-fix before production)
Storing auth tokens in `localStorage` and passing them to a server is not secure by default.
For real production usage, use proper auth (cookies/secure sessions) and never log tokens.

This file documents deployment only; auth/token forwarding to the MCP server needs confirmation of the MCP server’s exact auth contract.

