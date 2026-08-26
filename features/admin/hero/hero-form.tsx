"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { heroFormSchema } from "@/lib/validations/hero";
import { deleteHeroResume, upsertHero, uploadHeroImage, uploadHeroResume } from "@/lib/actions/hero";
import { ImageUpload } from "@/components/common/image-upload";
import { ConfirmActionButton } from "@/components/common/confirm-action-button";

type HeroFormValues = {
  fullName: string;
  professionalTitle: string;
  headline: string;
  subheadline: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  enableResumeDownload: boolean;
  resumeButtonText: string;
  showSocialLinks: boolean;
  showAvailabilityBadge: boolean;
  availabilityStatus?: "Available" | "Busy" | "Open to Work";
  location: string;
  yearsOfExperience?: number;
  heading: string;
  subHeading: string;
  ctaLabel: string;
  ctaHref: string;
  resumeButtonLabel: string;
  resumeButtonHref: string;
};

export function HeroForm({ hero }: { hero: { fullName: string | null; professionalTitle: string | null; headline: string | null; subheadline: string | null; primaryButtonText: string | null; primaryButtonUrl: string | null; secondaryButtonText: string | null; secondaryButtonUrl: string | null; enableResumeDownload: boolean | null; resumeUrl: string | null; resumeFileName: string | null; resumeButtonText: string | null; showSocialLinks: boolean | null; showAvailabilityBadge: boolean | null; availabilityStatus: string | null; location: string | null; yearsOfExperience: number | null; heading: string | null; subHeading: string | null; ctaLabel: string | null; ctaHref: string | null; resumeButtonLabel: string | null; resumeButtonHref: string | null; backgroundImageUrl: string | null; heroImageUrl: string | null; } | null }) {
  const [resumeFileName, setResumeFileName] = useState<string | null>(hero?.resumeFileName ?? null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const methods = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema) as never,
    defaultValues: {
      fullName: hero?.fullName ?? "",
      professionalTitle: hero?.professionalTitle ?? "",
      headline: hero?.headline ?? hero?.heading ?? "",
      subheadline: hero?.subheadline ?? hero?.subHeading ?? "",
      primaryButtonText: hero?.primaryButtonText ?? hero?.ctaLabel ?? "",
      primaryButtonUrl: hero?.primaryButtonUrl ?? hero?.ctaHref ?? "",
      secondaryButtonText: hero?.secondaryButtonText ?? "",
      secondaryButtonUrl: hero?.secondaryButtonUrl ?? "",
      enableResumeDownload: hero?.enableResumeDownload ?? false,
      resumeButtonText: hero?.resumeButtonText ?? hero?.resumeButtonLabel ?? "Download Resume",
      showSocialLinks: hero?.showSocialLinks ?? false,
      showAvailabilityBadge: hero?.showAvailabilityBadge ?? false,
      availabilityStatus: (hero?.availabilityStatus as HeroFormValues["availabilityStatus"]) ?? "Available",
      location: hero?.location ?? "",
      yearsOfExperience: hero?.yearsOfExperience ?? undefined,
      heading: hero?.heading ?? "",
      subHeading: hero?.subHeading ?? "",
      ctaLabel: hero?.ctaLabel ?? "",
      ctaHref: hero?.ctaHref ?? "",
      resumeButtonLabel: hero?.resumeButtonLabel ?? "",
      resumeButtonHref: hero?.resumeButtonHref ?? "",
    },
  });

  async function handleResumeUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeUploading(true);
    setResumeError(null);

    try {
      const result = await uploadHeroResume(file);
      setResumeFileName(result.fileName);
      methods.setValue("resumeButtonText", methods.getValues("resumeButtonText") || "Download Resume");
    } catch (error) {
      setResumeError(error instanceof Error ? error.message : "Unable to upload resume.");
    } finally {
      setResumeUploading(false);
      event.target.value = "";
    }
  }

  async function handleDeleteResume() {
    setResumeUploading(true);
    setResumeError(null);
    try {
      await deleteHeroResume();
      setResumeFileName(null);
    } catch (error) {
      setResumeError(error instanceof Error ? error.message : "Unable to delete resume.");
    } finally {
      setResumeUploading(false);
    }
  }

  async function handleSubmit(values: HeroFormValues) {
    setSaveStatus(null);

    try {
      await upsertHero(values);
      setSaveStatus({ type: "success", message: "Hero section saved successfully." });
    } catch {
      setSaveStatus({ type: "error", message: "Unable to save the hero section. Please try again." });
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Full name</label>
              <input {...methods.register("fullName")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Professional title</label>
              <input {...methods.register("professionalTitle")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Headline</label>
            <input {...methods.register("headline")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Subheadline</label>
            <textarea {...methods.register("subheadline")} rows={4} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Primary button text</label>
              <input {...methods.register("primaryButtonText")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Primary button URL</label>
              <input {...methods.register("primaryButtonUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Secondary button text</label>
              <input {...methods.register("secondaryButtonText")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Secondary button URL</label>
              <input {...methods.register("secondaryButtonUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" {...methods.register("enableResumeDownload")} className="h-4 w-4 rounded border-zinc-300" />
              <label className="text-sm font-medium text-zinc-700">Enable resume download</label>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-zinc-700">Resume upload (PDF, DOC, DOCX up to 10MB)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2" />
              {resumeUploading ? <p className="text-sm text-zinc-500">Uploading…</p> : null}
              {resumeError ? <p className="text-sm text-rose-600">{resumeError}</p> : null}
              {resumeFileName ? <p className="text-sm text-zinc-600">Current file: {resumeFileName}</p> : <p className="text-sm text-zinc-500">No resume uploaded yet.</p>}
              <div className="flex gap-3">
                <label className="text-sm font-medium text-zinc-700">Resume button text</label>
                <input {...methods.register("resumeButtonText")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
              </div>
              <ConfirmActionButton onConfirm={handleDeleteResume} title="Delete this resume?" description="The uploaded resume will be removed from the hero section." className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700">Delete Resume</ConfirmActionButton>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Location</label>
              <input {...methods.register("location")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Years of experience</label>
              <input type="number" min="0" max="80" {...methods.register("yearsOfExperience", { valueAsNumber: true })} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <input type="checkbox" {...methods.register("showSocialLinks")} className="h-4 w-4 rounded border-zinc-300" />
              <label className="text-sm font-medium text-zinc-700">Show social links</label>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <input type="checkbox" {...methods.register("showAvailabilityBadge")} className="h-4 w-4 rounded border-zinc-300" />
              <label className="text-sm font-medium text-zinc-700">Show availability badge</label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Availability status</label>
            <select {...methods.register("availabilityStatus")} className="w-full rounded-xl border border-zinc-200 px-3 py-2">
              <option value="">Select status</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Open to Work">Open to Work</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={methods.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">
              {methods.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {methods.formState.isSubmitting ? "Saving..." : "Save Hero"}
            </button>
            {saveStatus ? (
              <p role="status" className={`inline-flex items-center gap-2 text-sm font-medium ${saveStatus.type === "success" ? "text-emerald-700" : "text-rose-700"}`}>
                {saveStatus.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
                {saveStatus.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <ImageUpload
            label="Background image"
            value={hero?.backgroundImageUrl ?? null}
            onUpload={async (file) => {
              await uploadHeroImage(file, "backgroundImageUrl");
            }}
          />
          <ImageUpload
            label="Hero image"
            value={hero?.heroImageUrl ?? null}
            onUpload={async (file) => {
              await uploadHeroImage(file, "heroImageUrl");
            }}
          />
        </div>
      </div>
    </form>
  );
}
