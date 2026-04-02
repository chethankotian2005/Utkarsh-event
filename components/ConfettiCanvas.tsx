"use client";

import { useEffect, useRef } from "react";

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "circle" | "rect" | "star";
}

interface ConfettiCanvasProps {
  onComplete?: () => void;
}

const COLORS = [
  "rgba(201, 168, 76, 1)",
  "rgba(255, 215, 0, 1)",
  "rgba(184, 134, 11, 1)",
  "rgba(255, 255, 255, 0.9)",
  "rgba(255, 215, 0, 0.8)",
  "rgba(240, 200, 80, 1)",
];

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = ((i * 4 * Math.PI) / 5) - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export default function ConfettiCanvas({ onComplete }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Confetti[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const COUNT = 180;

    particlesRef.current = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 18 + 6;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 8,
        size: Math.random() * 8 + 3,
        opacity: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        shape: (["circle", "rect", "star"] as const)[Math.floor(Math.random() * 3)],
      };
    });

    let elapsed = 0;
    const DURATION = 3000;
    let lastTime = performance.now();

    function animate(now: number) {
      const delta = now - lastTime;
      lastTime = now;
      elapsed += delta;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const progress = elapsed / DURATION;
      let allDead = true;

      for (const p of particlesRef.current) {
        p.vy += 0.4; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - progress * 1.2);

        if (p.opacity > 0.01) allDead = false;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          drawStar(ctx, 0, 0, p.size / 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (!allDead && elapsed < DURATION + 1000) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        pointerEvents: "none",
      }}
    />
  );
}
