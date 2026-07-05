"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { FiX, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, closeCart } = useStore();

  const total = cart.reduce((acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0f0f0f] text-white z-50 p-6 flex flex-col border-l border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light">Your Cart</h2>
              <button onClick={closeCart} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {cart.length === 0 ? (
                <div className="text-white/40 text-center mt-20 font-light tracking-wide">Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.product.id}-${item.variantId}`} className="flex gap-4 bg-white/5 p-4 rounded-2xl">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 shrink-0">
                      <Image src={item.product.heroImage} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <button onClick={() => removeFromCart(item.product.id, item.variantId)} className="text-white/40 hover:text-red-400 transition-colors">
                            <FiTrash2 />
                          </button>
                        </div>
                        {item.color && <div className="text-xs text-white/50 mt-1">Color: {item.color}</div>}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-lg font-light">{formatPrice(item.product.salePrice || item.product.price)}</div>
                        <div className="flex items-center border border-white/20 rounded-full">
                          <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.variantId)} className="px-3 py-1 hover:bg-white/10 rounded-l-full">-</button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)} className="px-3 py-1 hover:bg-white/10 rounded-r-full">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-white/10 mt-6">
                <div className="flex justify-between items-center mb-6 text-lg font-light">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Link href="/checkout" onClick={closeCart} className="w-full block text-center bg-white text-black font-medium py-4 rounded-full hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Checkout securely
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
