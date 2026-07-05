import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Note: For demonstration in this sprint, we'll allow viewing the dashboard even without auth, 
  // falling back to a "Guest Profile" or you could uncomment the redirect below.
  // if (!session) {
  //  redirect("/api/auth/signin");
  // }

  // Fetch real orders if session exists
  const orders = session?.user?.email ? await prisma.order.findMany({
    where: { user: { email: session.user.email } },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  }) : [];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-8 md:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter mb-12">
          Your <span className="font-semibold italic">Sanctuary</span>
        </h1>
        <DashboardClient user={session?.user || { name: "Guest User", email: "guest@auraluxury.com" }} orders={orders} />
      </div>
    </main>
  );
}
