"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { upsertSocialLinks } from "@/lib/actions/social-links";

type SocialLinksValues = {
  facebookUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  xUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  portfolioUrl: string;
};

type SocialLinks = { facebookUrl: string | null; githubUrl: string | null; linkedinUrl: string | null; xUrl: string | null; instagramUrl: string | null; youtubeUrl: string | null; portfolioUrl: string | null } | null;

export function SocialLinksAdmin({ socialLinks }: { socialLinks: SocialLinks }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SocialLinksValues>({
    defaultValues: {
      facebookUrl: socialLinks?.facebookUrl ?? "",
      githubUrl: socialLinks?.githubUrl ?? "",
      linkedinUrl: socialLinks?.linkedinUrl ?? "",
      xUrl: socialLinks?.xUrl ?? "",
      instagramUrl: socialLinks?.instagramUrl ?? "",
      youtubeUrl: socialLinks?.youtubeUrl ?? "",
      portfolioUrl: socialLinks?.portfolioUrl ?? "",
    },
  });

  async function handleSubmit(values: SocialLinksValues) {
    try {
      setError(null);
      setMessage(null);
      await upsertSocialLinks(values);
      setMessage("Social links updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save social links.");
    }
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-950">Social media links</h2>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 grid gap-3 md:grid-cols-2">
          <input {...form.register("facebookUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Facebook URL" />
          <input {...form.register("githubUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="GitHub URL" />
          <input {...form.register("linkedinUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="LinkedIn URL" />
          <input {...form.register("xUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="X / Twitter URL" />
          <input {...form.register("instagramUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Instagram URL" />
          <input {...form.register("youtubeUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="YouTube URL" />
          <input {...form.register("portfolioUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2 md:col-span-2" placeholder="Portfolio URL" />
          <button disabled={form.formState.isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">
            {form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {form.formState.isSubmitting ? "Saving..." : "Save links"}
          </button>
        </form>
      </div>
    </div>
  );
}
