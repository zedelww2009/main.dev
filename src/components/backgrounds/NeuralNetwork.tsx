"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: number;
}

export function NeuralNetworkBackground() {
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
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;
    let t = 0;

    const layersMap = { low: 4, medium: 5, high: 6 };
    const nodesPerLayerMap = { low: 5, medium: 7, high: 9 };
    const layers = layersMap[intensity] || 5;
    const perLayer = nodesPerLayerMap[intensity] || 7;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      nodes = [];
      const marginX = w * 0.12;
      const usableW = w - marginX * 2;
      const marginY = h * 0.15;
      const usableH = h - marginY * 2;

      for (let l = 0; l < layers; l++) {
        for (let n = 0; n < perLayer; n++) {
          const x = marginX + (usableW * l) / (layers - 1 || 1);
          const y = marginY + (usableH * (n + 0.5)) / perLayer;
          nodes.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            layer: l,
          });
        }
      }
    };

    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);

      // gentle drift
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        // soft bounds
        if (node.x < 20 || node.x > w - 20) node.vx *= -1;
        if (node.y < 20 || node.y > h - 20) node.vy *= -1;
      }

      // connections between adjacent layers
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          if (Math.abs(a.layer - b.layer) !== 1) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 280) continue;

          const pulse = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.4 + j * 0.3);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.04 + pulse * 0.06})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + i * 0.5);

        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5 + pulse * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.2 + pulse * 0.25})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.02 + pulse * 0.03})`;
        ctx.fill();
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
