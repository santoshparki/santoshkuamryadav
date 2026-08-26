"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { createService, deleteService, updateService } from "@/lib/actions/services";
import { ConfirmActionButton } from "@/components/common/confirm-action-button";

type ServiceItem = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  features: string[];
  displayOrder: number;
};

type ServiceFormValues = {
  title: string;
  description: string;
  icon: string;
  features: string;
  displayOrder: number;
};

export function ServicesAdmin({ services }: { services: ServiceItem[] | null | undefined }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ServiceFormValues>({
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      features: "",
      displayOrder: 0,
    },
  });

  async function handleSubmit(values: ServiceFormValues) {
    try {
      setError(null);
      setMessage(null);
      if (selectedId) {
        await updateService(selectedId, values);
        setMessage("Service updated.");
      } else {
        await createService(values);
        setMessage("Service created.");
      }
      form.reset({
        title: "",
        description: "",
        icon: "",
        features: "",
        displayOrder: 0,
      });
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save service.");
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      setMessage(null);
      await deleteService(id);
      setMessage("Service deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete service.");
    }
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">{selectedId ? "Edit service" : "Add service"}</h2>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-3">
            <input {...form.register("title")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Service title" />
            <input {...form.register("icon")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Icon" />
            <textarea {...form.register("description")} rows={4} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Description" />
            <textarea {...form.register("features")} rows={3} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Key features (comma separated)" />
            <input type="number" {...form.register("displayOrder", { valueAsNumber: true })} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Display order" />
            <button disabled={form.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">{form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{form.formState.isSubmitting ? "Saving..." : selectedId ? "Update" : "Create"}</button>
          </form>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Services</h2>
          <div className="mt-6 space-y-3">
            {(services ?? []).map((item) => (
              <div key={item.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{item.title}</p>
                    <p className="text-sm text-zinc-500">{item.description ?? "No description yet."}</p>
                  </div>
                  <div className="text-sm text-zinc-500">
                    <p>Features: {item.features.length}</p>
                    <p>Order: {item.displayOrder}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => {
                    setSelectedId(item.id);
                    form.reset({
                      title: item.title,
                      description: item.description ?? "",
                      icon: item.icon ?? "",
                      features: item.features.join(", "),
                      displayOrder: item.displayOrder,
                    });
                  }} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700">Edit</button>
                  <ConfirmActionButton onConfirm={() => handleDelete(item.id)} title="Delete this service?" className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700">Delete</ConfirmActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
