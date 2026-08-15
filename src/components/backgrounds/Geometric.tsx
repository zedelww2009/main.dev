"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

interface Shape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  vx: number;
  vy: number;
  sides: number;
  alpha: number;
}

export function GeometricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useAppStore();
  const intensity = settings.animationIntensity;
  const reduced = settings.reducedMotion;

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let shapes: Shape[] = [];
    let w = 0;
    let h = 0;

    const countMap = { low: 8, medium: 14, high: 22 };
    const count = countMap[intensity] || 14;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const init = () => {
      shapes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        sides: Math.floor(Math.random() * 3) + 3, // 3–5
        alpha: Math.random() * 0.08 + 0.03,
      }));
    };

    const drawPolygon = (
      x: number,
      y: number,
      size: number,
      sides: number,
      rotation: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = rotation + (i * 2 * Math.PI) / sides;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const s of shapes) {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        if (s.x < -s.size) s.x = w + s.size;
        if (s.x > w + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = h + s.size;
        if (s.y > h + s.size) s.y = -s.size;

        drawPolygon(s.x, s.y, s.size, s.sides, s.rotation);
        ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // inner smaller shape
        drawPolygon(s.x, s.y, s.size * 0.5, s.sides, -s.rotation);
        ctx.strokeStyle = `rgba(255,255,255,${s.alpha * 0.6})`;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [intensity, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
