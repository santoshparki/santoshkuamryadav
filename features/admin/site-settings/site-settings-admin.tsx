"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { upsertSiteSettings } from "@/lib/actions/site-settings";

type SiteSettingsFormValues = {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
};

type SiteSettings = {
  siteTitle: string | null;
  seoDescription: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
} | null;

export function SiteSettingsAdmin({ settings }: { settings: SiteSettings }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SiteSettingsFormValues>({
    defaultValues: {
      siteName: settings?.siteTitle ?? "",
      siteDescription: settings?.seoDescription ?? "",
      logoUrl: settings?.logoUrl ?? "",
      faviconUrl: settings?.faviconUrl ?? "",
    },
  });

  async function handleSubmit(values: SiteSettingsFormValues) {
    try {
      setError(null);
      setMessage(null);
      await upsertSiteSettings(values);
      setMessage("Site settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    }
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-950">Site settings</h2>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 grid gap-3 md:grid-cols-2">
          <input {...form.register("siteName")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Site name" />
          <textarea {...form.register("siteDescription")} rows={3} className="w-full rounded-xl border border-zinc-200 px-3 py-2 md:col-span-2" placeholder="Site description" />
          <input {...form.register("logoUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Logo URL" />
          <input {...form.register("faviconUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Favicon URL" />
          <button disabled={form.formState.isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">
            {form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {form.formState.isSubmitting ? "Saving..." : "Save settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
