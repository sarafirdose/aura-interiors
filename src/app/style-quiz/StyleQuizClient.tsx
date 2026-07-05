"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiCpu, FiUser, FiShoppingCart, FiRefreshCw } from "react-icons/fi";
import { useStore } from "@/store/useStore";

const AI_CONVERSATION_STEPS = [
  {
    id: "room",
    aiMessage: "Greetings. I am AURA's AI Interior Architect. Let's begin by defining the boundaries of your sanctuary. Which room are we curating today?",
    options: [
      { label: "Living Room Space", value: "living-room", rawCategory: "living-room" },
      { label: "Serene Bedroom", value: "bedroom", rawCategory: "bedroom" },
      { label: "Dining Hall", value: "dining", rawCategory: "dining" },
      { label: "Professional Study & Office", value: "office", rawCategory: "office" }
    ]
  },
  {
    id: "material",
    aiMessage: "Ah, a beautiful canvas. To define the touch and feel of the space, select the primary material texture that resonates with your design aesthetic:",
    options: [
      { label: "Italian Leather", value: "Italian Leather" },
      { label: "Solid Oak Wood", value: "Solid Oak" },
      { label: "Rich Walnut Wood", value: "Walnut" },
      { label: "Velvet Upholstery", value: "Velvet" },
      { label: "Calacatta Marble", value: "Marble" },
      { label: "Polished Brass & Gold", value: "Brass" }
    ]
  },
  {
    id: "lighting",
    aiMessage: "Lighting shapes emotion. How do you envision illuminating this design space?",
    options: [
      { label: "Sculptural Pendant Lights", value: "sculptural" },
      { label: "Warm Ambient floor lamps", value: "ambient" },
      { label: "Minimalist Recessed Spotlights", value: "minimalist" }
    ]
  },
  {
    id: "budget",
    aiMessage: "Lastly, let's establish the investment tier for this collection to optimize materials and selection constraints:",
    options: [
      { label: "Curated Collection (Under ₹25,000)", value: "low" },
      { label: "Premium Selection (₹25,000 - ₹75,000)", value: "medium" },
      { label: "Bespoke Luxury (₹75,000+)", value: "high" }
    ]
  }
];

