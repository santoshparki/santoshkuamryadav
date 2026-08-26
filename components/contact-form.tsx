"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, LoaderCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  website?: string;
};

type ContactFormProps = {
  siteDescription?: string | null;
  socialLinks: string[];
};

type FormStatus = { kind: "success" | "error"; message: string } | null;

const formatSocialLabel = (url: string) => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    if (hostname.includes("github")) return "GitHub";
    if (hostname.includes("linkedin")) return "LinkedIn";
    if (hostname.includes("twitter") || hostname.includes("x.com")) return "X";
    if (hostname.includes("instagram")) return "Instagram";
    return hostname;
  } catch {
    return url;
  }
};

export default function ContactForm({ siteDescription, socialLinks }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "", website: "" },
  });

  async function onSubmit(values: FormValues) {
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (json.success) {
        setStatus({ kind: "success", message: "Message sent. I’ll get back to you soon." });
        reset();
      } else {
        setStatus({ kind: "error", message: json.error || "Unable to send message." });
      }
    } catch {
      setStatus({ kind: "error", message: "Unable to send your message. Please try again." });
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="interactive-card rounded-[24px] border border-white/10 bg-[#0B1B2F]/95 p-8 shadow-[0_24px_75px_rgba(2,9,20,0.32)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Contact information</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">Let&apos;s talk about your next project.</h3>
          </div>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 opacity-95" />
        </div>

        <p className="mt-6 text-sm leading-7 text-zinc-300">{siteDescription ?? "Share the details of your next idea and I&apos;ll help make it feel polished, modern, and ready for launch."}</p>

        <div className="mt-8 space-y-6 text-sm text-[#CBD5E1]">
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-4">
              <div className="icon-tile"><Mail aria-hidden="true" className="h-5 w-5" /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Email</p>
                <p className="mt-2 text-base text-zinc-200">syadavxoxo@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-4">
              <div className="icon-tile"><Phone aria-hidden="true" className="h-5 w-5" /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Phone</p>
                <p className="mt-2 text-base text-zinc-200">+9779811249151</p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-4">
              <div className="icon-tile"><MapPin aria-hidden="true" className="h-5 w-5" /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Location</p>
                <p className="mt-2 text-base text-zinc-200">Adarsh kotwal rural municipality-03 Bhatineeya, Bara Nepal</p>
              </div>
            </div>
          </div>
        </div>

        {socialLinks.length > 0 ? (
          <div className="mt-8 rounded-[20px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Stay connected</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-200/20">{formatSocialLabel(url).slice(0, 2).toUpperCase()}</span>
                  {formatSocialLabel(url)}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="interactive-card space-y-6 rounded-[24px] border border-white/10 bg-[#07101b]/95 p-8 shadow-[0_24px_75px_rgba(2,9,20,0.34)] backdrop-blur-xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span>Send a message</span>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">Ready to collaborate?</h3>
          <p className="text-sm leading-7 text-zinc-400">Fill out the form and I&apos;ll respond as soon as possible.</p>
        </div>

        {status ? <div role="status" aria-live="polite" className={`rounded-2xl border p-4 text-sm ${status.kind === "success" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100" : "border-rose-400/25 bg-rose-400/10 text-rose-100"}`}>{status.message}</div> : null}

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-zinc-200">
            Your name <span className="text-cyan-300">*</span>
            <input {...register("name", { required: "Please enter your name.", maxLength: { value: 100, message: "Name must be 100 characters or fewer." } })} aria-invalid={Boolean(errors.name)} autoComplete="name" placeholder="Your name" className={`input-glass w-full ${errors.name ? "border-rose-400/70" : ""}`} />
            {errors.name ? <span role="alert" className="text-xs font-medium text-rose-300">{errors.name.message}</span> : null}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-zinc-200">
              Email <span className="text-cyan-300">*</span>
              <input {...register("email", { required: "Please enter your email.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." } })} aria-invalid={Boolean(errors.email)} type="email" autoComplete="email" placeholder="Your email" className={`input-glass w-full ${errors.email ? "border-rose-400/70" : ""}`} />
              {errors.email ? <span role="alert" className="text-xs font-medium text-rose-300">{errors.email.message}</span> : null}
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-200">
              Phone
              <input {...register("phone", { maxLength: { value: 40, message: "Phone number is too long." } })} aria-invalid={Boolean(errors.phone)} type="tel" autoComplete="tel" placeholder="Phone" className={`input-glass w-full ${errors.phone ? "border-rose-400/70" : ""}`} />
              {errors.phone ? <span role="alert" className="text-xs font-medium text-rose-300">{errors.phone.message}</span> : null}
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-zinc-200">
            Subject
            <input {...register("subject", { maxLength: { value: 160, message: "Subject must be 160 characters or fewer." } })} aria-invalid={Boolean(errors.subject)} placeholder="Subject" className={`input-glass w-full ${errors.subject ? "border-rose-400/70" : ""}`} />
            {errors.subject ? <span role="alert" className="text-xs font-medium text-rose-300">{errors.subject.message}</span> : null}
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-200">
            Message <span className="text-cyan-300">*</span>
            <textarea {...register("message", { required: "Please enter a message.", maxLength: { value: 5_000, message: "Message must be 5,000 characters or fewer." } })} aria-invalid={Boolean(errors.message)} rows={6} placeholder="Message" className={`input-glass min-h-[180px] w-full resize-none ${errors.message ? "border-rose-400/70" : ""}`} />
            {errors.message ? <span role="alert" className="text-xs font-medium text-rose-300">{errors.message.message}</span> : null}
          </label>
          <label aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
            Website
            <input {...register("website")} tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <Button type="submit" disabled={isSubmitting} className="group w-full rounded-full px-6 py-4 text-base font-semibold">
          {isSubmitting ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Send aria-hidden="true" className="h-4 w-4" />}
          {isSubmitting ? "Sending message…" : "Send Message"}
          {!isSubmitting ? <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" /> : null}
        </Button>
      </form>
    </div>
  );
}
