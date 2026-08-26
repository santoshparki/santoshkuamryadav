"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { createEducation, deleteEducation, updateEducation } from "@/lib/actions/education";
import { ConfirmActionButton } from "@/components/common/confirm-action-button";

type EducationItem = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  location: string | null;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  sortOrder: number;
};

type EducationFormValues = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
};

export function EducationAdmin({ education }: { education: EducationItem[] | null | undefined }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EducationFormValues>({
    defaultValues: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      description: "",
      startDate: "",
      endDate: "",
      sortOrder: 0,
    },
  });

  async function handleSubmit(values: EducationFormValues) {
    try {
      setError(null);
      setMessage(null);
      if (selectedId) {
        await updateEducation(selectedId, values);
        setMessage("Education updated.");
      } else {
        await createEducation(values);
        setMessage("Education created.");
      }
      form.reset({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
        sortOrder: 0,
      });
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save education entry.");
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      setMessage(null);
      await deleteEducation(id);
      setMessage("Education entry deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete education entry.");
    }
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">{selectedId ? "Edit education" : "Add education"}</h2>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-3">
            <input {...form.register("institution")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Institution" />
            <input {...form.register("degree")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Degree" />
            <input {...form.register("fieldOfStudy")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Field of study" />
            <input {...form.register("location")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Location" />
            <textarea {...form.register("description")} rows={4} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Description" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="date" {...form.register("startDate")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
              <input type="date" {...form.register("endDate")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
            <input type="number" {...form.register("sortOrder", { valueAsNumber: true })} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Sort order" />
            <button disabled={form.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">{form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{form.formState.isSubmitting ? "Saving..." : selectedId ? "Update" : "Create"}</button>
          </form>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Education history</h2>
          <div className="mt-6 space-y-3">
            {(education ?? []).map((item) => (
              <div key={item.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{item.degree} · {item.institution}</p>
                    <p className="text-sm text-zinc-500">{item.fieldOfStudy ?? "General studies"}</p>
                    <p className="mt-2 text-sm text-zinc-600">{item.description ?? "No description yet."}</p>
                  </div>
                  <div className="text-sm text-zinc-500">Order: {item.sortOrder}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => {
                    setSelectedId(item.id);
                    form.reset({
                      institution: item.institution,
                      degree: item.degree,
                      fieldOfStudy: item.fieldOfStudy ?? "",
                      location: item.location ?? "",
                      description: item.description ?? "",
                      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 10) : "",
                      endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 10) : "",
                      sortOrder: item.sortOrder,
                    });
                  }} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700">Edit</button>
                  <ConfirmActionButton onConfirm={() => handleDelete(item.id)} title="Delete this education entry?" className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700">Delete</ConfirmActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
