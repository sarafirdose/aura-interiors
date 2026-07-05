"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiCpu, FiRefreshCw, FiShoppingCart } from "react-icons/fi";
import { useStore } from "@/store/useStore";

const ROOMS = ["Living Room", "Bedroom", "Home Office", "Dining Room"];
const MOODS = [
  { name: "Minimalist Zen", desc: "Clean lines, neutral tones, breathing space." },
  { name: "Dark Academia", desc: "Rich woods, deep velvets, intellectual warmth." },
  { name: "Modern Industrial", desc: "Raw metals, exposed textures, urban edge." },
  { name: "Nordic Light", desc: "Bright whites, pale woods, pure simplicity." }
];

export default function InteriorAIClient({ allProducts }: { allProducts: any[] }) {
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoom, setGeneratedRoom] = useState<any[]>([]);
  
  const { addToCart } = useStore();

  const handleGenerate = () => {
    setIsGenerating(true);
    setStep(3);
    
    // Simulate AI generation delay
    setTimeout(() => {
      // Filter products based on selected room/mood roughly for the mock
      // In reality, this would use embeddings or a sophisticated tagging system
      const filtered = allProducts
        .sort(() => 0.5 - Math.random()) // Randomize for variety
        .slice(0, 4); // Pick 4 items for the room
        
      setGeneratedRoom(filtered);
      setIsGenerating(false);
    }, 3000);
  };

  const addAllToCart = () => {
    generatedRoom.forEach(product => {
      addToCart({ product, quantity: 1 });
    });
    alert("Entire room added to cart!");
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const roomTotal = generatedRoom.reduce((sum, item) => sum + (item.salePrice || item.price), 0);

  return (
    <div className="pb-32">
      <AnimatePresence mode="wait">
        
        {/* Step 1: Room Selection */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-light mb-8">What space are we designing?</h2>
            <div className="grid grid-cols-2 gap-4">
              {ROOMS.map(room => (
                <button 
                  key={room}
                  onClick={() => { setSelectedRoom(room); setStep(2); }}
                  className="p-8 border border-white/10 rounded-3xl hover:border-white/50 hover:bg-white/5 transition-all group"
                >
                  <span className="text-xl font-light group-hover:scale-110 inline-block transition-transform">{room}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Mood Selection */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <button onClick={() => setStep(1)} className="text-sm text-white/40 hover:text-white mb-4">← Back to Rooms</button>
              <h2 className="text-2xl font-light">Select the mood for your {selectedRoom}.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOODS.map(mood => (
                <div 
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`p-8 border rounded-3xl cursor-pointer transition-all ${selectedMood === mood.name ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/50 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-medium">{mood.name}</h3>
                    {selectedMood === mood.name && <FiCheck className="text-white text-xl" />}
                  </div>
                  <p className="text-white/50 font-light text-sm">{mood.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button 
                disabled={!selectedMood}
                onClick={handleGenerate}
                className="px-12 py-4 bg-white text-black rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105"
              >
                Generate My Sanctuary
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generation & Results */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-32">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                  <FiCpu className="text-6xl text-white/20 mb-8" />
                </motion.div>
                <h2 className="text-2xl font-light mb-2">Analyzing aesthetic parameters...</h2>
                <p className="text-white/40 tracking-widest uppercase text-sm">Curating {selectedMood} • {selectedRoom}</p>
              </div>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-8 border-b border-white/10">
                  <div>
                    <h2 className="text-3xl font-light mb-2">Your AI-Curated Sanctuary.</h2>
                    <p className="text-white/50 tracking-widest uppercase text-sm">{selectedMood} • {selectedRoom}</p>
                  </div>
                  <div className="flex gap-4 mt-6 md:mt-0">
                    <button onClick={handleGenerate} className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                      <FiRefreshCw /> Re-Roll
                    </button>
                    <button onClick={addAllToCart} className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform">
                      <FiShoppingCart /> Add Room to Cart ({formatPrice(roomTotal)})
                    </button>
                  </div>
                </div>

                {/* The Curated Room Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Feature piece takes up full width on mobile, half on desktop */}
                   {generatedRoom.slice(0, 1).map((product, idx) => (
                     <div key={`feat-${product.id}`} className="row-span-2 group relative bg-white/5 rounded-3xl overflow-hidden aspect-[3/4]">
                        <Image src={product.heroImage} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 w-full p-8">
                          <div className="text-xs tracking-widest text-white/50 uppercase mb-2">Anchor Piece</div>
                          <Link href={`/shop/${product.id}`} className="text-2xl font-light hover:underline">{product.name}</Link>
                          <div className="text-lg mt-1">{formatPrice(product.salePrice || product.price)}</div>
                        </div>
                     </div>
                   ))}

                   {/* Secondary pieces */}
                   <div className="grid grid-cols-1 gap-8">
                      {generatedRoom.slice(1, 3).map((product) => (
                        <div key={product.id} className="group flex gap-6 bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-white/30 transition-colors">
                          <Link href={`/shop/${product.id}`} className="relative w-1/3 aspect-square rounded-2xl overflow-hidden shrink-0">
                            <Image src={product.heroImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                          </Link>
                          <div className="flex flex-col justify-center">
                            <div className="text-[10px] tracking-widest text-white/40 uppercase mb-1">{product.category?.name || "Complementary"}</div>
                            <Link href={`/shop/${product.id}`} className="text-lg font-light mb-2 hover:underline line-clamp-2">{product.name}</Link>
                            <div className="font-medium">{formatPrice(product.salePrice || product.price)}</div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
