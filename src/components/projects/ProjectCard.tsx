"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlinePencil,
  HiOutlineArchive,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineExternalLink,
} from "react-icons/hi";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onArchive?: (project: Project) => void;
  onRestore?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  isArchived?: boolean;
}

export function ProjectCard({
  project,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  isArchived = false,
}: ProjectCardProps) {
  return (
    <Card hoverable className="h-full flex flex-col group">
      {project.thumbnailUrl && (
        <div className=" -mx-5 -mt-5 mb-4 h-32 overflow-hidden rounded-t-[var(--radius-lg)] bg-surface-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
      )}

      <CardHeader>
        <div className="min-w-0 flex-1">
          <Link href={`/projects/${project.id}`}>
            <CardTitle className="truncate hover:underline underline-offset-2">
              {project.title}
            </CardTitle>
          </Link>
          <CardDescription className="line-clamp-2 mt-1">
            {project.description || "No description"}
          </CardDescription>
        </div>
        <Badge variant="outline" className="shrink-0 capitalize">
          {project.category}
        </Badge>
      </CardHeader>

      <div className="mt-auto pt-2 space-y-3">
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full bg-surface-3 text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {typeof project.progress === "number" && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1 border-t border-border-subtle -mx-1">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-1.5">
              <HiOutlineExternalLink className="h-3.5 w-3.5" />
              Open
            </Button>
          </Link>

          {!isArchived && onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(project)}
              aria-label="Edit"
            >
              <HiOutlinePencil className="h-3.5 w-3.5" />
            </Button>
          )}

          {isArchived
            ? onRestore && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onRestore(project)}
                  aria-label="Restore"
                >
                  <HiOutlineRefresh className="h-3.5 w-3.5" />
                </Button>
              )
            : onArchive && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onArchive(project)}
                  aria-label="Archive"
                >
                  <HiOutlineArchive className="h-3.5 w-3.5" />
                </Button>
              )}

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted hover:text-destructive"
              onClick={() => onDelete(project)}
              aria-label="Delete"
            >
              <HiOutlineTrash className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
