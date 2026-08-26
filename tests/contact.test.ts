import { describe, expect, it, vi } from "vitest";
import { contactSchema } from "@/lib/validations";

const createContactMessage = vi.fn();
vi.mock("@/lib/actions/contact-messages", () => ({ createContactMessage }));

describe("contact form validation", () => {
  it("accepts a complete message", () => {
    expect(contactSchema.safeParse({ name: "Ada Lovelace", email: "ada@example.com", subject: "Project inquiry", message: "I would like to discuss a website project." }).success).toBe(true);
  });

  it("rejects an invalid email and an empty message", () => {
    expect(contactSchema.safeParse({ name: "Ada", email: "not-an-email", message: "" }).success).toBe(false);
  });
});

describe("POST /api/contact", () => {
  it("returns success after saving a valid message", async () => {
    createContactMessage.mockResolvedValueOnce({ id: "message-1" });
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(new Request("http://localhost/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ada", email: "ada@example.com", message: "Hello" }) }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(createContactMessage).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com", message: "Hello" });
  });

  it("does not expose internal errors when saving fails", async () => {
    createContactMessage.mockRejectedValueOnce(new Error("Message is required"));
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(new Request("http://localhost/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ada", email: "ada@example.com", message: "Hello" }) }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ success: false, error: "Unable to send your message. Please try again later." });
  });
});
