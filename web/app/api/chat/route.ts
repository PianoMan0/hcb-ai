import { NextRequest, NextResponse } from 'next/server';

const HCB_MCP_URL = process.env.HCB_MCP_URL;
const HCB_MCP_TOKEN = process.env.HCB_MCP_TOKEN; // optional; depends on MCP auth mechanism

type Body = {
  message: string;
  hcb_token?: string;
};

function mustEnv(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

async function callMcp(message: string, hcb_token?: string): Promise<string> {
  mustEnv('HCB_MCP_URL', HCB_MCP_URL);

  const tokenToUse = (hcb_token && hcb_token.trim()) || (HCB_MCP_TOKEN && HCB_MCP_TOKEN.trim());

  const res = await fetch(HCB_MCP_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {})
    },
    body: JSON.stringify({
      message
    })
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || `MCP request failed: ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json().catch(() => null);
    if (typeof data === 'string') return data;
    if (data?.answer && typeof data.answer === 'string') return data.answer;
    if (data?.result && typeof data.result === 'string') return data.result;
    return JSON.stringify(data, null, 2);
  }

  return await res.text();
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Partial<Body>;
  const message = (body.message || '').trim();

  if (!message) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  const hcb_token = (body.hcb_token || '').trim() || undefined;

  try {
    const tokenUsed = (hcb_token && hcb_token.trim()) || HCB_MCP_TOKEN || undefined;
    const answer = await callMcp(message, hcb_token);
    return NextResponse.json({ answer, auth: { tokenUsedPresent: !!tokenUsed } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      {
        answer: `Error: ${msg}`,
        auth: {
          tokenUsedPresent: !!((hcb_token && hcb_token.trim()) || HCB_MCP_TOKEN)
        }
      },
      { status: 200 }
    );
  }
}

