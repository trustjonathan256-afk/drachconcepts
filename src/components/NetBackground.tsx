"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  r: number;
}

interface GridNode {
  col: number;
  row: number;
  opacity: number;
  targetOpacity: number;
  phase: number; // random phase offset
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface ShootingStar {
  x: number;
  y: number; // current head position
  vx: number;
  vy: number; // velocity
  tailLen: number; // max tail length in px
  alpha: number; // current opacity
  decay: number; // how fast it fades
  width: number; // line width
}

const CELL = 60;
const CONNECT_DIST = 140;
const MOUSE_RADIUS = 200;
const REPEL_FORCE = 0.055;
const SPRING = 0.004;
const DAMPING = 0.88;

export default function NetBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);
  const gridNodes = useRef<GridNode[]>([]);
  const ripples = useRef<Ripple[]>([]);
  const shootingStars = useRef<ShootingStar[]>([]);
  const nextStarAt = useRef<number>(0);
  const scanX = useRef<number>(0);
  const scanY = useRef<number>(0);
  const raf = useRef<number>(0);
  const tick = useRef<number>(0);

  const spawnStar = useCallback((w: number, h: number) => {
    // Pick a random edge to spawn from, always shoot diagonally inward
    const edge = Math.floor(Math.random() * 4); // 0=top 1=right 2=bottom 3=left
    let x = 0,
      y = 0;
    // Base angle: 30°–60° diagonal, randomised slightly
    const baseAngle = Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 6);
    let angle = baseAngle;
    if (edge === 0) {
      x = Math.random() * w;
      y = -10;
      angle = Math.PI / 2 + (Math.random() - 0.5) * 0.8;
    } else if (edge === 1) {
      x = w + 10;
      y = Math.random() * h;
      angle = Math.PI + (Math.random() - 0.5) * 0.8;
    } else if (edge === 2) {
      x = Math.random() * w;
      y = h + 10;
      angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
    } else {
      x = -10;
      y = Math.random() * h;
      angle = (Math.random() - 0.5) * 0.8;
    }

    const speed = 3.5 + Math.random() * 3;
    shootingStars.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      tailLen: 80 + Math.random() * 100,
      alpha: 0.7 + Math.random() * 0.3,
      decay: 0.008 + Math.random() * 0.006,
      width: 0.8 + Math.random() * 0.7,
    });
  }, []);

  const buildParticles = useCallback((w: number, h: number) => {
    const count = Math.max(70, Math.min(180, Math.round((w * h) / 12000)));
    particles.current = Array.from({ length: count }, () => {
      const ox = Math.random() * w;
      const oy = Math.random() * h;
      return {
        x: ox,
        y: oy,
        ox,
        oy,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 0.9 + Math.random() * 0.8,
      };
    });
  }, []);

  const buildGridNodes = useCallback((w: number, h: number) => {
    const cols = Math.ceil(w / CELL) + 1;
    const rows = Math.ceil(h / CELL) + 1;
    gridNodes.current = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Only keep a sparse random selection (~30%) to not overload
        if (Math.random() > 0.3) continue;
        gridNodes.current.push({
          col: c,
          row: r,
          opacity: 0,
          targetOpacity: Math.random() * 0.25,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildParticles(canvas.width, canvas.height);
      buildGridNodes(canvas.width, canvas.height);
      scanX.current = 0;
      scanY.current = 0;
      shootingStars.current = [];
      nextStarAt.current = 0;
    };
    onResize();
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    // Ripple on click
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 160,
        alpha: 0.5,
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", onClick);

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);
      tick.current += 1;
      const t = tick.current;

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const pts = particles.current;

      // ── MOUSE SPOTLIGHT GLOW ──────────────────────────────────────
      if (mx > 0 && mx < W) {
        const grd = ctx.createRadialGradient(
          mx,
          my,
          0,
          mx,
          my,
          MOUSE_RADIUS * 1.4,
        );
        grd.addColorStop(0, "rgba(0,0,0,0.045)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // ── SHOOTING STARS ────────────────────────────────────────────
      // Spawn a new star every 2.2–4.5 s (randomised interval)
      if (t >= nextStarAt.current) {
        spawnStar(W, H);
        // 130–270 frames at ~60fps = 2.2s–4.5s
        nextStarAt.current = t + 130 + Math.random() * 140;
      }

      // Draw & advance each star
      shootingStars.current = shootingStars.current.filter(
        (s) => s.alpha > 0.01,
      );
      for (const s of shootingStars.current) {
        // Tail: gradient line from tail-end to head
        const tailX =
          s.x - s.vx * (s.tailLen / Math.hypot(s.vx, s.vy)) * (s.tailLen / 5);
        const tailY =
          s.y - s.vy * (s.tailLen / Math.hypot(s.vx, s.vy)) * (s.tailLen / 5);

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(0,0,0,0)`);
        grad.addColorStop(0.6, `rgba(0,0,0,${s.alpha * 0.25})`);
        grad.addColorStop(1, `rgba(0,0,0,${s.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Bright glowing head
        const headGrd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 5);
        headGrd.addColorStop(0, `rgba(0,0,0,${s.alpha})`);
        headGrd.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = headGrd;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Advance & fade
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
      }

      // ── ANIMATED GRID ─────────────────────────────────────────────
      const globalPulse = 0.038 + 0.018 * Math.sin(t / 220);
      const cols = Math.ceil(W / CELL) + 1;
      const rows = Math.ceil(H / CELL) + 1;

      // Vertical lines
      for (let c = 0; c < cols; c++) {
        const lx = c * CELL;
        const mdistX = Math.abs(lx - mx);
        const boost = mdistX < 120 ? ((120 - mdistX) / 120) * 0.12 : 0;
        const wave = 0.012 * Math.sin(t / 80 - c * 0.45);
        // Scanner boost — line flares when the horizontal scanner passes it
        const scanBoostX = Math.abs(lx - scanX.current) < 4 ? 0.18 : 0;
        const alpha = Math.min(globalPulse + boost + wave + scanBoostX, 0.28);
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, H);
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.lineWidth = scanBoostX > 0 ? 1.2 : 0.6;
        ctx.stroke();
      }

      // Horizontal lines
      for (let r = 0; r < rows; r++) {
        const ly = r * CELL;
        const mdistY = Math.abs(ly - my);
        const boost = mdistY < 120 ? ((120 - mdistY) / 120) * 0.12 : 0;
        const wave = 0.012 * Math.sin(t / 100 - r * 0.45);
        const scanBoostY = Math.abs(ly - scanY.current) < 4 ? 0.18 : 0;
        const alpha = Math.min(globalPulse + boost + wave + scanBoostY, 0.28);
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(W, ly);
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.lineWidth = scanBoostY > 0 ? 1.2 : 0.6;
        ctx.stroke();
      }

      // Advance scanner beams
      scanX.current = (scanX.current + 0.55) % W;
      scanY.current = (scanY.current + 0.35) % H;

      // ── SCANNER BEAM GLOW STRIP ───────────────────────────────────
      // Vertical scan beam
      const vGrad = ctx.createLinearGradient(
        scanX.current - 18,
        0,
        scanX.current + 18,
        0,
      );
      vGrad.addColorStop(0, "rgba(0,0,0,0)");
      vGrad.addColorStop(0.5, "rgba(0,0,0,0.07)");
      vGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = vGrad;
      ctx.fillRect(scanX.current - 18, 0, 36, H);

      // Horizontal scan beam
      const hGrad = ctx.createLinearGradient(
        0,
        scanY.current - 18,
        0,
        scanY.current + 18,
      );
      hGrad.addColorStop(0, "rgba(0,0,0,0)");
      hGrad.addColorStop(0.5, "rgba(0,0,0,0.055)");
      hGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, scanY.current - 18, W, 36);

      // ── PULSING GRID INTERSECTION NODES ──────────────────────────
      for (const gn of gridNodes.current) {
        const nx = gn.col * CELL;
        const ny = gn.row * CELL;

        // Random breathe toward target then pick new target
        gn.opacity += (gn.targetOpacity - gn.opacity) * 0.008;
        if (Math.abs(gn.opacity - gn.targetOpacity) < 0.003) {
          gn.targetOpacity = Math.random() * 0.3;
        }

        // Mouse proximity boosts node
        const mdist = Math.hypot(nx - mx, ny - my);
        const mouseBoost =
          mdist < MOUSE_RADIUS
            ? ((MOUSE_RADIUS - mdist) / MOUSE_RADIUS) * 0.5
            : 0;

        const finalAlpha = Math.min(gn.opacity + mouseBoost, 0.65);
        if (finalAlpha < 0.02) continue;

        // Draw small crosshair marker
        const size = 3 + mouseBoost * 6;
        ctx.strokeStyle = `rgba(0,0,0,${finalAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(nx - size, ny);
        ctx.lineTo(nx + size, ny);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(nx, ny - size);
        ctx.lineTo(nx, ny + size);
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(nx, ny, mouseBoost > 0.1 ? 1.8 : 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${finalAlpha})`;
        ctx.fill();
      }

      // Nearest intersection pulse under cursor
      if (mx > 0 && my > 0 && mx < W && my < H) {
        const nearCol = Math.round(mx / CELL) * CELL;
        const nearRow = Math.round(my / CELL) * CELL;
        const pulse = 0.5 + 0.5 * Math.sin(t / 12);
        // Outer ring
        ctx.beginPath();
        ctx.arc(nearCol, nearRow, 5 + pulse * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,0,0,${0.15 + 0.12 * pulse})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // Inner dot
        ctx.beginPath();
        ctx.arc(nearCol, nearRow, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${0.35 + 0.2 * pulse})`;
        ctx.fill();
      }

      // ── CLICK RIPPLES ─────────────────────────────────────────────
      ripples.current = ripples.current.filter((rp) => rp.alpha > 0.01);
      for (const rp of ripples.current) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,0,0,${rp.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        rp.radius += (rp.maxRadius - rp.radius) * 0.06;
        rp.alpha *= 0.94;
      }

      // ── PARTICLE PHYSICS ──────────────────────────────────────────
      for (const p of pts) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 1) {
          const strength = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) ** 1.5;
          p.vx += (dx / dist) * strength * REPEL_FORCE;
          p.vy += (dy / dist) * strength * REPEL_FORCE;
        }
        p.vx += (p.ox - p.x) * SPRING;
        p.vy += (p.oy - p.y) * SPRING;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      // ── NET CONNECTIONS ───────────────────────────────────────────
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > CONNECT_DIST) continue;
          const midX = (pts[i].x + pts[j].x) / 2;
          const midY = (pts[i].y + pts[j].y) / 2;
          const mdist = Math.hypot(midX - mx, midY - my);
          const boost =
            mdist < MOUSE_RADIUS
              ? ((MOUSE_RADIUS - mdist) / MOUSE_RADIUS) * 0.18
              : 0;
          const alpha = Math.min(
            0.09 * (1 - dist / CONNECT_DIST) + boost,
            0.22,
          );
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // ── NODES ─────────────────────────────────────────────────────
      for (const p of pts) {
        const mdist = Math.hypot(p.x - mx, p.y - my);
        const near = mdist < MOUSE_RADIUS;
        const alpha = near
          ? 0.25 + 0.35 * ((MOUSE_RADIUS - mdist) / MOUSE_RADIUS)
          : 0.12;
        const radius = near
          ? p.r + 0.8 * ((MOUSE_RADIUS - mdist) / MOUSE_RADIUS)
          : p.r;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
    };
  }, [buildParticles, buildGridNodes, spawnStar]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
