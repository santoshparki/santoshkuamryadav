"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { createContactMessage, deleteContactMessage, markContactMessageAsRead } from "@/lib/actions/contact-messages";
import { ConfirmActionButton } from "@/components/common/confirm-action-button";

type ContactMessageItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: Date;
};

type ContactMessageFormValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function ContactMessagesAdmin({ messages }: { messages: ContactMessageItem[] | null | undefined }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactMessageFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function handleSubmit(values: ContactMessageFormValues) {
    try {
      setError(null);
      setMessage(null);
      await createContactMessage(values);
      form.reset({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setMessage("Message sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message.");
    }
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Send a test message</h2>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-3">
            <input {...form.register("name")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Your name" />
            <input {...form.register("email")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Your email" />
            <input {...form.register("phone")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Phone" />
            <input {...form.register("subject")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Subject" />
            <textarea {...form.register("message")} rows={4} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Message" />
            <button disabled={form.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">{form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{form.formState.isSubmitting ? "Sending..." : "Send"}</button>
          </form>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Incoming messages</h2>
          <div className="mt-6 space-y-3">
            {(messages ?? []).map((item) => (
              <div key={item.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{item.name}</p>
                    <p className="text-sm text-zinc-500">{item.email}</p>
                    <p className="mt-2 text-sm text-zinc-600">{item.message}</p>
                  </div>
                  <div className="text-sm text-zinc-500">
                    <p>{item.isRead ? "Read" : "Unread"}</p>
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => markContactMessageAsRead(item.id)} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700">Mark read</button>
                  <ConfirmActionButton onConfirm={() => deleteContactMessage(item.id)} title="Delete this message?" description="This contact message cannot be recovered." className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700">Delete</ConfirmActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
