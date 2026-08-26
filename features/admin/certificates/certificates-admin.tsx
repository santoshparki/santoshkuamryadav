"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { createCertificate, deleteCertificate, updateCertificate } from "@/lib/actions/certificates";
import { ConfirmActionButton } from "@/components/common/confirm-action-button";

type CertificateItem = {
  id: string;
  title: string;
  issuer: string;
  credentialUrl: string | null;
  issueDate: Date | null;
  description: string | null;
  sortOrder: number;
};

type CertificateFormValues = {
  title: string;
  issuer: string;
  credentialUrl: string;
  issueDate: string;
  description: string;
  sortOrder: number;
};

export function CertificatesAdmin({ certificates }: { certificates: CertificateItem[] | null | undefined }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CertificateFormValues>({
    defaultValues: {
      title: "",
      issuer: "",
      credentialUrl: "",
      issueDate: "",
      description: "",
      sortOrder: 0,
    },
  });

  async function handleSubmit(values: CertificateFormValues) {
    try {
      setError(null);
      setMessage(null);
      if (selectedId) {
        await updateCertificate(selectedId, values);
        setMessage("Certificate updated.");
      } else {
        await createCertificate(values);
        setMessage("Certificate created.");
      }
      form.reset({
        title: "",
        issuer: "",
        credentialUrl: "",
        issueDate: "",
        description: "",
        sortOrder: 0,
      });
      setSelectedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save certificate.");
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      setMessage(null);
      await deleteCertificate(id);
      setMessage("Certificate deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete certificate.");
    }
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">{selectedId ? "Edit certificate" : "Add certificate"}</h2>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-3">
            <input {...form.register("title")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Certificate title" />
            <input {...form.register("issuer")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Issuer" />
            <input {...form.register("credentialUrl")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Credential URL" />
            <input type="date" {...form.register("issueDate")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" />
            <textarea {...form.register("description")} rows={4} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Description" />
            <input type="number" {...form.register("sortOrder", { valueAsNumber: true })} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Sort order" />
            <button disabled={form.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">{form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{form.formState.isSubmitting ? "Saving..." : selectedId ? "Update" : "Create"}</button>
          </form>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">Certificates</h2>
          <div className="mt-6 space-y-3">
            {(certificates ?? []).map((item) => (
              <div key={item.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{item.title}</p>
                    <p className="text-sm text-zinc-500">{item.issuer}</p>
                    <p className="mt-2 text-sm text-zinc-600">{item.description ?? "No description yet."}</p>
                  </div>
                  <div className="text-sm text-zinc-500">Order: {item.sortOrder}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => {
                    setSelectedId(item.id);
                    form.reset({
                      title: item.title,
                      issuer: item.issuer,
                      credentialUrl: item.credentialUrl ?? "",
                      issueDate: item.issueDate ? new Date(item.issueDate).toISOString().slice(0, 10) : "",
                      description: item.description ?? "",
                      sortOrder: item.sortOrder,
                    });
                  }} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700">Edit</button>
                  <ConfirmActionButton onConfirm={() => handleDelete(item.id)} title="Delete this certificate?" className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700">Delete</ConfirmActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
