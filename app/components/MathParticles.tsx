'use client';

/**
 * MathParticles.tsx
 * A canvas-based particle background that floats math symbols
 * (digits 0–9, +, −, ×, ÷, =, ?) around the screen.
 *
 * Uses requestAnimationFrame — no external dependencies.
 * Sits as a fixed full-screen layer behind all other content.
 */

import React, { useEffect, useRef } from 'react';

// ── Symbols that float around ─────────────────────────────────────
const SYMBOLS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '−', '×', '÷', '=', '?'];

// ── Pastel kid-friendly palette ───────────────────────────────────
const COLORS = [
  '#f87171', // red-400
  '#fb923c', // orange-400
  '#facc15', // yellow-400
  '#4ade80', // green-400
  '#34d399', // emerald-400
  '#38bdf8', // sky-400
  '#818cf8', // indigo-400
  '#c084fc', // purple-400
  '#f472b6', // pink-400
  '#2dd4bf', // teal-400
];

// ── Particle shape ────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;       // horizontal drift
  vy: number;       // upward speed (negative = up)
  symbol: string;
  color: string;
  size: number;     // font size in px
  alpha: number;    // 0–1 opacity
  rotation: number; // tilt in radians
  rotSpeed: number; // rotation speed per frame
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createParticle(canvasW: number, canvasH: number, yOverride?: number): Particle {
  return {
    x: rand(0, canvasW),
    y: yOverride ?? rand(0, canvasH),
    vx: rand(-0.3, 0.3),
    vy: rand(-0.5, -1.2),         // always drifts upward
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: rand(18, 52),
    alpha: rand(0.3, 0.6),         // more visible on white background
    rotation: rand(-0.4, 0.4),
    rotSpeed: rand(-0.004, 0.004),
  };
}

const PARTICLE_COUNT = 60;

export default function MathParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Resize canvas to fill window ──────────────────────────────
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Spawn initial particles spread across the whole canvas ────
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height)
    );

    // ── Animation loop ────────────────────────────────────────────
    let animId: number;

    function draw() {
      if (!canvas || !ctx) return;
      // Clear with slight trail effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = `bold ${p.size}px "Nunito", sans-serif`;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Wrap: when a particle floats off the top, respawn at the bottom
        if (p.y < -80) {
          Object.assign(p, createParticle(canvas.width, canvas.height, canvas.height + 40));
        }
        // Horizontal wrap
        if (p.x < -60) p.x = canvas.width + 40;
        if (p.x > canvas.width + 60) p.x = -40;
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',   // never blocks clicks
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
