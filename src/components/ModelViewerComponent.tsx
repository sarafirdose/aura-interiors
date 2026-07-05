"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { FiMaximize, FiBox } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface ModelViewerComponentProps {
  glbUrl: string;
  usdzUrl?: string | null;
  alt: string;
  onClose?: () => void;
  isModal?: boolean;
}

export default function ModelViewerComponent({ glbUrl, usdzUrl, alt, onClose, isModal = true }: ModelViewerComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const viewerRef = useRef<any>(null);

  // Extend JSX intrinsic elements to allow model-viewer without TS errors
  // done via @ts-ignore on the element.

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const content = (
    <div className={`w-full h-full relative ${isModal ? 'bg-[#111]' : 'bg-transparent'} rounded-3xl overflow-hidden shadow-2xl`}>
      {/* @ts-ignore */}
      <model-viewer
        ref={viewerRef}
        src={glbUrl}
        ios-src={usdzUrl || undefined}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      >
        <div slot="progress-bar" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-sm tracking-widest uppercase">
          Loading AR Experience...
        </div>

        <button 
          slot="ar-button" 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-medium flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          <FiBox className="text-xl" /> Enter AR
        </button>
      {/* @ts-ignore */}
      </model-viewer>

      {isModal && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors z-10 shadow-lg"
        >
          <IoClose size={24} />
        </button>
      )}
    </div>
  );

  if (!isModal) return content;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 p-4 md:p-12 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-7xl max-h-screen animate-in fade-in zoom-in-95 duration-500">
        {content}
      </div>
    </div>
  );
}
