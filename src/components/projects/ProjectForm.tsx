"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Project, ProjectCategory } from "@/types";
import type { CreateProjectInput } from "@/lib/projects";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "ai", label: "AI / ML" },
  { value: "design", label: "Design" },
  { value: "backend", label: "Backend" },
  { value: "other", label: "Other" },
];

interface ProjectFormProps {
  initial?: Project;
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  loading = false,
}: ProjectFormProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState<ProjectCategory>(
    initial?.category || "web"
  );
  const [tagsInput, setTagsInput] = useState(
    initial?.tags?.join(", ") || ""
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initial?.thumbnailUrl || ""
  );
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        tags,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        progress: Math.min(100, Math.max(0, progress)),
      });
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-[var(--radius-sm)] bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project name"
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the project"
          rows={3}
          className={cn(
            "w-full rounded-[var(--radius-md)] bg-surface-2 border border-border",
            "px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-colors duration-150 resize-none",
            "hover:border-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500/30"
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-muted">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === c.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-neutral-500"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Tags"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="react, typescript, ui (comma separated)"
      />

      <Input
        label="Thumbnail URL"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        placeholder="https://..."
      />

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <label className="block text-sm font-medium text-muted">
            Progress
          </label>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full accent-foreground"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {initial ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}
