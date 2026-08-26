"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { createSkill, createSkillCategory, deleteSkill, updateSkill } from "@/lib/actions/skills";
import { skillCategoryFormSchema, skillFormSchema } from "@/lib/validations/skills";
import { ConfirmActionButton } from "@/components/common/confirm-action-button";

type SkillCategory = { id: string; name: string; slug: string; description: string | null; sortOrder: number };
type SkillItem = {
  id: string;
  name: string;
  icon: string | null;
  level: string | null;
  percentage: number | null;
  description: string | null;
  sortOrder: number;
  isFeatured: boolean;
  categoryId: string | null;
  category: { id: string; name: string } | null;
};

type SkillFormValues = {
  name: string;
  icon: string;
  level: string;
  percentage: number;
  description: string;
  sortOrder: number;
  isFeatured: boolean;
  categoryId: string;
};

type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export function SkillsAdmin({ skills, categories, search }: { skills: SkillItem[]; categories: SkillCategory[]; search: string }) {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema) as never,
    defaultValues: {
      name: "",
      icon: "",
      level: "Intermediate",
      percentage: 80,
      description: "",
      sortOrder: 0,
      isFeatured: false,
      categoryId: categories[0]?.id ?? "",
    },
  });

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(skillCategoryFormSchema) as never,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sortOrder: 0,
    },
  });

  async function handleCreateSkill(values: SkillFormValues) {
    try {
      setError(null);
      setMessage(null);
      if (selectedSkillId) {
        await updateSkill(selectedSkillId, values);
        setMessage("Skill updated.");
      } else {
        await createSkill(values);
        setMessage("Skill created.");
      }
      skillForm.reset();
      setSelectedSkillId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save skill.");
    }
  }

  async function handleCreateCategory(values: CategoryFormValues) {
    try {
      setError(null);
      setMessage(null);
      await createSkillCategory(values);
      categoryForm.reset();
      setMessage("Category created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create category.");
    }
  }

  async function handleDeleteSkill(id: string) {
    try {
      setError(null);
      setMessage(null);
      await deleteSkill(id);
      setMessage("Skill deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete skill.");
    }
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">Add category</h2>
            <form onSubmit={categoryForm.handleSubmit(handleCreateCategory)} className="mt-4 space-y-3">
              <input {...categoryForm.register("name")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Category name" />
              <input {...categoryForm.register("slug")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="slug" />
              <input type="number" {...categoryForm.register("sortOrder", { valueAsNumber: true })} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Sort order" />
              <textarea {...categoryForm.register("description")} rows={3} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Description" />
              <button disabled={categoryForm.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">
                {categoryForm.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {categoryForm.formState.isSubmitting ? "Creating..." : "Create category"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">{selectedSkillId ? "Edit skill" : "Add skill"}</h2>
            <form onSubmit={skillForm.handleSubmit(handleCreateSkill)} className="mt-4 space-y-3">
              <input {...skillForm.register("name")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Skill name" />
              <input {...skillForm.register("icon")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Icon (e.g. React)" />
              <input {...skillForm.register("level")} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Level" />
              <input type="number" min="0" max="100" {...skillForm.register("percentage", { valueAsNumber: true })} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Percentage" />
              <select {...skillForm.register("categoryId")} className="w-full rounded-xl border border-zinc-200 px-3 py-2">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <textarea {...skillForm.register("description")} rows={3} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Description" />
              <input type="number" {...skillForm.register("sortOrder", { valueAsNumber: true })} className="w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Sort order" />
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" {...skillForm.register("isFeatured")} />
                Featured skill
              </label>
              <button disabled={skillForm.formState.isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">
                {skillForm.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {skillForm.formState.isSubmitting ? "Saving..." : selectedSkillId ? "Update skill" : "Create skill"}
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-950">Skills</h2>
            <form method="GET">
              <input name="search" defaultValue={search} className="rounded-xl border border-zinc-200 px-3 py-2" placeholder="Search skills" />
            </form>
          </div>

          <div className="mt-6 space-y-3">
            {skills.map((skill) => (
              <div key={skill.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{skill.name}</p>
                    <p className="text-sm text-zinc-500">{skill.category?.name ?? "Uncategorized"}</p>
                    <p className="mt-2 text-sm text-zinc-600">{skill.description ?? "No description provided."}</p>
                  </div>
                  <div className="text-sm text-zinc-500">
                    <p>Level: {skill.level ?? "—"}</p>
                    <p>Percent: {skill.percentage ?? 0}%</p>
                    <p>Featured: {skill.isFeatured ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => {
                    setSelectedSkillId(skill.id);
                    skillForm.reset({
                      name: skill.name,
                      icon: skill.icon ?? "",
                      level: skill.level ?? "Intermediate",
                      percentage: skill.percentage ?? 80,
                      description: skill.description ?? "",
                      sortOrder: skill.sortOrder,
                      isFeatured: skill.isFeatured,
                      categoryId: skill.categoryId ?? categories[0]?.id ?? "",
                    });
                  }} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700">Edit</button>
                  <ConfirmActionButton onConfirm={() => handleDeleteSkill(skill.id)} title="Delete this skill?" className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700">Delete</ConfirmActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
