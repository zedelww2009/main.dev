"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

export function RoboticsGridBackground() {
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
    let t = 0;
    let w = 0;
    let h = 0;

    const speedMap = { low: 0.008, medium: 0.015, high: 0.025 };
    const speed = speedMap[intensity] || 0.015;
    const gapMap = { low: 48, medium: 36, high: 28 };
    const gap = gapMap[intensity] || 36;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const draw = () => {
      t += speed;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;

      // grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;

      for (let i = 0; i <= cols; i++) {
        const x = i * gap;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        const y = j * gap;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // scanning nodes / pulses
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * gap;
          const y = j * gap;
          const phase = Math.sin(t + i * 0.3 + j * 0.25);
          const glow = phase > 0.7;

          if (glow) {
            const alpha = (phase - 0.7) * 2;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.15 + alpha * 0.25})`;
            ctx.fill();

            // soft halo
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.03 + alpha * 0.05})`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.fill();
          }
        }
      }

      // horizontal scan line
      const scanY = ((t * 40) % (h + 100)) - 50;
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.06)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 20, w, 40);

      animId = requestAnimationFrame(draw);
    };

    resize();
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
