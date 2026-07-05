"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { FiHeart, FiShoppingCart, FiShare2, FiStar, FiTruck, FiShield, FiBox, FiSearch } from "react-icons/fi";
import Link from "next/link";
import ModelViewerComponent from "@/components/ModelViewerComponent";

export default function ProductClient({ product, recommendations }: { product: any, recommendations: any[] }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const { toggleWishlist, wishlist, addToCart } = useStore();

  const isWishlisted = wishlist.some(w => w.id === product.id);
  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="max-w-7xl mx-auto pb-32">
      {/* AR Viewer Modal */}
      {isAROpen && product.glbModelUrl && (
        <ModelViewerComponent
          glbUrl={product.glbModelUrl}
          usdzUrl={product.usdzModelUrl}
          alt={product.name}
          onClose={() => setIsAROpen(false)}
        />
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center cursor-zoom-out p-4 md:p-12"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div layoutId={`product-image-${product.id}`} className="relative w-full h-full max-w-6xl max-h-screen">
               <Image 
                 src={product.heroImage} 
                 alt={product.name} 
                 fill 
                 unoptimized
                 className="object-contain"
               />
            </motion.div>
            <button className="absolute top-8 right-8 text-white/50 hover:text-white text-5xl font-light">
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <div className="text-xs text-white/40 tracking-widest uppercase mb-8">
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-white transition-colors">{product.category?.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Gallery */}
        <div className="lg:w-2/3 space-y-4">
          <div className="relative aspect-[4/3] w-full bg-white/5 rounded-3xl overflow-hidden group cursor-zoom-in" onClick={() => setIsZoomed(true)}>
              <motion.div layoutId={`product-image-${product.id}`} className="absolute inset-0">
               <Image 
                 src={product.heroImage} 
                 alt={product.name} 
                 fill 
                 unoptimized
                 className="object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full flex items-center gap-2">
                    <FiSearch /> <span>Click to Zoom</span>
                  </div>
               </div>
             </motion.div>

             {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-white text-black text-xs font-bold px-4 py-2 rounded-full z-10">
                  -{product.discount}% OFF
                </div>
             )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img: any) => (
              <div key={img.id} className="relative aspect-square bg-white/5 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <Image src={img.url} alt={img.alt || product.name} fill unoptimized className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <h1 className="text-4xl font-light mb-2">{product.name}</h1>
            <div className="text-sm tracking-widest text-white/50 uppercase mb-6">{product.brand}</div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={i < Math.floor(product.rating) ? "fill-current" : "text-white/20"} />
                ))}
              </div>
              <span className="text-sm text-white/50">{product.rating} ({product.reviewCount} Reviews)</span>
            </div>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
              {product.salePrice ? (
                <>
                  <span className="text-4xl font-light">{formatPrice(product.salePrice)}</span>
                  <span className="text-xl text-white/40 line-through mb-1">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="text-4xl font-light">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold tracking-widest text-white/40 uppercase mb-4">Color : {selectedVariant?.color}</h3>
                <div className="flex gap-3">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedVariant?.id === variant.id ? 'border-white scale-110' : 'border-transparent hover:border-white/50'}`}
                      style={{ backgroundColor: variant.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded-full">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-white/10 rounded-l-full transition-colors">-</button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-white/10 rounded-r-full transition-colors">+</button>
                </div>
                <button 
                  onClick={() => addToCart({ product, variantId: selectedVariant?.id, color: selectedVariant?.color, quantity })}
                  className="flex-1 bg-white text-black font-medium px-8 py-4 rounded-full hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="p-4 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
                >
                  <FiHeart className={isWishlisted ? "fill-white text-white" : ""} />
                </button>
              </div>
              
              {product.glbModelUrl && (
                <button 
                  onClick={() => setIsAROpen(true)}
                  className="w-full bg-white/5 border border-white/20 text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                >
                  <FiBox className="text-xl" /> View in My Room (AR)
                </button>
              )}
            </div>

            {/* Quick Info */}
            <div className="space-y-4 text-sm text-white/60 font-light bg-white/5 p-6 rounded-2xl">
              <div className="flex items-center gap-3"><FiTruck className="text-white text-lg" /> Delivery in {product.deliveryTime}</div>
              <div className="flex items-center gap-3"><FiShield className="text-white text-lg" /> {product.warranty} Warranty</div>
              {product.assemblyRequired && <div className="flex items-center gap-3"><FiBox className="text-white text-lg" /> Assembly Required</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-white/10 pt-16">
        <div>
          <h2 className="text-2xl font-light mb-6">Product Story</h2>
          <p className="text-white/60 font-light leading-relaxed mb-8">{product.description}</p>
          <ul className="space-y-2 text-white/70 font-light">
            {JSON.parse(product.features || "[]").map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-white rounded-full" /> {feature}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-light mb-6">Specifications</h2>
          <div className="space-y-4">
            <div className="flex border-b border-white/10 pb-4">
              <span className="w-1/3 text-white/40">Material</span>
              <span className="w-2/3 text-white/90">{product.material}</span>
            </div>
            <div className="flex border-b border-white/10 pb-4">
              <span className="w-1/3 text-white/40">Dimensions</span>
              <span className="w-2/3 text-white/90">{product.dimensions}</span>
            </div>
            <div className="flex border-b border-white/10 pb-4">
              <span className="w-1/3 text-white/40">Weight</span>
              <span className="w-2/3 text-white/90">{product.weight}</span>
            </div>
            <div className="flex pb-4">
              <span className="w-1/3 text-white/40">Care</span>
              <span className="w-2/3 text-white/90">{product.careInstructions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Interior Designer - "Complete This Room" */}
      {recommendations.length > 0 && (
        <div className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-light mb-2">Complete this room.</h2>
              <p className="text-white/50 font-light tracking-wide">Our AI Interior Designer recommends these matching pieces.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {recommendations.map((rec) => (
               <Link href={`/shop/${rec.id}`} key={rec.id} className="group relative aspect-square bg-white/5 rounded-2xl overflow-hidden block">
                 <Image src={rec.heroImage} alt={rec.name} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                   <div className="text-xs text-white/50 tracking-widest uppercase mb-1">{rec.brand}</div>
                   <div className="text-lg font-medium">{rec.name}</div>
                   <div className="text-sm font-light text-white/70">{formatPrice(rec.price)}</div>
                 </div>
               </Link>
             ))}
          </div>
        </div>
      )}

    </div>
  );
}
