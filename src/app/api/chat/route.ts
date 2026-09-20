import { NextRequest, NextResponse } from "next/server";

// AWS Bedrock endpoint via API Gateway proxy
// Replace NEXT_PUBLIC_API_GATEWAY_URL in .env with your actual endpoint after deploy
export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiUrl = process.env.BEDROCK_API_URL;
  if (!apiUrl) {
    // Dev fallback: return mock streaming response
    return NextResponse.json({
      reply: "I'm the Vannate AI Assistant (Dev Mode). In production, I use Amazon Bedrock with Claude 3. How can I help you coordinate relief efforts today?"
    });
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.BEDROCK_API_KEY || "" },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    return NextResponse.json({ reply: data.content[0].text });
  } catch (err) {
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