export default function StyleQuizClient({ products }: { products: any[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "ai" | "user", text: string }>>([
    { sender: "ai", text: AI_CONVERSATION_STEPS[0].aiMessage }
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState("Parsing design coordinates...");
  const [results, setResults] = useState<any[] | null>(null);
  const [styleProfile, setStyleProfile] = useState("");

  const { addToCart } = useStore();
  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const handleOptionClick = (option: { label: string, value: string }) => {
    const stepId = AI_CONVERSATION_STEPS[currentStep].id;
    const nextAnswers = { ...answers, [stepId]: option.value };
    setAnswers(nextAnswers);

    // Add user response to chat history
    const updatedHistory = [
      ...chatHistory,
      { sender: "user" as const, text: option.label }
    ];
    setChatHistory(updatedHistory);

    if (currentStep < AI_CONVERSATION_STEPS.length - 1) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep(prev => prev + 1);
        setChatHistory(prev => [
          ...prev,
          { sender: "ai", text: AI_CONVERSATION_STEPS[currentStep + 1].aiMessage }
        ]);
      }, 800);
    } else {
      triggerAIAnalysis(nextAnswers);
    }
  };

  const triggerAIAnalysis = (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);
    const steps = [
      "Calculating visual harmony ratios...",
      "Matching selected material textures with database models...",
      "Evaluating pricing constraints...",
      "Generating bespoke spatial profile..."
    ];

    steps.forEach((text, i) => {
      setTimeout(() => setAnalysisText(text), i * 700);
    });

    setTimeout(() => {
      // Filter products based on selected room category and material, then fallback to random
      const selectedCategory = finalAnswers["room"];
      const selectedMat = finalAnswers["material"];
      const selectedBudget = finalAnswers["budget"];

      let filtered = products.filter(p => {
        const catMatch = selectedCategory ? p.category?.slug === selectedCategory : true;
        const matMatch = selectedMat ? p.material === selectedMat : true;
        return catMatch || matMatch;
      });

      // Budget filtering
      filtered = filtered.filter(p => {
        const price = p.salePrice || p.price;
        if (selectedBudget === "low") return price < 25000;
        if (selectedBudget === "medium") return price >= 25000 && price <= 75000;
        return price > 75000;
      });

      // Settle on recommendations
      if (filtered.length < 3) {
        // Fallback to category match if budget is too strict
        filtered = products.filter(p => p.category?.slug === selectedCategory).slice(0, 3);
      }
      if (filtered.length < 3) {
        // Ultimate fallback
        filtered = products.sort(() => 0.5 - Math.random()).slice(0, 3);
      }

      // Generate custom profile name
      const profileName = `${finalAnswers["material"] || "Bespoke"} ${
        selectedCategory === "living-room" ? "Modernist" : 
        selectedCategory === "bedroom" ? "Minimalist" : 
        selectedCategory === "office" ? "Executive" : "Connoisseur"
      }`;

      setStyleProfile(profileName);
      setResults(filtered.slice(0, 3));
      setIsAnalyzing(false);
    }, 3000);
  };

  const addAllToCart = () => {
    if (!results) return;
    results.forEach(product => {
      addToCart({ product, quantity: 1 });
    });
    alert("AI-recommended items added to cart!");
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <AnimatePresence mode="wait">
        
        {/* Results Screen */}
        {results && !isAnalyzing ? (
          <motion.div 
            key="results" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
             <div className="text-center space-y-4">
               <span className="text-xs text-white/50 tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                 AI PROFILE MATCHED
               </span>
               <h1 className="text-4xl md:text-6xl font-light tracking-tight mt-6">
                 The <span className="font-semibold italic">{styleProfile}</span>
               </h1>
               <p className="text-white/60 font-light max-w-xl mx-auto leading-relaxed text-sm md:text-base">
                 Your answers reflect a strong appreciation for organic symmetry, honest materials, and sophisticated spatial logic. We've matched you with these signature designs.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {results.map((product, idx) => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col hover:border-white/30 transition-all"
                  >
                    <div className="absolute top-6 left-6 z-10 text-[10px] font-semibold tracking-widest uppercase bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white/95">
                      Match {98 - idx * 2}%
                    </div>
                    <Link href={`/shop/${product.id}`} className="relative aspect-square w-full rounded-2xl overflow-hidden mb-6 block bg-white/5">
                      <Image src={product.heroImage} alt={product.name} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-white/40 tracking-widest uppercase mb-1.5">{product.category?.name || "Bespoke"}</div>
                        <Link href={`/shop/${product.id}`} className="text-lg font-light mb-4 block hover:underline line-clamp-1">{product.name}</Link>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-medium">{formatPrice(product.salePrice || product.price)}</span>
                        <button 
                          onClick={() => addToCart({ product, quantity: 1 })}
                          className="bg-white text-black p-2.5 rounded-full hover:bg-white/90 active:scale-95 transition-all text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
               ))}
             </div>

             <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12">
               <button 
                 onClick={addAllToCart}
                 className="px-12 py-5 bg-white text-black rounded-full font-medium shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-103 transition-transform"
               >
                 Add All Matches to Cart
               </button>
               <button 
                 onClick={() => window.location.reload()} 
                 className="flex items-center gap-2 px-8 py-5 border border-white/10 hover:bg-white/5 rounded-full text-sm font-light text-white/60 hover:text-white transition-all"
               >
                 <FiRefreshCw /> Retake AI Quiz
               </button>
             </div>
          </motion.div>
        ) : (
          /* Conversational Interface */
          <motion.div key="chat" className="space-y-8 min-h-[50vh] flex flex-col justify-between">
            {/* Chat Messages Log */}
            <div className="space-y-6 flex-1 overflow-y-auto max-h-[60vh] scrollbar-none pr-2">
              <AnimatePresence>
                {chatHistory.map((msg, i) => (
                  <motion.div
                    key={`msg-${i}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border shrink-0 ${
                      msg.sender === "ai" ? "bg-white/5 border-white/10 text-white" : "bg-white text-black border-white"
                    }`}>
                      {msg.sender === "ai" ? <FiCpu /> : <FiUser />}
                    </div>
                    <div className={`p-5 rounded-3xl max-w-xl text-sm font-light leading-relaxed border ${
                      msg.sender === "ai" 
                        ? "bg-white/5 border-white/5 text-white/90 rounded-tl-none" 
                        : "bg-white/10 border-white/20 text-white rounded-tr-none"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Analyzer loading state */}
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 text-sm text-white/40 font-light pl-12"
                >
                  <FiCpu className="animate-spin text-lg" />
                  <span>{analysisText}</span>
                </motion.div>
              )}
            </div>

            {/* Interaction Options Drawer */}
            {!isAnalyzing && currentStep < AI_CONVERSATION_STEPS.length && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 border-t border-white/10"
              >
                <div className="flex justify-between items-center text-xs text-white/40 mb-4 tracking-widest uppercase">
                  <span>AURA Studio Design Consultation</span>
                  <span>Step {currentStep + 1} of {AI_CONVERSATION_STEPS.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AI_CONVERSATION_STEPS[currentStep].options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionClick(opt)}
                      className="p-6 text-left border border-white/10 hover:border-white/40 hover:bg-white/5 rounded-2xl transition-all font-light text-white/80 hover:text-white"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
