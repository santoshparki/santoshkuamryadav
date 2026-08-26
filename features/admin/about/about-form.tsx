"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { aboutFormSchema } from "@/lib/validations/about";
import { upsertAbout } from "@/lib/actions/about";

type AboutFormValues = {
  sectionTitle: string;
  sectionSubtitle: string;
  shortBio: string;
  longBio: string;
  readMoreButtonText: string;
  showLessButtonText: string;
};

export function AboutForm({ about }: { about: { sectionTitle: string | null; sectionSubtitle: string | null; readMoreButtonText: string | null; showLessButtonText: string | null; shortBio: string | null; longBio: string | null; } | null }) {
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const methods = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema) as never,
    defaultValues: {
      sectionTitle: about?.sectionTitle ?? "",
      sectionSubtitle: about?.sectionSubtitle ?? "",
      shortBio: about?.shortBio ?? "",
      longBio: about?.longBio ?? "",
      readMoreButtonText: about?.readMoreButtonText ?? "Know More About Me",
      showLessButtonText: about?.showLessButtonText ?? "Show Less",
    },
  });

  async function handleSubmit(values: AboutFormValues) {
    setSaveStatus(null);

    try {
      await upsertAbout(values);
      setSaveStatus({ type: "success", message: "About section saved successfully." });
    } catch {
      setSaveStatus({ type: "error", message: "Unable to save the About section. Please try again." });
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Section title</label>
            <input {...methods.register("sectionTitle")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Section subtitle</label>
            <input {...methods.register("sectionSubtitle")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Short bio</label>
            <textarea {...methods.register("shortBio")} rows={3} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Long bio</label>
            <textarea {...methods.register("longBio")} rows={6} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Read more button text</label>
              <input {...methods.register("readMoreButtonText")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Show less button text</label>
              <input {...methods.register("showLessButtonText")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={methods.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">
              {methods.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {methods.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            {saveStatus ? (
              <p role="status" className={`inline-flex items-center gap-2 text-sm font-medium ${saveStatus.type === "success" ? "text-emerald-700" : "text-rose-700"}`}>
                {saveStatus.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
                {saveStatus.message}
              </p>
            ) : null}
          </div>
        </div>

      </div>
    </form>
  );
}
