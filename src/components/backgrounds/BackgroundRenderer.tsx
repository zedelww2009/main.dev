"use client";

import dynamic from "next/dynamic";
import { useAppStore } from "@/store/useAppStore";

// Dynamic imports keep the main bundle lighter and avoid SSR canvas issues
const ParticlesBackground = dynamic(
  () => import("./Particles").then((m) => m.ParticlesBackground),
  { ssr: false }
);
const RoboticsGridBackground = dynamic(
  () => import("./RoboticsGrid").then((m) => m.RoboticsGridBackground),
  { ssr: false }
);
const NeuralNetworkBackground = dynamic(
  () => import("./NeuralNetwork").then((m) => m.NeuralNetworkBackground),
  { ssr: false }
);
const GeometricBackground = dynamic(
  () => import("./Geometric").then((m) => m.GeometricBackground),
  { ssr: false }
);
const WavesBackground = dynamic(
  () => import("./Waves").then((m) => m.WavesBackground),
  { ssr: false }
);

export function BackgroundRenderer() {
  const { settings } = useAppStore();
  const bg = settings.background;

  if (bg === "none" || settings.reducedMotion) {
    return null;
  }

  switch (bg) {
    case "particles":
      return <ParticlesBackground />;
    case "robotics-grid":
      return <RoboticsGridBackground />;
    case "neural-network":
      return <NeuralNetworkBackground />;
    case "geometric":
      return <GeometricBackground />;
    case "waves":
      return <WavesBackground />;
    default:
      return null;
  }
}
