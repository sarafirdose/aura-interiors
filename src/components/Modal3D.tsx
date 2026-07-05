"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center } from "@react-three/drei";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface Modal3DProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function Modal3D({ isOpen, onClose, title }: Modal3DProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[200] bg-black/60 flex flex-col items-center justify-center px-4"
        >
          <button onClick={onClose} className="absolute top-8 right-8 md:top-12 md:right-12 text-white/70 hover:text-white text-4xl hover:scale-110 transition-transform z-10 cursor-pointer">
            <IoClose />
          </button>
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full h-full max-w-5xl max-h-[70vh] md:max-h-[80vh] flex flex-col items-center justify-center relative mt-12"
          >
             <h3 className="text-2xl md:text-4xl font-light tracking-widest text-white mb-4 absolute top-0 text-center uppercase drop-shadow-lg">{title}</h3>
             <p className="text-white/50 text-xs md:text-sm tracking-widest uppercase mb-8 absolute top-12 md:top-14">Interactive 3D Viewer</p>
             <div className="w-full h-full cursor-grab active:cursor-grabbing mt-16">
               <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                 <ambientLight intensity={0.5} />
                 <directionalLight position={[10, 10, 10]} intensity={1} />
                 <Environment preset="city" />
                 <Suspense fallback={null}>
                   <RealModel title={title} />
                 </Suspense>
                 <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
               </Canvas>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RealModel({ title }: { title: string }) {
  const isTable = title.toLowerCase().includes('table') || title.toLowerCase().includes('desk');
  const isSofa = title.toLowerCase().includes('sofa');
  
  let modelUrl = "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/chair-wood/model.gltf";
  
  if (isTable) {
    modelUrl = "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/table-wood/model.gltf";
  } else if (isSofa) {
    modelUrl = "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/model.gltf";
  }

  const { scene } = useGLTF(modelUrl);

  return (
    <Center>
      <primitive object={scene} scale={2} />
    </Center>
  );
}

useGLTF.preload("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/chair-wood/model.gltf");
useGLTF.preload("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/table-wood/model.gltf");
useGLTF.preload("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/model.gltf");
