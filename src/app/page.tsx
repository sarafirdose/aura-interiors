"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CanvasScrubber from "@/components/CanvasScrubber";
import Section from "@/components/Section";
import LuxuryCard from "@/components/LuxuryCard";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import Modal3D from "@/components/Modal3D";
import { HiOutlineLightBulb, HiOutlineDesktopComputer } from "react-icons/hi";
import { BiBed, BiBath, BiChair, BiCoffeeTogo } from "react-icons/bi";
import { MdOutlineDining } from "react-icons/md";
import { GiSofa } from "react-icons/gi";

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <main id="main-scroll-container" className="relative w-full text-white selection:bg-white/30">
      <CanvasScrubber />
      
      {/* Living Room - Frame 0-6 */}
      <Section id="living-room" className="pt-[30vh]">
        <div className="max-w-xl p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white">
            <TextReveal text="The Living" /> <br/>
            <TextReveal text="Experience" delay={0.2} className="font-semibold italic text-white" />
          </h1>
          <p className="text-lg md:text-xl text-white font-light mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            <TextReveal text="Immerse yourself in a space designed for unparalleled comfort and modern aesthetics." delay={0.4} />
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[20vh]">
          <LuxuryCard
            title="Lounge Sofa"
            description="Premium Italian leather sofa with deep seating and cloud-like cushions."
            price="$4,500"
            icon={<GiSofa />}
            onClick={() => setActiveModal("Lounge Sofa")}
          />
          <LuxuryCard
            title="Oak Coffee Table"
            description="Minimalist solid oak centerpiece with natural wood grain finish."
            price="$1,200"
            icon={<BiCoffeeTogo />}
            onClick={() => setActiveModal("Oak Coffee Table")}
          />
        </div>
      </Section>

      {/* Dining Room - Frame 7-13 */}
      <Section id="dining-room" className="items-end text-right">
        <div className="max-w-xl p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5 inline-block">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white">
            <TextReveal text="Culinary" /> <br/>
            <TextReveal text="Gatherings" delay={0.2} className="font-semibold italic text-white" />
          </h2>
          <p className="text-lg text-white font-light mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
             <TextReveal text="Where every meal feels like a grand event, surrounded by timeless elegance." delay={0.4} />
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[20vh] w-full max-w-3xl text-left">
          <LuxuryCard
            title="Marble Dining Set"
            description="Extensible Calacatta marble table accommodating up to 10 guests."
            price="$8,900"
            icon={<MdOutlineDining />}
            onClick={() => setActiveModal("Marble Dining Set")}
          />
          <LuxuryCard
            title="Aura Chandelier"
            description="Floating LED rings providing warm, ambient illumination."
            price="$2,400"
            icon={<HiOutlineLightBulb />}
            onClick={() => setActiveModal("Aura Chandelier")}
          />
        </div>
      </Section>

      {/* Kitchen - Frame 14-20 */}
      <Section id="kitchen">
        <div className="max-w-xl p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white">
            <TextReveal text="Modern" /> <br/>
            <TextReveal text="Gastronomy" delay={0.2} className="font-semibold italic text-white" />
          </h2>
          <p className="text-lg text-white font-light drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
             <TextReveal text="State-of-the-art appliances seamlessly integrated into bespoke cabinetry." delay={0.4} />
          </p>
        </div>
      </Section>

      {/* Bedroom - Frame 21-27 */}
      <Section id="bedroom" className="flex-row items-center justify-between gap-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
          {/* Left Column: Mind-Blowing Cinematic Video Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-3/5 group relative aspect-video bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] hover:shadow-[0_0_80px_rgba(255,255,255,0.15)] transition-shadow duration-700"
          >
            {/* Ambient glow matching the room color */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-orange-500/10 opacity-60 mix-blend-color-dodge pointer-events-none" />
            
            <video 
              src="/bedroom.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-103"
            />
            
            {/* Glass details overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
              <div>
                <span className="text-xs text-white/50 uppercase tracking-widest">Interactive Tour</span>
                <h4 className="text-lg font-light text-white">The Bedroom Experience</h4>
              </div>
              <span className="text-xs px-4 py-2 border border-white/20 rounded-full text-white/80">Cinematic View</span>
            </div>
          </motion.div>

          {/* Right Column: Serene Sanctuary Content & Cloud Bed */}
          <div className="w-full lg:w-2/5 flex flex-col items-start lg:items-end text-left lg:text-right gap-8">
            <div className="p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5 inline-block">
              <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white">
                <TextReveal text="Serene" /> <br/>
                <TextReveal text="Sanctuary" delay={0.2} className="font-semibold italic text-white" />
              </h2>
            </div>
            <div className="w-full max-w-sm text-left">
              <LuxuryCard
                title="Cloud Bed"
                description="Upholstered frame with an integrated ambient lighting system."
                price="$5,200"
                icon={<BiBed />}
                onClick={() => setActiveModal("Cloud Bed")}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Home Office - Frame 28-34 */}
      <Section id="home-office">
        <div className="max-w-xl p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white">
            <TextReveal text="Focused" /> <br/>
            <TextReveal text="Ambition" delay={0.2} className="font-semibold italic text-white" />
          </h2>
          <p className="text-lg text-white font-light drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-4">
             <TextReveal text="An inspiring environment that sparks creativity and deep work." delay={0.4} />
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
          <LuxuryCard
            title="Executive Desk"
            description="Walnut standing desk with integrated wireless charging and wire management."
            price="$3,100"
            icon={<HiOutlineDesktopComputer />}
            onClick={() => setActiveModal("Executive Desk")}
          />
        </div>
      </Section>

      {/* Bathroom - Frame 35-41 */}
      <Section id="bathroom" className="items-end text-right">
        <div className="max-w-xl p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5 inline-block">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white">
            <TextReveal text="Spa" /> <br/>
            <TextReveal text="Retreat" delay={0.2} className="font-semibold italic text-white" />
          </h2>
        </div>
        <div className="mt-[15vh] w-full max-w-sm text-left">
          <LuxuryCard
            title="Freestanding Tub"
            description="Sculptural stone resin bathtub designed for ultimate relaxation."
            price="$4,800"
            icon={<BiBath />}
            onClick={() => setActiveModal("Freestanding Tub")}
          />
        </div>
      </Section>

      {/* Furniture Showcase - Frame 42-46 */}
      <Section id="furniture-showcase" className="justify-center items-center text-center">
         <div className="max-w-xl p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5 inline-block">
           <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white">
              <TextReveal text="Curated" /> <br/>
              <TextReveal text="Perfection" delay={0.2} className="font-semibold italic text-white" />
            </h2>
         </div>
          <div className="flex flex-wrap justify-center gap-6 mt-12 w-full">
            <LuxuryCard title="Accent Chair" description="Velvet upholstery with brass legs." icon={<BiChair />} price="$1,200" onClick={() => setActiveModal("Accent Chair")} />
            <LuxuryCard title="Console Table" description="Minimalist entryway piece." icon={<BiCoffeeTogo />} price="$950" onClick={() => setActiveModal("Console Table")} />
          </div>
      </Section>

      {/* Final Luxury Interior - Frame 47-50 */}
      <Section id="final" className="justify-end pb-32">
        <div className="glass p-12 rounded-3xl w-full max-w-4xl mx-auto text-center border border-white/10">
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            <TextReveal text="Welcome" /> <TextReveal text="Home." delay={0.2} className="font-semibold italic" />
          </h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
             <TextReveal text="Book a private consultation to experience these spaces in person." delay={0.4} />
          </p>
          <div className="flex justify-center">
            <MagneticButton>
              <button className="bg-white text-black px-12 py-5 rounded-full font-medium tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow duration-500 cursor-pointer">
                Schedule Viewing
              </button>
            </MagneticButton>
          </div>
        </div>
      </Section>

      {/* Elegant Footer */}
      <footer className="relative z-10 w-full bg-black border-t border-white/10 py-16 px-8 md:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold tracking-widest text-white">AURA</div>
          <div className="flex gap-8 text-sm text-white/50 tracking-wide font-light">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-xs text-white/30 tracking-wider">
            &copy; {new Date().getFullYear()} AURA INTERIORS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      <Modal3D isOpen={activeModal !== null} onClose={() => setActiveModal(null)} title={activeModal || ""} />
    </main>
  );
}
