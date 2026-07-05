import prisma from "@/lib/prisma";
import InteriorAIClient from "./InteriorAIClient";

export const dynamic = "force-dynamic";

export default async function InteriorAIPage() {
  // Fetch a pool of products to act as the AI database
  const allProducts = await prisma.product.findMany({
    include: { category: true }
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-8 md:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-4 text-center">
          Aura <span className="font-semibold italic">Studio</span>
        </h1>
        <p className="text-center text-white/50 mb-16 tracking-wide">Design your sanctuary with our digital design consultant.</p>
        
        <InteriorAIClient allProducts={allProducts} />
      </div>
    </main>
  );
}
