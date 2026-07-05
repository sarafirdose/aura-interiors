import prisma from "@/lib/prisma";
import StyleQuizClient from "./StyleQuizClient";

export const dynamic = "force-dynamic";

export default async function StyleQuizPage() {
  const products = await prisma.product.findMany({
    take: 50, // Grab a sample pool for the quiz results
    include: { category: true }
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-8 md:px-24">
      <StyleQuizClient products={products} />
    </main>
  );
}
