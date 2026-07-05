"use client";
import { motion, useScroll } from "framer-motion";

export default function Minimap() {
  const { scrollYProgress } = useScroll();
  
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none hidden md:flex">
      <div className="text-[10px] tracking-widest text-white/50 uppercase -rotate-90 mb-8 whitespace-nowrap">Explore</div>
      <div className="w-[2px] h-[30vh] bg-white/10 relative rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 bg-white/80"
          style={{ height: "100%", scaleY: scrollYProgress, transformOrigin: "top" }}
        />
      </div>
    </div>
  );
}
