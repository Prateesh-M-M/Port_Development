import { useEffect, useRef } from "react";

/* =========================================================
   CONFIG
   Tweak these to change what shows up and how it behaves.
========================================================= */

const EMOJIS = ["✨", "🎨", "💡", "🚀", "⚡", "🌟", "🎯", "💫", "🔥", "🌈", "⭐", "🎉"];

const SHAPE_TYPES = ["circle", "square", "triangle", "star", "ring"] as const;
type ShapeType = (typeof SHAPE_TYPES)[number];

// Mid-saturation colors read fine against both a light and a dark
// background, so the same palette is used for both themes — only
// the overall opacity is tuned per theme (see OPACITY_MULTIPLIER).
const SHAPE_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#22d3ee", "#f59e0b"];

// Roughly one item per this many square px of viewport.
const AREA_PER_ITEM = 28000;

// Fraction of items that are emoji vs. drawn shapes.
const EMOJI_RATIO = 0.55;

// Cursor interaction.
const CURSOR_RADIUS = 160; // px — how close before an item reacts
const CURSOR_STRENGTH = 2.2; // how hard items get pushed away
const MAX_PUSH_SPEED = 3.5; // cap on the mouse-induced velocity component

// Baseline ambient drift so items are ALWAYS moving, mouse or not.
const MIN_DRIFT_SPEED = 0.15; // px/frame, minimum baseline speed
const MAX_DRIFT_SPEED = 0.45; // px/frame, maximum baseline speed

// How quickly the mouse-induced push decays back toward zero once the
// cursor moves away (closer to 1 = lingers longer, closer to 0 = snappier).
const PUSH_FRICTION = 0.94;

// Dark backgrounds can carry more visual weight before feeling
// cluttered than light backgrounds can — light mode dims slightly,
// dark mode runs at full designed opacity.
const OPACITY_MULTIPLIER = { light: 0.75, dark: 1 };

/* =========================================================
   TYPES
========================================================= */

interface Item {
  x: number;
  y: number;
  // Constant ambient drift — never decays, guarantees perpetual motion.
  driftVx: number;
  driftVy: number;
  // Mouse-induced push — decays back to zero via PUSH_FRICTION.
  pushVx: number;
  pushVy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  kind: "emoji" | "shape";
  content: string; // emoji character, or shape type
  color: string;
}

/* =========================================================
   THEME DETECTION
   Follows a `dark` class on <html> (the common Tailwind /
   shadcn pattern) when present, and falls back to the OS-level
   prefers-color-scheme otherwise. Re-checked live via a
   MutationObserver so a theme toggle updates it instantly
   without needing to remount this component.
========================================================= */

