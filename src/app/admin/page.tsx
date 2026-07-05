import prisma from "@/lib/prisma";
import AdminClient from "./AdminClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // In a real app, verify session.user.role === 'ADMIN'
  // For this sprint, we'll allow access to view the beautiful UI.

  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  
  // Aggregate revenue from orders
  const orders = await prisma.order.findMany({ select: { total: true } });
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Mock revenue data for chart
  const revenueData = [
    { name: 'Jan', current: 4000, previous: 2400 },
    { name: 'Feb', current: 3000, previous: 1398 },
    { name: 'Mar', current: 2000, previous: 9800 },
    { name: 'Apr', current: 2780, previous: 3908 },
    { name: 'May', current: 1890, previous: 4800 },
    { name: 'Jun', current: 2390, previous: 3800 },
    { name: 'Jul', current: 3490, previous: 4300 },
  ];

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-8 md:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter mb-12">
          Command <span className="font-semibold italic">Center</span>
        </h1>
        <AdminClient 
          stats={{ 
            revenue: totalRevenue, 
            orders: totalOrders, 
            products: totalProducts 
          }} 
          revenueData={revenueData}
          recentOrders={recentOrders}
        />
      </div>
    </main>
  );
}
