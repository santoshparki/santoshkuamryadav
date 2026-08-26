import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/actions/contact-messages";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations";

const MAX_BODY_BYTES = 20_000;

function json(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function getClientKey(req: Request) {
  // These headers must be supplied by a trusted reverse proxy. Keep the app
  // origin private so visitors cannot send a forged forwarded-IP header directly.
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown-client"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ success: false, error: "Content-Type must be application/json." }, 415);
  }

  const rateLimit = checkContactRateLimit(getClientKey(req));
  if (!rateLimit.allowed) {
    return json(
      { success: false, error: "Too many messages. Please try again later." },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  try {
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
      return json({ success: false, error: "Message payload is too large." }, 413);
    }

    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ success: false, error: "Message payload is too large." }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return json({ success: false, error: "Request body must be valid JSON." }, 400);
    }

    if (isRecord(body) && typeof body.website === "string" && body.website.trim()) {
      return json({ success: true });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return json({ success: false, error: "Please check the form fields and try again." }, 422);
    }

    await createContactMessage(parsed.data);
    return json({ success: true });
  } catch (error) {
    console.error("Contact message could not be saved", error);
    return json({ success: false, error: "Unable to send your message. Please try again later." }, 500);
  }
}
