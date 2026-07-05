"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { HiMenuAlt4, HiOutlineShoppingBag } from "react-icons/hi";
import { FiSun, FiMoon } from "react-icons/fi";
import MagneticButton from "@/components/MagneticButton";
import { useStore } from "@/store/useStore";
import CartDrawer from "@/components/CartDrawer";

function CartButton() {
  const { cart, openCart } = useStore();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button onClick={openCart} className="relative text-white p-2 hover:opacity-80 transition-opacity">
      <HiOutlineShoppingBag className="text-2xl" />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}

function AmbientToggle() {
  const { ambientMode, toggleAmbientMode } = useStore();
  
  return (
    <button 
      onClick={toggleAmbientMode}
      className="relative flex items-center justify-between w-16 h-8 rounded-full bg-white/5 border border-white/10 p-1 cursor-pointer transition-all duration-500 hover:border-white/30"
    >
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className="absolute w-6 h-6 rounded-full bg-white flex items-center justify-center text-black shadow-md"
        style={{ left: ambientMode === "day" ? "4px" : "34px" }}
      >
        {ambientMode === "day" ? (
          <FiSun className="text-xs text-amber-500 stroke-[2]" />
        ) : (
          <FiMoon className="text-xs text-indigo-500 stroke-[2]" />
        )}
      </motion.div>
      <span className="text-[10px] pl-2.5 text-white/30"><FiSun /></span>
      <span className="text-[10px] pr-2.5 text-white/30"><FiMoon /></span>
    </button>
  );
}

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass px-8 py-4 flex items-center justify-between"
    >
      <div className="text-xl font-bold tracking-widest text-white">
        AURA
      </div>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide text-white/70">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <a href="/shop" className="hover:text-white transition-colors">Shop</a>
        <a href="/interior-ai" className="hover:text-white transition-colors text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-white/50">Aura Studio</a>
        <a href="/style-quiz" className="hover:text-white transition-colors">Style Quiz</a>
        <a href="/shop?category=living-room" className="hover:text-white transition-colors">Living</a>
        <a href="/shop?category=bedroom" className="hover:text-white transition-colors">Bedroom</a>
      </div>

      <div className="flex items-center gap-5">
        <AmbientToggle />
        <CartButton />
        <MagneticButton>
          <button className="text-white p-2">
            <HiMenuAlt4 className="text-2xl" />
          </button>
        </MagneticButton>
      </div>
      <CartDrawer />
    </motion.nav>
  );
}
