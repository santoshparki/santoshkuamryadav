"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

type ImageUploadProps = {
  label: string;
  value?: string | null;
  onUpload: (file: File) => Promise<void>;
  uploading?: boolean;
};

export function ImageUpload({ label, value, onUpload, uploading = false }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    await onUpload(file);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center transition hover:border-zinc-400">
        <UploadCloud className="h-8 w-8 text-zinc-400" />
        <span className="mt-3 text-sm font-medium text-zinc-700">Choose a file</span>
        <span className="mt-1 text-xs text-zinc-500">PNG, JPG, WEBP up to 5MB</span>
        <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
      </label>
      {uploading ? <p className="text-sm text-zinc-500">Uploading…</p> : null}
      {previewUrl ? (
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <Image src={previewUrl} alt={label} width={640} height={160} unoptimized className="h-40 w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
