"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

interface LuxuryCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  price?: string;
  onClick?: () => void;
}

export default function LuxuryCard({ title, description, icon, price, onClick }: LuxuryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll parallax effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // 3D Tilt mouse effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform coordinates to degrees rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  // Smooth springs for lag-free motion
  const rxSpring = useSpring(rotateX, { damping: 20, stiffness: 200 });
  const rySpring = useSpring(rotateY, { damping: 20, stiffness: 200 });

  // Shine/glare translation values
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["-50%", "50%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["-50%", "50%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor position relative to card center normalized between -0.5 and 0.5
    const x = (e.clientX - rect.left - width / 2) / width;
    const y = (e.clientY - rect.top - height / 2) / height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Smoothly snap back to center
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      ref={cardRef} 
      style={{ y: scrollY }} 
      className="w-full max-w-sm perspective-1000"
    >
      <motion.div
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          rotateX: rxSpring,
          rotateY: rySpring,
          transformStyle: "preserve-3d",
        }}
        className="relative group glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-4 text-white border border-white/10 cursor-pointer overflow-hidden transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(255,255,255,0.08)] bg-white/[0.03] backdrop-blur-md"
      >
        {/* Floating light glare element */}
        <motion.div
          className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_50%)] pointer-events-none z-0"
          style={{
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="flex items-start justify-between z-10" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-xl md:text-2xl font-light tracking-wide">{title}</h3>
          {icon && <div className="text-2xl text-white/70">{icon}</div>}
        </div>

        <p className="text-sm md:text-base text-white/60 leading-relaxed font-light z-10" style={{ transform: "translateZ(20px)" }}>
          {description}
        </p>

        {price && (
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center z-10" style={{ transform: "translateZ(10px)" }}>
            <span className="text-xs tracking-widest uppercase text-white/50">Starting at</span>
            <span className="text-lg font-medium">{price}</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
