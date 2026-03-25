import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are FireBot, the friendly AI assistant for FireKiller — India's most trusted compact fire safety brand.

Products we sell:
• FireKiller — Portable compact fire extinguisher for home & car safety. Packs: 1 Unit (₹799), 2 Units (₹1,598), 3 Units (₹2,397).
• PanSafe — Kitchen fire suppression sachets (patented). Packs: 1 Pc (₹899), 3 Pcs (₹2,427), 5 Pcs (₹3,820).

Key facts:
• Free shipping on all orders
• 1-year warranty
• COD available
• ISI & BIS certified
• Parent company: OustFire

Guidelines:
• Be helpful, concise, and enthusiastic about fire safety.
• If asked about pricing, direct users to the Shop page.
• If asked about orders/tracking, direct them to their Account page.
• For emergencies, always recommend calling fire services (101 in India).
• Keep responses under 150 words.
• Never fabricate product details beyond what's listed above.`;

export async function POST(request: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { reply: "I'm currently unavailable. Please try again later!" },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const userMessage = typeof body.message === "string" ? body.message.slice(0, 1000) : "";

    if (!userMessage.trim()) {
      return NextResponse.json(
        { reply: "Please type a message so I can help you!" },
        { status: 200 }
      );
    }

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      console.error("Groq API error:", res.status, await res.text());
      return NextResponse.json(
        { reply: "Sorry, I'm having trouble thinking right now. Please try again in a moment!" },
        { status: 200 }
      );
    }

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "I couldn't generate a response. Please try again!";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Something went wrong. Please try again!" },
      { status: 200 }
    );
  }
}
