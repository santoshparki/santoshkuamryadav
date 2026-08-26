"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { createAboutTag, deleteAboutTag, updateAboutTag } from "@/lib/actions/about";
import { ConfirmActionButton } from "@/components/common/confirm-action-button";

type AboutTagItem = {
  id: string;
  label: string;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
};

type AboutTagFormValues = {
  label: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
};

export function AboutTagsAdmin({ aboutId, tags }: { aboutId: string; tags: AboutTagItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AboutTagFormValues>({
    defaultValues: {
      label: "",
      icon: "",
      displayOrder: 0,
      isActive: true,
    },
  });

  async function handleSubmit(values: AboutTagFormValues) {
    try {
      setMessage(null);
      setError(null);
      const iconValue = values.icon.trim() || undefined;
      if (selectedId) {
        await updateAboutTag(selectedId, {
          label: values.label,
          icon: iconValue,
          displayOrder: values.displayOrder,
          isActive: values.isActive,
        });
        setMessage("Tag updated.");
      } else {
        await createAboutTag(aboutId, {
          label: values.label,
          icon: iconValue,
          displayOrder: values.displayOrder,
          isActive: values.isActive,
        });
        setMessage("Tag created.");
      }
      form.reset({ label: "", icon: "", displayOrder: 0, isActive: true });
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save tag.");
    }
  }

  async function handleDelete(id: string) {
    try {
      setMessage(null);
      setError(null);
      await deleteAboutTag(id);
      setMessage("Tag deleted.");
      if (selectedId === id) {
        form.reset({ label: "", icon: "", displayOrder: 0, isActive: true });
        setSelectedId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete tag.");
    }
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">{selectedId ? "Edit highlight tag" : "Add highlight tag"}</h2>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Label</label>
              <input {...form.register("label")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="⚡ Electrical Engineer" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Icon</label>
              <input {...form.register("icon")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Optional emoji or icon text" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Display order</label>
              <input type="number" {...form.register("displayOrder", { valueAsNumber: true })} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" {...form.register("isActive")} className="h-4 w-4 rounded border-zinc-300" />
                Active
              </label>
            </div>
            <button disabled={form.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">{form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{form.formState.isSubmitting ? "Saving..." : selectedId ? "Update tag" : "Create tag"}</button>
          </form>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Highlight tags</h2>
          <div className="mt-6 space-y-3">
            {tags.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                No tags yet. Add highlight tags for the About section.
              </div>
            ) : (
              tags.map((tag) => (
                <div key={tag.id} className="rounded-2xl border border-zinc-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-950">{tag.label}</p>
                      <p className="mt-1 text-xs text-zinc-500">Order: {tag.displayOrder} • {tag.isActive ? "Active" : "Disabled"}</p>
                      {tag.icon ? <p className="mt-2 text-sm text-zinc-600">Icon: {tag.icon}</p> : null}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(tag.id);
                          form.reset({
                            label: tag.label,
                            icon: tag.icon ?? "",
                            displayOrder: tag.displayOrder,
                            isActive: tag.isActive,
                          });
                        }}
                        className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700"
                      >
                        Edit
                      </button>
                        <ConfirmActionButton onConfirm={() => handleDelete(tag.id)} title="Delete this About tag?" className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700">Delete</ConfirmActionButton>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
