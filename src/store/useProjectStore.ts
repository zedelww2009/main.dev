"use client";

import { create } from "zustand";
import type { Project, ProjectCategory, ProjectStatus } from "@/types";
import {
  createProject as apiCreate,
  getUserProjects,
  getProject,
  updateProject as apiUpdate,
  archiveProject as apiArchive,
  restoreProject as apiRestore,
  deleteProject as apiDelete,
  filterProjects,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "@/lib/projects";

interface ProjectState {
  projects: Project[];
  archived: Project[];
  current: Project | null;
  loading: boolean;
  error: string | null;
  search: string;
  categoryFilter: ProjectCategory | "all";
  statusFilter: ProjectStatus | "all";

  fetchProjects: (userId: string) => Promise<void>;
  fetchArchived: (userId: string) => Promise<void>;
  fetchProject: (id: string) => Promise<Project | null>;
  create: (userId: string, input: CreateProjectInput) => Promise<Project>;
  update: (id: string, input: UpdateProjectInput) => Promise<void>;
  archive: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setSearch: (search: string) => void;
  setCategoryFilter: (cat: ProjectCategory | "all") => void;
  setStatusFilter: (status: ProjectStatus | "all") => void;
  getFiltered: () => Project[];
  clearError: () => void;
  clearCurrent: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  archived: [],
  current: null,
  loading: false,
  error: null,
  search: "",
  categoryFilter: "all",
  statusFilter: "all",

  fetchProjects: async (userId) => {
    set({ loading: true, error: null });
    try {
      const all = await getUserProjects(userId);
      const active = all.filter((p) => p.status === "active" || p.status === "draft");
      const archived = all.filter((p) => p.status === "archived");
      set({ projects: active, archived, loading: false });
    } catch (err) {
      // Fallback: try without composite index by fetching all and filtering
      try {
        const all = await getUserProjects(userId);
        set({
          projects: all.filter((p) => p.status !== "archived"),
          archived: all.filter((p) => p.status === "archived"),
          loading: false,
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load projects";
        set({ error: message, loading: false });
      }
    }
  },

  fetchArchived: async (userId) => {
    set({ loading: true, error: null });
    try {
      const items = await getUserProjects(userId, "archived");
      set({ archived: items, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load archive";
      set({ error: message, loading: false });
    }
  },

  fetchProject: async (id) => {
    set({ loading: true, error: null });
    try {
      const project = await getProject(id);
      set({ current: project, loading: false });
      return project;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load project";
      set({ error: message, loading: false, current: null });
      return null;
    }
  },

  create: async (userId, input) => {
    set({ loading: true, error: null });
    try {
      const project = await apiCreate(userId, input);
      set((state) => ({
        projects: [project, ...state.projects],
        loading: false,
      }));
      return project;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create project";
      set({ error: message, loading: false });
      throw err;
    }
  },

  update: async (id, input) => {
    set({ loading: true, error: null });
    try {
      await apiUpdate(id, input);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...input, updatedAt: new Date().toISOString() } : p
        ),
        archived: state.archived.map((p) =>
          p.id === id ? { ...p, ...input, updatedAt: new Date().toISOString() } : p
        ),
        current:
          state.current?.id === id
            ? { ...state.current, ...input, updatedAt: new Date().toISOString() }
            : state.current,
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update project";
      set({ error: message, loading: false });
      throw err;
    }
  },

  archive: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiArchive(id);
      set((state) => {
        const project = state.projects.find((p) => p.id === id);
        if (!project) return { loading: false };
        const archivedProject = {
          ...project,
          status: "archived" as ProjectStatus,
          updatedAt: new Date().toISOString(),
        };
        return {
          projects: state.projects.filter((p) => p.id !== id),
          archived: [archivedProject, ...state.archived],
          loading: false,
        };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to archive project";
      set({ error: message, loading: false });
      throw err;
    }
  },

  restore: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiRestore(id);
      set((state) => {
        const project = state.archived.find((p) => p.id === id);
        if (!project) return { loading: false };
        const restored = {
          ...project,
          status: "active" as ProjectStatus,
          updatedAt: new Date().toISOString(),
        };
        return {
          archived: state.archived.filter((p) => p.id !== id),
          projects: [restored, ...state.projects],
          loading: false,
        };
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to restore project";
      set({ error: message, loading: false });
      throw err;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDelete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        archived: state.archived.filter((p) => p.id !== id),
        current: state.current?.id === id ? null : state.current,
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete project";
      set({ error: message, loading: false });
      throw err;
    }
  },

  setSearch: (search) => set({ search }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  getFiltered: () => {
    const { projects, search, categoryFilter, statusFilter } = get();
    return filterProjects(projects, {
      search,
      category: categoryFilter,
      status: statusFilter,
    });
  },

  clearError: () => set({ error: null }),
  clearCurrent: () => set({ current: null }),
}));
