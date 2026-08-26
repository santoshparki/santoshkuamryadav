"use client";

import { useState } from "react";
import { createCustomHomepageSection, deleteCustomHomepageSection, reorderHomepageSections, resetHomepageSectionOrder, updateCustomHomepageSection, updateHomepageSectionVisibility } from "@/lib/actions/homepage-sections";

const sections = [
  ["about", "About"], ["skills", "Skills"], ["projects", "Projects"], ["experience", "Experience"],
  ["education", "Education"], ["certificates", "Certificates"], ["services", "Services"], ["contact", "Contact"],
] as const;

export function HomepageSectionsAdmin({ saved }: { saved: { key: string; isVisible: boolean; sortOrder: number; title: string | null; description: string | null }[] }) {
  const [items, setItems] = useState(() => [...sections.map(([key, label], index) => ({ key, label, isVisible: saved.find((item) => item.key === key)?.isVisible ?? true, sortOrder: saved.find((item) => item.key === key)?.sortOrder ?? (index + 1) * 10, title: null as string | null, description: null as string | null })), ...saved.filter((item) => !sections.some(([key]) => key === item.key)).map((item) => ({ key: item.key, label: item.title || "Custom section", isVisible: item.isVisible, sortOrder: item.sortOrder, title: item.title, description: item.description }))].sort((a, b) => a.sortOrder - b.sortOrder));
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);

  async function toggle(key: string) {
    const current = items.find((item) => item.key === key)?.isVisible ?? true;
    const next = !current;
    setSaving(key); setMessage(null);
    try { await updateHomepageSectionVisibility(key, next); setItems((current) => current.map((item) => item.key === key ? { ...item, isVisible: next } : item)); setMessage("Homepage visibility updated."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update visibility."); }
    finally { setSaving(null); }
  }

  async function move(key: string, direction: -1 | 1) {
    const index = items.findIndex((item) => item.key === key);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return;
    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    setItems(nextItems); setMessage(null);
    try { await reorderHomepageSections(nextItems.map((item) => item.key)); setMessage("Homepage order updated."); }
    catch { setMessage("Unable to update homepage order."); }
  }

  async function addCustomSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving("custom"); setMessage(null);
    try { const created = await createCustomHomepageSection(title, description); setItems((current) => [...current, { key: created.key, label: title.trim(), isVisible: true, sortOrder: created.sortOrder, title: title.trim(), description: description.trim() }]); setTitle(""); setDescription(""); setMessage("Custom section added."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to add section."); }
    finally { setSaving(null); }
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>, key: string) {
    event.preventDefault();
    const item = items.find((current) => current.key === key);
    if (!item || !item.title || !item.description) return;
    setSaving(key); setMessage(null);
    try { const updated = await updateCustomHomepageSection(key, item.title, item.description); setItems((current) => current.map((entry) => entry.key === key ? { ...entry, label: updated.title || entry.label } : entry)); setEditingKey(null); setMessage("Custom section updated."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update section."); }
    finally { setSaving(null); }
  }

  async function removeCustomSection(key: string) {
    if (!window.confirm("Delete this custom section?")) return;
    setSaving(key); setMessage(null);
    try { await deleteCustomHomepageSection(key); setItems((current) => current.filter((item) => item.key !== key)); setMessage("Custom section deleted."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to delete section."); }
    finally { setSaving(null); }
  }

  async function restoreOrder() {
    setSaving("reset"); setMessage(null);
    try { await resetHomepageSectionOrder(); setItems((current) => [...current].sort((a, b) => a.key.startsWith("custom-") === b.key.startsWith("custom-") ? a.sortOrder - b.sortOrder : a.key.startsWith("custom-") ? 1 : -1).map((item, index) => ({ ...item, sortOrder: (index + 1) * 10 }))); setMessage("Default order restored."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to restore order."); }
    finally { setSaving(null); }
  }

  return <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-zinc-950">Homepage sections</h2>
    <p className="mt-2 text-sm text-zinc-600">Choose which full sections appear on the public homepage.</p>
    <button type="button" onClick={restoreOrder} disabled={saving === "reset"} className="mt-4 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700">{saving === "reset" ? "Restoring…" : "Restore default order"}</button>
    {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
    <div className="mt-5 divide-y divide-zinc-100 rounded-2xl border border-zinc-200">
      {items.map((item, index) => <div key={item.key} className="flex items-center justify-between gap-4 px-4 py-4"><div className="min-w-0 flex-1"><span className="font-medium text-zinc-800">{index + 1}. {item.label}</span><div className="mt-2 flex flex-wrap gap-2"><button type="button" disabled={index === 0} onClick={() => move(item.key, -1)} className="rounded-md border border-zinc-200 px-2 py-1 text-xs disabled:opacity-40" aria-label={`Move ${item.label} up`}>Up</button><button type="button" disabled={index === items.length - 1} onClick={() => move(item.key, 1)} className="rounded-md border border-zinc-200 px-2 py-1 text-xs disabled:opacity-40" aria-label={`Move ${item.label} down`}>Down</button>{item.key.startsWith("custom-") ? <><button type="button" onClick={() => setEditingKey(editingKey === item.key ? null : item.key)} className="rounded-md border border-zinc-200 px-2 py-1 text-xs">{editingKey === item.key ? "Cancel" : "Edit"}</button><button type="button" disabled={saving === item.key} onClick={() => removeCustomSection(item.key)} className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700">Delete</button></> : null}</div>{editingKey === item.key ? <form onSubmit={(event) => saveEdit(event, item.key)} className="mt-3 space-y-2"><input value={item.title || ""} onChange={(event) => setItems((current) => current.map((entry) => entry.key === item.key ? { ...entry, title: event.target.value, label: event.target.value } : entry))} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900" /><textarea value={item.description || ""} onChange={(event) => setItems((current) => current.map((entry) => entry.key === item.key ? { ...entry, description: event.target.value } : entry))} rows={3} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900" /><button type="submit" disabled={saving === item.key} className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-semibold text-white">Save changes</button></form> : null}</div><button type="button" disabled={saving === item.key} onClick={() => toggle(item.key)} className={`rounded-full px-4 py-2 text-sm font-semibold ${item.isVisible ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600"}`}>{saving === item.key ? "Saving…" : item.isVisible ? "Visible" : "Hidden"}</button></div>)}
    </div>
    <form onSubmit={addCustomSection} className="mt-6 space-y-3 rounded-2xl border border-zinc-200 p-4">
      <h3 className="font-semibold text-zinc-900">Add custom section</h3>
      <input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={100} placeholder="Section title" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900" />
      <textarea value={description} onChange={(event) => setDescription(event.target.value)} required maxLength={2000} rows={4} placeholder="Section content" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900" />
      <button type="submit" disabled={saving === "custom"} className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">{saving === "custom" ? "Adding…" : "Add section"}</button>
    </form>
  </div>;
}
