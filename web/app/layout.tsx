import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HCB Chatbot',
  description: 'Ask questions about HCB using the HCB MCP server.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

