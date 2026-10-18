import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// Groq retires models periodically (llama-3.1-8b-instant was removed and broke the bot),
// so models are configurable: set GROQ_MODEL / GROQ_FALLBACK_MODEL on Vercel to switch
// without a code change.
// The free tier allows ~8k tokens/min PER MODEL (~8 chats/min). Each model has its own
// allowance, so when the primary is rate-limited (or retired) we try the fallback.
const MODELS = [
  process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  process.env.GROQ_FALLBACK_MODEL || "qwen/qwen3.8-27b",
];

// gpt-oss models "think" before answering; without these the reasoning can use up
// max_tokens and the reply comes back empty. Other models may reject these params.
function reasoningParams(model: string) {
  return model.startsWith("openai/gpt-oss")
    ? { reasoning_effort: "low", reasoning_format: "hidden" }
    : {};
}

// Errors where another model may still work: rate limited, model retired, Groq-side failure
const TRY_NEXT_MODEL = (status: number) => status === 429 || status === 404 || status >= 500;

const SYSTEM_PROMPT = `You are FireBot, the friendly AI assistant for FireKiller - India's most trusted compact fire safety brand.

Products we sell:
• FireKiller - Portable compact fire extinguisher for home & car safety. Packs: 1 Unit (₹1,200), 2 Units (₹2,160 - 10% off), 3 Units (₹3,060 - 15% off).
• PanSafe - Kitchen fire suppression sachets (patented). Packs: 1 Pc (₹666), 3 Pcs (₹1,800), 5 Pcs (₹2,750).
• Combo Offer - 1 FireKiller + 1 PanSafe sachet together for ₹1,500 (save ₹366 vs buying separately).

All prices above are exclusive of 18% GST, which is added at checkout.

Product facts:
• FireKiller: ISI, BIS and CE certified. Works on Class A, B, C and electrical fires. Range 2-3 metres, discharges in 8-10 seconds. Zero maintenance, 5-year shelf life. 1-year manufacturer warranty covering defects in materials or workmanship (not misuse or accidental discharge).
• PanSafe: ISI and BIS certified, NABL tested. OustFire's patented sachet for cooking-oil fires - toss it into the burning pan and it activates on contact. 3-year shelf life.
• Parent company: OustFire Safety Engineers Pvt. Ltd.

Ordering, payment and shipping:
• Payment is online only, through Razorpay (UPI, cards, net banking). Cash on Delivery (COD) is NOT available.
• We ship across India only. Shipping charges depend on the delivery pincode and are shown at checkout before payment - do not promise free shipping.
• Orders are processed in 1-2 business days; delivery usually takes 4-7 business days (metros 3-5, remote areas up to 10).
• Order status: the Track Order page (needs order number + email), or My Orders when logged in.
• Cancellation is possible only before dispatch. Returns/replacements must be requested within 7 days of delivery; approved refunds go back to the original payment method in 5-7 business days. Details: Refund & Cancellation Policy page.
• Contact: sales@oustfire.com or +91 93242 59477.

Guidelines:
• Be helpful, concise, and enthusiastic about fire safety.
• If asked about pricing, give the price from the list above (mention GST is added at checkout), then point them to the Shop page to buy.
• For emergencies, always recommend calling fire services (101 in India).
• Keep responses under 150 words.
• Reply in plain text only - no markdown (no **bold**, # headings or tables). For steps, use short numbered lines.
• Never invent product details, certifications, discounts, offers or policies beyond what's listed above. If you don't know (e.g. stock, exact delivery date or shipping cost for a pincode, warranty on PanSafe), say so and suggest contacting sales@oustfire.com.`;

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

    let res: Response | null = null;
    for (const model of MODELS) {
      res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          ...reasoningParams(model),
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });
      if (res.ok) break;
      console.error(`Groq API error (${model}):`, res.status, await res.text());
      if (!TRY_NEXT_MODEL(res.status)) break;
    }

    if (!res || !res.ok) {
      return NextResponse.json(
        {
          reply:
            res?.status === 429
              ? "I'm getting a lot of questions right now - please try again in a few seconds!"
              : "Sorry, I'm having trouble thinking right now. Please try again in a moment!",
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    // The chat widget shows plain text, so strip any markdown the model adds anyway
    // (and any <think> block a reasoning model might leak into the content)
    const content: string = (data?.choices?.[0]?.message?.content || "")
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .trim();
    const reply = content || "I couldn't generate a response. Please try again!";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Something went wrong. Please try again!" },
      { status: 200 }
    );
  }
}
