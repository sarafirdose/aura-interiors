"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useStore } from "@/store/useStore";
import { FiHeart, FiShoppingCart, FiSearch, FiSliders, FiX } from "react-icons/fi";

function CategoryBanner({ videoSrc, title, italicTitle, description }: {
  videoSrc: string;
  title: string;
  italicTitle: string;
  description: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax Scroll trigger
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Transform coordinates for 3D layered parallax depth
  const videoY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0.45, 0.75]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, clipPath: "inset(6% 8% 6% 8% round 3rem)" }}
      animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 3.5rem)" }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden border border-white/10 group shadow-[0_0_50px_rgba(255,255,255,0.05)] bg-black"
    >
      {/* Ambient gradient overlay */}
      <motion.div 
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 z-10 pointer-events-none" 
      />
      
      {/* Parallax Video */}
      <motion.video 
        src={videoSrc} 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{ y: videoY, height: "125%" }}
        className="absolute top-[-12.5%] left-0 w-full object-cover pointer-events-none scale-105"
      />
      
      {/* Staggered Text Reveal */}
      <motion.div 
        style={{ y: textY }}
        className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-20 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs md:text-sm text-white/40 tracking-[0.25em] uppercase mb-4 block font-medium">
            Curated Spaces
          </span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, letterSpacing: "-0.04em", y: 25 }}
          animate={{ opacity: 1, letterSpacing: "-0.02em", y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-7xl font-light tracking-tight mb-4 drop-shadow-md text-white"
        >
          {title} <span className="font-semibold italic text-white/95">{italicTitle}</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base text-white/50 font-light max-w-xl leading-relaxed drop-shadow-sm"
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Luxury AURA Tag */}
      <div className="absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <span className="text-[10px] tracking-[0.3em] uppercase bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white/80 font-light">
          AURA CINEMATIC
        </span>
      </div>
    </motion.div>
  );
}

