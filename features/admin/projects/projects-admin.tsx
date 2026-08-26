"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { ConfirmActionButton } from "@/components/common/confirm-action-button";
import {
  createProject,
  deleteProject,
  deleteProjectImage,
  replaceProjectImage,
  reorderProjectImages,
  updateProject,
  updateProjectImageAltText,
  uploadProjectImage,
} from "@/lib/actions/projects";
import { projectFormSchema } from "@/lib/validations/projects";

type ProjectImageItem = {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
};

type PendingImage = {
  file: File;
  previewUrl: string;
};

type ProjectItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  category: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  githubUrl: string | null;
  liveUrl: string | null;
  technologies: string[];
  images: ProjectImageItem[];
};

type ProjectFormValues = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  githubUrl: string;
  liveUrl: string;
  technologies: string;
};

export function ProjectsAdmin({ projects, search }: { projects: ProjectItem[]; search: string }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectImages, setSelectedProjectImages] = useState<ProjectImageItem[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [imageAlts, setImageAlts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [replaceUploadingId, setReplaceUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const projectForm = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema) as never,
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: "",
      status: "DRAFT",
      featured: false,
      githubUrl: "",
      liveUrl: "",
      technologies: "",
    },
  });

  async function handleSubmit(values: ProjectFormValues) {
    try {
      setError(null);
      setMessage(null);
      if (selectedProjectId) {
        await updateProject(selectedProjectId, values);
        setMessage("Project updated.");
        projectForm.reset(values);
      } else {
        const created = await createProject(values);
        if (created?.id) {
          setSelectedProjectId(created.id);
          setSelectedProjectImages([]);
          setImageAlts({});
          const imagesToUpload = pendingImages.map((image) => image.file);
          if (imagesToUpload.length > 0) {
            await uploadFilesForProject(created.id, imagesToUpload, 0);
          } else {
            setMessage("Project created.");
          }
          pendingImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
          setPendingImages([]);
          projectForm.reset({
            title: "",
            slug: "",
            shortDescription: "",
            description: "",
            category: "",
            status: "DRAFT",
            featured: false,
            githubUrl: "",
            liveUrl: "",
            technologies: "",
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save project.");
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      setMessage(null);
      await deleteProject(id);
      if (selectedProjectId === id) {
        setSelectedProjectId(null);
        setSelectedProjectImages([]);
        setImageAlts({});
      }
      setMessage("Project deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete project.");
    }
  }

  async function uploadFilesForProject(projectId: string, files: FileList | File[], existingImageCount: number) {
    const incoming = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (incoming.length === 0) {
      setError("Please choose valid image files.");
      return;
    }

    const availableSlots = 10 - existingImageCount;
    if (availableSlots <= 0) {
      setError("You can upload up to 10 images per project.");
      return;
    }

    const toUpload = incoming.slice(0, availableSlots);
    if (incoming.length > availableSlots) {
      setMessage(`Only ${availableSlots} images were accepted to keep the gallery under 10 items.`);
    }

    try {
      setError(null);
      const uploaded: ProjectImageItem[] = [];
      for (const file of toUpload) {
        const image = await uploadProjectImage(projectId, file);
        uploaded.push(image as ProjectImageItem);
      }
      setSelectedProjectImages((current) => [...current, ...uploaded]);
      setImageAlts((current) => ({ ...current, ...Object.fromEntries(uploaded.map((image) => [image.id, image.caption ?? ""])) }));
      setMessage("Images uploaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload images.");
    } finally {
    }
  }

  async function handleUploadFiles(files: FileList | File[]) {
    if (!selectedProjectId) {
      addPendingImages(files);
      return;
    }

    await uploadFilesForProject(selectedProjectId, files, selectedProjectImages.length);
  }

  function addPendingImages(files: FileList | File[]) {
    const incoming = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (incoming.length === 0) {
      setError("Please choose valid image files.");
      return;
    }

    const availableSlots = 10 - pendingImages.length;
    if (availableSlots <= 0) {
      setError("You can upload up to 10 images per project.");
      return;
    }

    const accepted = incoming.slice(0, availableSlots).map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    if (incoming.length > availableSlots) {
      setMessage(`Only ${availableSlots} images were selected to keep the gallery under 10 items.`);
    }
    setError(null);
    setPendingImages((current) => [...current, ...accepted]);
  }

  function removePendingImage(index: number) {
    setPendingImages((current) => {
      const image = current[index];
      if (image) URL.revokeObjectURL(image.previewUrl);
      return current.filter((_, imageIndex) => imageIndex !== index);
    });
  }

  async function handleImageInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    await handleUploadFiles(files);
    event.target.value = "";
  }

  async function handleReplaceImage(imageId: string, file: File) {
    try {
      setReplaceUploadingId(imageId);
      setError(null);
      const image = await replaceProjectImage(imageId, file);
      setSelectedProjectImages((current) => current.map((item) => (item.id === imageId ? { ...item, url: image.url } : item)));
      setMessage("Image replaced.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to replace image.");
    } finally {
      setReplaceUploadingId(null);
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      setError(null);
      await deleteProjectImage(imageId);
      setSelectedProjectImages((current) => current.filter((item) => item.id !== imageId));
      setMessage("Image removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete image.");
    }
  }

  async function handleSaveAltText(imageId: string) {
    try {
      setError(null);
      const altText = imageAlts[imageId] ?? "";
      await updateProjectImageAltText(imageId, altText);
      setSelectedProjectImages((current) => current.map((item) => (item.id === imageId ? { ...item, caption: altText } : item)));
      setMessage("Image caption updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update caption.");
    }
  }

  async function handleMoveImage(imageId: string, direction: -1 | 1) {
    const index = selectedProjectImages.findIndex((item) => item.id === imageId);
    if (index === -1) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= selectedProjectImages.length) return;

    const reordered = [...selectedProjectImages];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, moved);

    try {
      setSelectedProjectImages(reordered.map((item, idx) => ({ ...item, sortOrder: idx })));
      await reorderProjectImages(selectedProjectId!, reordered.map((item) => item.id));
      setMessage("Image order updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reorder images.");
    }
  }

  function selectProject(project: ProjectItem) {
    setSelectedProjectId(project.id);
    projectForm.reset({
      title: project.title ?? "",
      slug: project.slug ?? "",
      category: project.category ?? "",
      shortDescription: project.shortDescription ?? "",
      description: project.description ?? "",
      githubUrl: project.githubUrl ?? "",
      liveUrl: project.liveUrl ?? "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.filter(Boolean).join(", ")
        : (project.technologies ?? "") || "",
      status: project.status ?? "DRAFT",
      featured: project.featured ?? false,
    });
    const sortedImages = [...project.images].sort((a, b) => a.sortOrder - b.sortOrder);
    setSelectedProjectImages(sortedImages);
    setImageAlts(Object.fromEntries(sortedImages.map((image) => [image.id, image.caption ?? ""])));
  }

  return (
    <div className="space-y-6">
      {message ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</div> : null}
      {error ? <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><CircleAlert className="h-4 w-4" />{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">{selectedProjectId ? "Edit project" : "Add project"}</h2>
            <form onSubmit={projectForm.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
              <input {...projectForm.register("title")} className="block w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Project title" />
              <input {...projectForm.register("slug")} className="block w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Slug" />
              <input {...projectForm.register("category")} className="block w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Category" />
              <textarea {...projectForm.register("shortDescription")} rows={2} className="block w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Short description" />
              <textarea {...projectForm.register("description")} rows={4} className="block w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Full description" />
              <input {...projectForm.register("githubUrl")} className="block w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="GitHub URL" />
              <input {...projectForm.register("liveUrl")} className="block w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Live URL" />
              <input {...projectForm.register("technologies")} className="block w-full rounded-xl border border-zinc-200 px-3 py-2" placeholder="Technologies (comma separated)" />
              <select {...projectForm.register("status")} className="block w-full rounded-xl border border-zinc-200 px-3 py-2">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" {...projectForm.register("featured")} />
                Featured project
              </label>
              {!selectedProjectId ? (
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    addPendingImages(event.dataTransfer.files);
                  }}
                  className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center"
                >
                  <p className="text-sm font-medium text-zinc-700">Project images</p>
                  <p className="mt-1 text-xs text-zinc-500">Select or drop up to 10 images. They’ll upload when you create the project.</p>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-3 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700">
                    Choose images
                  </button>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageInputChange} />
                  {pendingImages.length > 0 ? (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {pendingImages.map((image, index) => (
                        <div key={image.previewUrl} className="relative overflow-hidden rounded-xl border border-zinc-200">
                          <Image src={image.previewUrl} alt={`Selected project image ${index + 1}`} width={160} height={80} unoptimized className="h-20 w-full object-cover" />
                          <button type="button" onClick={() => removePendingImage(index)} className="absolute right-1 top-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white" aria-label={`Remove image ${index + 1}`}>Remove</button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button disabled={projectForm.formState.isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {projectForm.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  {projectForm.formState.isSubmitting ? "Saving..." : selectedProjectId ? "Update project" : "Create project"}
                </button>
                {selectedProjectId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProjectId(null);
                      projectForm.reset({
                        title: "",
                        slug: "",
                        shortDescription: "",
                        description: "",
                        category: "",
                        status: "DRAFT",
                        featured: false,
                        githubUrl: "",
                        liveUrl: "",
                        technologies: "",
                      });
                      setSelectedProjectImages([]);
                      setImageAlts({});
                    }}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          {selectedProjectId ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-950">Project gallery</h3>
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={async (event) => {
                  event.preventDefault();
                  const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
                  await handleUploadFiles(files);
                }}
                className="mt-4 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center transition hover:border-zinc-400"
              >
                <p className="text-sm font-medium text-zinc-700">Drag & drop images here</p>
                <p className="mt-2 text-xs text-zinc-500">Upload up to 10 project images, then reorder or edit captions.</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose files
                  </button>
                  <span className="text-xs text-zinc-500">or drop files directly</span>
                </div>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageInputChange} />
              </div>

              {selectedProjectImages.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {selectedProjectImages.map((image, index) => (
                    <div key={image.id} className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <div className="relative overflow-hidden rounded-2xl border border-zinc-200">
                        <Image src={image.url} alt={image.caption ?? `Project image ${index + 1}`} width={640} height={192} unoptimized className="h-48 w-full object-cover" />
                        {replaceUploadingId === image.id ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white">Replacing…</div>
                        ) : null}
                      </div>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleMoveImage(image.id, -1)}
                              disabled={index === 0}
                              className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Move up
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveImage(image.id, 1)}
                              disabled={index === selectedProjectImages.length - 1}
                              className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Move down
                            </button>
                          </div>
                          <ConfirmActionButton onConfirm={() => handleDeleteImage(image.id)} title="Delete this project image?" className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700">Delete</ConfirmActionButton>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Caption / Alt text</label>
                          <input
                            value={imageAlts[image.id] ?? ""}
                            onChange={(event) => setImageAlts((current) => ({ ...current, [image.id]: event.target.value }))}
                            onBlur={() => handleSaveAltText(image.id)}
                            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
                            placeholder="Describe this image for accessibility"
                          />
                        </div>
                        <label className="block text-center text-xs text-zinc-500">
                          Replace image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              await handleReplaceImage(image.id, file);
                              event.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                  No project images uploaded yet. Use the drag-and-drop area above to add gallery photos for this project.
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-950">Projects</h2>
            <form method="GET">
              <input name="search" defaultValue={search} className="rounded-xl border border-zinc-200 px-3 py-2" placeholder="Search projects" />
            </form>
          </div>

          <div className="mt-6 space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{project.title}</p>
                    <p className="text-sm text-zinc-500">{project.category ?? "General"}</p>
                    <p className="mt-2 text-sm text-zinc-600">{project.shortDescription ?? "No short description yet."}</p>
                  </div>
                  <div className="text-sm text-zinc-500">
                    <p>Status: {project.status}</p>
                    <p>Featured: {project.featured ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => selectProject(project)}
                    className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700"
                  >
                    Edit
                  </button>
                  <ConfirmActionButton onConfirm={() => handleDelete(project.id)} title="Delete this project?" description="This will permanently remove the project and its linked images." className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700">Delete</ConfirmActionButton>
                </div>
                {project.images.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.images.slice(0, 3).map((image) => (
                      <Image key={image.id} src={image.url} alt={image.caption ?? project.title} width={96} height={80} unoptimized className="h-20 w-24 rounded-xl object-cover" />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
