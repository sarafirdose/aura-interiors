"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export default function CustomCursor() {
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
      
      const target = e.target as HTMLElement;
      if (target?.closest('a, button, .cursor-pointer')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };
    
    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [visible, mouseX, mouseY]);

  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.08), transparent 50%)`;

  if (!visible) return null;

  return (
    <>
      <motion.div 
        className="fixed inset-0 z-[10] pointer-events-none mix-blend-screen"
        style={{ background: spotlight }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[100] mix-blend-difference flex items-center justify-center"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: clicked ? 0.8 : hovered ? 1.5 : 1,
          backgroundColor: clicked ? "rgba(255, 255, 255, 1)" : hovered ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <motion.div
          className="w-1 h-1 bg-white rounded-full"
          animate={{ opacity: clicked ? 0 : hovered ? 0 : 1 }}
        />
      </motion.div>
    </>
  );
}
