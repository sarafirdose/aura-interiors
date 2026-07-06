"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { FiCamera, FiUpload, FiBox } from "react-icons/fi";
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
  const [arMode, setArMode] = useState<"3d" | "camera" | "upload">("3d");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const viewerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setUploadedImage(null);
      
      // Auto-detect and try environment camera first, then fall back to user camera (webcam)
      const constraints = {
        video: { facingMode: "environment" }
      };
      
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        // Fallback for laptops/desktops without environment camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setArMode("camera");
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Could not access camera. Please check camera permissions in your browser or try uploading an image.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera(); // Turn off camera stream if it was on
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setArMode("upload");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setUploadedImage(null);
    setArMode("3d");
  };

  const content = (
    <div className={`w-full h-full relative ${isModal ? 'bg-[#0f0f0f]' : 'bg-transparent'} rounded-3xl overflow-hidden shadow-2xl flex flex-col`}>
      {/* Title / Controls Header */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-1 max-w-[calc(100%-80px)]">
        <h2 className="text-white text-lg font-light tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{alt}</h2>
        <p className="text-white/50 text-xs tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {arMode === "camera" ? "Camera Overlay View" : arMode === "upload" ? "Room Photo Overlay" : "Interactive 3D Preview"}
        </p>
      </div>

      {/* Video stream for Webcam / Mobile Camera Overlay */}
      {arMode === "camera" && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Uploaded room photo background */}
      {arMode === "upload" && uploadedImage && (
        <img
          src={uploadedImage}
          alt="Room Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* 3D Canvas / model-viewer */}
      {/* @ts-ignore */}
      <model-viewer
        ref={viewerRef}
        src={glbUrl}
        ios-src={usdzUrl || undefined}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate={arMode === "3d"}
        shadow-intensity="1.5"
        environment-image="neutral"
        exposure="1"
        className="w-full h-full z-10"
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      >
        <div slot="progress-bar" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-xs tracking-widest uppercase z-30 bg-black/60 px-6 py-3 rounded-full backdrop-blur-md">
          Loading 3D Experience...
        </div>

        {/* Custom Native AR Button Slot */}
        <button 
          slot="ar-button" 
          className="absolute bottom-8 left-6 bg-white text-black px-6 py-3.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all z-20"
        >
          <FiBox className="text-base" /> Enter AR (ARCore/ARKit)
        </button>
      {/* @ts-ignore */}
      </model-viewer>

      {/* Hidden File Input for room image upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Bottom control panel */}
      <div className="absolute bottom-8 right-6 z-20 flex flex-col sm:flex-row gap-3 items-end sm:items-center">
        {arMode === "3d" ? (
          <>
            <button
              onClick={startCamera}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black px-6 py-3.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-lg"
            >
              <FiCamera className="text-base" /> Use Laptop/Phone Camera
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black px-6 py-3.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-lg"
            >
              <FiUpload className="text-base" /> Upload Room Photo
            </button>
          </>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-white text-black px-6 py-3.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            <IoClose size={16} /> Close Overlay
          </button>
        )}
      </div>

      {/* Touch/Mouse instructions helper overlay */}
      {(arMode === "camera" || arMode === "upload") && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-black/75 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-center pointer-events-none shadow-lg animate-fade-in">
          <p className="text-white text-[11px] font-light tracking-widest uppercase">
            💡 Drag to position • Scroll/Pinch to resize & rotate
          </p>
        </div>
      )}

      {/* Camera permission error overlay */}
      {cameraError && (
        <div className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <p className="text-red-400 text-sm mb-4">{cameraError}</p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setCameraError(null);
                fileInputRef.current?.click();
              }}
              className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-white/90 transition-all"
            >
              Upload Room Photo Instead
            </button>
            <button
              onClick={() => setCameraError(null)}
              className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-white/20 transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Modal Close Button */}
      {isModal && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors z-20 shadow-lg"
        >
          <IoClose size={20} />
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
