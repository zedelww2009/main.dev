"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

export function WavesBackground() {
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

    const speedMap = { low: 0.008, medium: 0.014, high: 0.022 };
    const speed = speedMap[intensity] || 0.014;
    const wavesMap = { low: 2, medium: 3, high: 4 };
    const waveCount = wavesMap[intensity] || 3;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const draw = () => {
      t += speed;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < waveCount; i++) {
        const amp = 18 + i * 12;
        const freq = 0.003 + i * 0.001;
        const phase = t * (1 + i * 0.3) + i * 1.2;
        const yBase = h * 0.35 + i * (h * 0.12);
        const alpha = 0.04 + i * 0.015;

        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 4) {
          const y =
            yBase +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 0.5 + phase * 1.3) * amp * 0.4;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();

        // stroke the wave crest
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y =
            yBase +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 0.5 + phase * 1.3) * amp * 0.4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 1.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

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
