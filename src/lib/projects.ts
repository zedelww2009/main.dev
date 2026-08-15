import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Project, ProjectStatus, ProjectCategory } from "@/types";

const PROJECTS = "projects";

export interface CreateProjectInput {
  title: string;
  description: string;
  category: ProjectCategory;
  tags?: string[];
  thumbnailUrl?: string;
  progress?: number;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  category?: ProjectCategory;
  tags?: string[];
  thumbnailUrl?: string;
  progress?: number;
  status?: ProjectStatus;
}

function mapDoc(id: string, data: Record<string, unknown>): Project {
  return {
    id,
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    category: (data.category as ProjectCategory) || "other",
    status: (data.status as ProjectStatus) || "active",
    thumbnailUrl: data.thumbnailUrl as string | undefined,
    tags: (data.tags as string[]) || [],
    createdAt:
      data.createdAt instanceof Object && "toDate" in data.createdAt
        ? (data.createdAt as Timestamp).toDate().toISOString()
        : (data.createdAt as string) || new Date().toISOString(),
    updatedAt:
      data.updatedAt instanceof Object && "toDate" in data.updatedAt
        ? (data.updatedAt as Timestamp).toDate().toISOString()
        : (data.updatedAt as string) || new Date().toISOString(),
    userId: (data.userId as string) || "",
    progress: data.progress as number | undefined,
  };
}

export async function createProject(
  userId: string,
  input: CreateProjectInput
): Promise<Project> {
  const now = new Date().toISOString();
  const payload = {
    ...input,
    tags: input.tags || [],
    status: "active" as ProjectStatus,
    userId,
    createdAt: now,
    updatedAt: now,
    progress: input.progress ?? 0,
  };

  const ref = await addDoc(collection(db, PROJECTS), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: ref.id,
    ...payload,
  };
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, PROJECTS, id));
  if (!snap.exists()) return null;
  return mapDoc(snap.id, snap.data());
}

export async function getUserProjects(
  userId: string,
  status?: ProjectStatus
): Promise<Project[]> {
  // Query by userId only to avoid requiring a composite index.
  // Sort and status-filter client-side.
  const q = query(collection(db, PROJECTS), where("userId", "==", userId));

  const snap = await getDocs(q);
  let items = snap.docs.map((d) => mapDoc(d.id, d.data()));

  if (status) {
    items = items.filter((p) => p.status === status);
  }

  items.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return items;
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<void> {
  await updateDoc(doc(db, PROJECTS, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function archiveProject(id: string): Promise<void> {
  await updateProject(id, { status: "archived" });
}

export async function restoreProject(id: string): Promise<void> {
  await updateProject(id, { status: "active" });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, PROJECTS, id));
}

/** Simple client-side filter helper */
export function filterProjects(
  projects: Project[],
  opts: {
    search?: string;
    category?: ProjectCategory | "all";
    status?: ProjectStatus | "all";
  }
): Project[] {
  return projects.filter((p) => {
    if (opts.status && opts.status !== "all" && p.status !== opts.status) {
      return false;
    }
    if (opts.category && opts.category !== "all" && p.category !== opts.category) {
      return false;
    }
    if (opts.search) {
      const q = opts.search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}
