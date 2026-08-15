export type ProjectStatus = "active" | "archived" | "draft";

export type ProjectCategory =
  | "web"
  | "mobile"
  | "ai"
  | "design"
  | "backend"
  | "other";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  thumbnailUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  progress?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export type BackgroundType =
  | "none"
  | "particles"
  | "robotics-grid"
  | "neural-network"
  | "geometric"
  | "waves";

export type AccentColor = "white" | "blue" | "emerald" | "violet" | "amber";

export type AnimationIntensity = "low" | "medium" | "high";

export interface AppSettings {
  background: BackgroundType;
  accentColor: AccentColor;
  animationIntensity: AnimationIntensity;
  notificationsEnabled: boolean;
  reducedMotion: boolean;
}

export interface ActivityItem {
  id: string;
  type: "create" | "update" | "archive" | "restore" | "delete";
  projectTitle: string;
  timestamp: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  archivedProjects: number;
  recentActivityCount: number;
}
