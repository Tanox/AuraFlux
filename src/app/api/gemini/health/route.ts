import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith('demo')) {
    return NextResponse.json({ available: false }, { status: 503 });
  }
  return NextResponse.json({ available: true });
}
