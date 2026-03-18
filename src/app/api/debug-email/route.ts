import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY in environment variables" },
      { status: 500 }
    );
  }

  // Optional protection to prevent abuse.
  // If you set DEBUG_EMAIL_TOKEN, then callers must provide the same value as `?token=...`.
  const url = new URL(req.url);
  const providedToken = url.searchParams.get("token") || "";
  const expectedToken = process.env.DEBUG_EMAIL_TOKEN || "";
  if (expectedToken && providedToken !== expectedToken) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const to = process.env.DEBUG_EMAIL_TO || "tuskhub@gmail.com";
  const fromName = process.env.DEBUG_EMAIL_FROM_NAME || "Dealer Auth";
  const fromEmail = process.env.DEBUG_EMAIL_FROM_EMAIL || "no-reply@yourdomain.com";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to,
        subject: "Resend debug from production",
        text: "If you see this, Resend + DNS + delivery plumbing are working.",
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        { error: "Resend API request failed", status: response.status, data },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err) {
    console.error("debug-email error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

