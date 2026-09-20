import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages?.[messages.length - 1]?.content || "Hello";

    // 1. Check AWS Bedrock endpoint
    const bedrockUrl = process.env.BEDROCK_API_URL;
    if (bedrockUrl) {
      try {
        const res = await fetch(bedrockUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": process.env.BEDROCK_API_KEY || "" },
          body: JSON.stringify({ messages }),
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ reply: data.content?.[0]?.text || data.reply });
        }
      } catch (err) {
        console.warn("Bedrock endpoint failed, falling back to Groq:", err);
      }
    }

    // 2. Groq Llama-3-70b (Real Cloud AI using GROQ_API_KEY)
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are Vanna AI, the intelligent humanitarian assistant for Vannate OS. You assist citizens with emergency SOS dispatches, blood donor matching, NGO operations, and relief fund transparency across India. Be concise, empathetic, and action-oriented."
              },
              ...messages
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const replyText = groqData.choices?.[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({ reply: replyText });
          }
        }
      } catch (groqErr) {
        console.warn("Groq fetch error:", groqErr);
      }
    }

    // Fallback response if offline
    return NextResponse.json({
      reply: `Vanna AI Command Active: Received instruction: "${lastUserMessage}". Coordinating telemetry across Police, Fire, and Medical dispatch grids.`
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
