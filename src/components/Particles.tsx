"use client";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  maxOpacity: number;
}

export default function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles on client, but animate purely via CSS to save JS thread
    const arr = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -30, // Negative delay so they start already moving
      maxOpacity: Math.random() * 0.4 + 0.1,
    }));
    const timeout = setTimeout(() => {
      setParticles(arr);
    }, 0);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/40 blur-[2px] particle"
            style={{ 
              width: p.size, 
              height: p.size, 
              left: `${p.x}vw`, 
              top: `${p.y}vh`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              // @ts-expect-error Custom CSS variable for keyframes
              "--max-opacity": p.maxOpacity
            }}
          />
        ))}
      </div>
      <div className="light-rays" />
      <div className="film-grain" />
    </>
  );
}
