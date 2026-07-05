"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiCheckCircle, FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutClient() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const handlePayment = () => {
    setIsProcessing(true);
    // Mock Razorpay payment delay
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3); // Move to success step
      clearCart(); // Empty cart
    }, 2500);
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-light mb-4">Your cart is empty.</h2>
        <button onClick={() => router.push('/shop')} className="px-8 py-3 bg-white text-black rounded-full font-medium">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-16 pb-32">
      {/* Main Flow */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-light mb-8">1. Shipping Address</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" placeholder="First Name" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white/40 w-full" />
                  <input type="text" placeholder="Last Name" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white/40 w-full" />
                </div>
                <input type="text" placeholder="Complete Address" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white/40 w-full" />
                <div className="grid grid-cols-3 gap-6">
                  <input type="text" placeholder="City" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white/40 w-full" />
                  <input type="text" placeholder="State" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white/40 w-full" />
                  <input type="text" placeholder="PIN Code" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white/40 w-full" />
                </div>
                <input type="text" placeholder="Phone Number" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white/40 w-full" />
              </div>
              <button onClick={() => setStep(2)} className="mt-8 px-10 py-4 bg-white text-black rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="text-2xl font-light mb-8">2. Payment details</h2>
              
              <div className="bg-white/5 border border-white/20 p-6 rounded-2xl mb-8">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <input type="radio" checked readOnly className="accent-white" />
                  <span>Pay via Razorpay (UPI, Cards, NetBanking)</span>
                </div>
                <p className="text-white/50 text-sm font-light">You will be redirected to Razorpay to complete your purchase securely.</p>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setStep(1)} className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/5">
                  Back
                </button>
                <button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="flex-1 flex justify-center items-center gap-2 px-10 py-4 bg-white text-black rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">Processing <span className="animate-pulse">...</span></span>
                  ) : (
                    <span className="flex items-center gap-2"><FiLock /> Pay {formatPrice(total)}</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
              <FiCheckCircle className="text-6xl text-green-400 mx-auto mb-6" />
              <h2 className="text-4xl font-light mb-4">Order Confirmed!</h2>
              <p className="text-white/50 mb-8 text-lg font-light">Your luxury pieces are being prepared for shipping.</p>
              <button onClick={() => router.push('/dashboard')} className="px-10 py-4 bg-white text-black rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                View My Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order Summary Sidebar */}
      {step !== 3 && (
        <div className="lg:w-1/3">
          <div className="sticky top-32 bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-xl font-light mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.variantId}`} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                    <Image src={item.product.heroImage} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium line-clamp-1">{item.product.name}</div>
                    <div className="text-xs text-white/50">Qty: {item.quantity} {item.color && `| ${item.color}`}</div>
                    <div className="text-sm mt-1">{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-3 font-light text-sm">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-white pt-3 border-t border-white/10">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
