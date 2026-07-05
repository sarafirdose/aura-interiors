"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 51;
const getFramePath = (index: number) =>
  `/frames/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

// Lerp helper: linearly interpolate from 'a' toward 'b' by factor 't'
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function CanvasScrubber() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  // targetFrame = what ScrollTrigger wants; currentFrame = what's actually rendered (lerped toward target)
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    contextRef.current = ctx;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dimsRef.current = { w: window.innerWidth, h: window.innerHeight };
      renderFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    // Preload all frames eagerly
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => { if (i === 0) renderFrame(0); };
      imagesRef.current.push(img);
    }

    // RAF loop: every frame, lerp currentFrame → targetFrame at 12% speed
    // This creates a smooth "rubber band" lag effect independent of scroll speed
    const loop = () => {
      const prev = currentFrameRef.current;
      currentFrameRef.current = lerp(prev, targetFrameRef.current, 0.12);

      // Only repaint when there's a meaningful difference (avoids wasted draws)
      if (Math.abs(currentFrameRef.current - prev) > 0.01) {
        renderFrame(Math.round(currentFrameRef.current));
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", updateSize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function renderFrame(index: number) {
    const img = imagesRef.current[index];
    if (img && img.complete && contextRef.current) {
      const c = contextRef.current;
      const { w: cW, h: cH } = dimsRef.current;
      const iW = img.width || 1;
      const iH = img.height || 1;
      const scale = Math.max(cW / iW, cH / iH);
      const x = (cW / scale - iW) / 2;
      const y = (cH / scale - iH) / 2;
      c.clearRect(0, 0, cW, cH);
      c.save();
      c.scale(scale, scale);
      c.drawImage(img, x, y);
      c.restore();
    }
  }

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#main-scroll-container",
      start: "top top",
      end: "bottom bottom",
      // scrub: 1.5 adds a built-in GSAP lag so the playhead eases toward scroll position
      scrub: 1.5,
      onUpdate: (self) => {
        // Only update the target; the RAF loop smoothly interpolates toward it
        targetFrameRef.current = (FRAME_COUNT - 1) * self.progress;
      },
    });
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
    </div>
  );
}