function getIsDark(): boolean {
  const root = document.documentElement;
  if (root.classList.contains("dark")) return true;
  if (root.classList.contains("light")) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/* =========================================================
   SHAPE DRAWING
========================================================= */

function drawShape(
  ctx: CanvasRenderingContext2D,
  type: string,
  size: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.08);

  switch (type as ShapeType) {
    case "circle": {
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "ring": {
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "square": {
      ctx.beginPath();
      ctx.rect(-size, -size, size * 2, size * 2);
      ctx.fill();
      break;
    }
    case "triangle": {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.87, size * 0.5);
      ctx.lineTo(-size * 0.87, size * 0.5);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "star": {
      const spikes = 5;
      const outerR = size;
      const innerR = size * 0.45;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI * i) / spikes - Math.PI / 2;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
}

/* =========================================================
   COMPONENT

   Mount this ONCE at the root of your app (wrapping all
   routes/pages), not inside an individual page — see the
   integration notes wherever you're importing this from.
========================================================= */

const BackgroundParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemsRef = useRef<Item[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const dimsRef = useRef({ width: 0, height: 0 });
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const isDarkRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDarkRef.current = getIsDark();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      dimsRef.current = { width, height };

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const randomDriftComponent = () => {
      // Random sign, magnitude between MIN and MAX so nothing is ever
      // fully still, but speeds still vary a bit between items.
      const speed = MIN_DRIFT_SPEED + Math.random() * (MAX_DRIFT_SPEED - MIN_DRIFT_SPEED);
      return Math.random() < 0.5 ? -speed : speed;
    };

    const createItems = () => {
      const { width, height } = dimsRef.current;
      const count = Math.max(8, Math.floor((width * height) / AREA_PER_ITEM));

      const items: Item[] = [];

      for (let i = 0; i < count; i++) {
        const isEmoji = Math.random() < EMOJI_RATIO;

        items.push({
          x: Math.random() * width,
          y: Math.random() * height,
          driftVx: randomDriftComponent(),
          driftVy: randomDriftComponent(),
          pushVx: 0,
          pushVy: 0,
          size: isEmoji ? Math.random() * 14 + 14 : Math.random() * 10 + 8,
          opacity: Math.random() * 0.35 + 0.15,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          kind: isEmoji ? "emoji" : "shape",
          content: isEmoji
            ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
            : SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
          color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
        });
      }

      itemsRef.current = items;
    };

    const animate = () => {
      const { width, height } = dimsRef.current;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const themeMultiplier = isDarkRef.current
        ? OPACITY_MULTIPLIER.dark
        : OPACITY_MULTIPLIER.light;

      itemsRef.current.forEach((item) => {
        // Cursor repulsion — adds to the push component only, so it
        // layers on top of the item's constant ambient drift.
        if (mouse.active) {
          const dx = item.x - mouse.x;
          const dy = item.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0 && distance < CURSOR_RADIUS) {
            const force = (1 - distance / CURSOR_RADIUS) * CURSOR_STRENGTH;
            item.pushVx += (dx / distance) * force * 0.15;
            item.pushVy += (dy / distance) * force * 0.15;
          }
        }

        // Push decays back toward zero, letting the item settle back
        // into its baseline drift rather than coming to a stop.
        item.pushVx *= PUSH_FRICTION;
        item.pushVy *= PUSH_FRICTION;

        // Cap push speed so a close cursor pass doesn't fling items off.
        const pushSpeed = Math.sqrt(item.pushVx * item.pushVx + item.pushVy * item.pushVy);
        if (pushSpeed > MAX_PUSH_SPEED) {
          item.pushVx = (item.pushVx / pushSpeed) * MAX_PUSH_SPEED;
          item.pushVy = (item.pushVy / pushSpeed) * MAX_PUSH_SPEED;
        }

        // Total motion = constant ambient drift + decaying mouse push.
        item.x += item.driftVx + item.pushVx;
        item.y += item.driftVy + item.pushVy;

        // Bounce off edges — flip both drift and push so direction
        // change is immediate and permanent (drift never re-decays).
        if (item.x < 0 || item.x > width) {
          item.driftVx *= -1;
          item.pushVx *= -1;
          item.x = Math.max(0, Math.min(width, item.x));
        }
        if (item.y < 0 || item.y > height) {
          item.driftVy *= -1;
          item.pushVy *= -1;
          item.y = Math.max(0, Math.min(height, item.y));
        }

        item.rotation += item.rotationSpeed;

        // Draw.
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.globalAlpha = item.opacity * themeMultiplier;

        if (item.kind === "emoji") {
          ctx.font = `${item.size}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(item.content, 0, 0);
        } else {
          drawShape(ctx, item.content, item.size, item.color);
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createItems();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createItems();
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        mouseRef.current = { x: touch.clientX, y: touch.clientY, active: true };
      }
    };

    // Keep theme in sync if the user toggles light/dark mode, or if
    // the OS-level preference changes and no explicit class is set.
    const themeObserver = new MutationObserver(() => {
      isDarkRef.current = getIsDark();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleColorSchemeChange = () => {
      isDarkRef.current = getIsDark();
    };
    colorSchemeQuery.addEventListener("change", handleColorSchemeChange);

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      themeObserver.disconnect();
      colorSchemeQuery.removeEventListener("change", handleColorSchemeChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
};

export default BackgroundParticles;