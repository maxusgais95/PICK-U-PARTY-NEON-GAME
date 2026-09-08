/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  decay: number;
}

interface Ring {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  lineWidth: number;
  alpha: number;
}

interface KaboomExplosionCanvasProps {
  originX?: number; // Normalized 0..1 or client coordinates
  originY?: number;
  active: boolean;
  onComplete?: () => void;
}

export const KaboomExplosionCanvas: React.FC<KaboomExplosionCanvasProps> = ({
  originX,
  originY,
  active,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const centerX = originX !== undefined ? originX : width / 2;
    const centerY = originY !== undefined ? originY : height / 2;

    const colors = [
      '#ff2a5f',
      '#ff5e00',
      '#ffaa00',
      '#ffe600',
      '#ffffff',
      '#f43f5e',
      '#fb923c',
    ];

    // Generate 120 explosion debris and fire embers
    const particles: Particle[] = [];
    const particleCount = 130;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 3;
      const size = Math.random() * 9 + 4;
      const maxLife = Math.random() * 45 + 35;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife,
        decay: 1 / maxLife,
      });
    }

    // Shockwave rings
    const rings: Ring[] = [
      {
        x: centerX,
        y: centerY,
        radius: 10,
        maxRadius: Math.max(width, height) * 0.45,
        color: '#ffedd5',
        lineWidth: 8,
        alpha: 1,
      },
      {
        x: centerX,
        y: centerY,
        radius: 20,
        maxRadius: Math.max(width, height) * 0.65,
        color: '#f97316',
        lineWidth: 14,
        alpha: 0.9,
      },
      {
        x: centerX,
        y: centerY,
        radius: 5,
        maxRadius: Math.max(width, height) * 0.8,
        color: '#ef4444',
        lineWidth: 6,
        alpha: 0.7,
      },
    ];

    let frame = 0;
    const maxFrames = 75;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw shockwave rings
      rings.forEach((ring) => {
        if (ring.alpha <= 0.01) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.lineWidth;
        ctx.globalAlpha = Math.max(0, ring.alpha);
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();

        ring.radius += (ring.maxRadius - ring.radius) * 0.12;
        ring.alpha *= 0.92;
        ring.lineWidth *= 0.94;
      });

      // Draw particles
      particles.forEach((p) => {
        if (p.alpha <= 0.01) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // Air drag
        p.vy *= 0.94;
        p.vy += 0.18; // Slight gravity
        p.size *= 0.97;
        p.alpha -= p.decay;
      });

      if (frame < maxFrames) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [active, originX, originY, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