export default function ShopClient({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toggleWishlist, wishlist, addToCart } = useStore();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const currentMaterial = searchParams.get("material");
  const currentSearch = searchParams.get("search") || "";

  const [searchVal, setSearchVal] = useState(currentSearch);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const yCol2 = useTransform(scrollYProgress, [0, 1], isDesktop ? [-80, 80] : [0, 0]);
  const yCol3 = useTransform(scrollYProgress, [0, 1], isDesktop ? [80, -80] : [0, 0]);

  // Divide products into 3 columns for staggered vertical layout
  const col1 = initialProducts.filter((_, idx) => idx % 3 === 0);
  const col2 = initialProducts.filter((_, idx) => idx % 3 === 1);
  const col3 = initialProducts.filter((_, idx) => idx % 3 === 2);

  // Keep local search input synced with URL
  useEffect(() => {
    setSearchVal(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set("search", searchVal.trim());
    } else {
      params.delete("search");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleMaterialClick = (material: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentMaterial === material) {
      params.delete("material");
    } else {
      params.set("material", material);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchVal("");
    router.push("/shop");
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="space-y-8">
      {/* Category Navigation Dock */}
      <div className="relative w-full border-b border-white/10 pb-6">
        <div className="flex overflow-x-auto scrollbar-none gap-3 -mx-8 px-8 xl:mx-0 xl:px-0 scroll-smooth">
          <Link 
            href="/shop" 
            className={`shrink-0 px-6 py-3 rounded-full text-sm font-light border transition-all ${
              !currentCategory 
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
            }`}
          >
            All Products
          </Link>
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              href={`/shop?category=${cat.slug}`} 
              className={`shrink-0 px-6 py-3 rounded-full text-sm font-light border transition-all capitalize ${
                currentCategory === cat.slug 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Controls & Filter Summary Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Left Side: Results count & Quick reset */}
        <div className="flex items-center gap-4 text-sm font-light text-white/50 w-full sm:w-auto">
          <span>Showing {initialProducts.length} products</span>
          {(currentCategory || currentMaterial || currentSearch) && (
            <button 
              onClick={handleClearFilters}
              className="text-xs text-white hover:text-white/80 border border-white/20 hover:border-white/40 px-3 py-1 rounded-full transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Right Side: Search bar & Filters Toggle button */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input 
              type="text" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm font-light text-white outline-none focus:border-white/30 transition-colors"
            />
          </form>
          <button 
            onClick={() => setIsFilterOpen(true)} 
            className="flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0"
          >
            <FiSliders /> Filters {(currentMaterial || currentSearch || currentCategory) && "•"}
          </button>
        </div>
      </div>

      {/* Floating Slide-out Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"
            />
            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-[#0c0c0c] border-l border-white/10 p-8 z-[500] shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center pb-6 border-b border-white/10">
                  <h3 className="text-xl font-light tracking-wide">Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-white/50 hover:text-white p-2 text-xl">
                    <FiX />
                  </button>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Price Range</h4>
                  <input type="range" className="w-full accent-white" />
                  <div className="flex justify-between text-xs text-white/50 mt-2">
                    <span>₹5,000</span>
                    <span>₹150,000+</span>
                  </div>
                </div>

                {/* Materials Filter */}
                <div>
                  <h4 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Italian Leather', 'Solid Oak', 'Walnut', 'Velvet', 'Marble', 'Brass', 'Matte Steel'].map((m) => (
                      <button 
                        key={m} 
                        onClick={() => handleMaterialClick(m)}
                        className={`px-4 py-2 rounded-full text-xs border transition-colors ${
                          currentMaterial === m 
                            ? 'bg-white text-black border-white' 
                            : 'border-white/10 hover:border-white/30 bg-white/5 text-white/85'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {(currentMaterial || currentSearch || currentCategory) && (
                  <div className="pt-4">
                    <button 
                      onClick={handleClearFilters}
                      className="text-xs text-white/40 hover:text-white underline underline-offset-4"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-white text-black py-4 rounded-full font-medium text-sm hover:bg-white/90 active:scale-98 transition-all"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Category Video/Image Header Banner */}
      {currentCategory === 'bedroom' && (
        <CategoryBanner 
          videoSrc="/bedroom.mp4"
          title="Serene"
          italicTitle="Sanctuary"
          description="Immerse yourself in bedroom designs crafted for ultimate tranquility, deep rest, and premium luxury."
        />
      )}

      {currentCategory === 'living-room' && (
        <CategoryBanner 
          videoSrc="/living.mp4"
          title="Luxe"
          italicTitle="Living"
          description="Experience grand architectural flow designed for ultimate comfort, entertaining, and premium leisure."
        />
      )}

      {/* Flat Symmetrical Luxury Grid with Premium Hover Actions */}
      <div ref={containerRef} className="w-full mt-12 pb-24">
        {initialProducts.length === 0 ? (
          <div className="w-full text-center text-white/40 font-light py-20 tracking-wider">
            No matching designs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {initialProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} aspect="aspect-[4/5]" idx={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable animated premium product panel card
function ProductCard({ product, aspect, idx }: { product: any; aspect: string; idx: number }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const isWishlisted = wishlist.some(w => w.id === product.id);

  const formatPrice = (p: number) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(p);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: Math.min(idx * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col w-full"
    >
      {/* Image Panel */}
      <Link 
        href={`/shop/${product.id}`} 
        className={`relative ${aspect} bg-white/5 rounded-3xl overflow-hidden mb-4 block border border-white/5 shadow-md group-hover:border-white/15 transition-all duration-500`}
      >
        <Image 
          src={product.heroImage} 
          alt={product.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-[1.6s] ease-[0.16, 1, 0.3, 1] group-hover:scale-105"
        />
        
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-white text-black text-[9px] font-bold tracking-wider px-3.5 py-1.5 rounded-full z-10 shadow-sm">
            -{product.discount}% OFF
          </div>
        )}

        {/* Ambient Gold Glow Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Cinematic Black Mask on Hover */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Premium Floating Action Buttons (Staggered spring zoom entry) */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 z-10 pointer-events-none">
          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 text-white p-3.5 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-[0.16, 1, 0.3, 1] hover:bg-white hover:text-black hover:scale-110 active:scale-95 shadow-lg"
            style={{ transitionDelay: "0ms" }}
          >
            <FiHeart className={isWishlisted ? "fill-current" : ""} size={16} />
          </button>

          {/* Add to Cart Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart({ product, quantity: 1 });
            }}
            className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 text-white p-3.5 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-[0.16, 1, 0.3, 1] hover:bg-white hover:text-black hover:scale-110 active:scale-95 shadow-lg"
            style={{ transitionDelay: "50ms" }}
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </Link>

      {/* Flat Product Details below image */}
      <div className="flex justify-between items-start px-1">
        <div className="space-y-1">
          <Link href={`/shop/${product.id}`} className="text-base font-light text-white/90 group-hover:text-white transition-colors hover:underline block line-clamp-1">
            {product.name}
          </Link>
          <span className="text-[11px] text-white/40 tracking-wider font-light block">{product.material}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          {product.salePrice ? (
            <div className="flex flex-col items-end">
              <span className="text-base font-medium">{formatPrice(product.salePrice)}</span>
              <span className="text-[10px] text-white/40 line-through leading-none">{formatPrice(product.price)}</span>
            </div>
          ) : (
            <span className="text-base font-medium">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
