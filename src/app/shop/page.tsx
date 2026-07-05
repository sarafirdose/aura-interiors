import prisma from "@/lib/prisma";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category as string | undefined;
  const search = resolvedSearchParams.search as string | undefined;
  const material = resolvedSearchParams.material as string | undefined;
  
  // Base query
  const where: any = {};
  if (category) where.category = { slug: category };
  if (material) where.material = material;
  if (search) {
    where.name = { contains: search }; // simple search, SQLite doesn't support full-text search as natively as Postgres
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      variants: true,
    },
    take: 50, // pagination limit for demo
    orderBy: {
      createdAt: 'desc'
    }
  });

  const categories = await prisma.category.findMany();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-8 md:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-12">
          The <span className="font-semibold italic">Collection</span>
        </h1>
        <ShopClient initialProducts={products} categories={categories} />
      </div>
    </main>
  );
}
