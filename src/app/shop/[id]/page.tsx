import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      category: true,
      variants: true,
      images: true,
      reviews: true,
    }
  });

  if (!product) notFound();

  // "Complete this room" AI interior recommendation mock
  // Find other products in the same category/room to recommend
  const aiRecommendations = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      room: product.room
    },
    take: 3,
    orderBy: { rating: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-8 md:px-24">
      <ProductClient product={product} recommendations={aiRecommendations} />
    </main>
  );
}
