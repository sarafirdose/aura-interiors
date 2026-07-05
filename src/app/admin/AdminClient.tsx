"use client";

import { motion } from "framer-motion";
import { FiDollarSign, FiShoppingBag, FiBox, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";

export default function AdminClient({ stats, revenueData, recentOrders }: { stats: any, revenueData: any[], recentOrders: any[] }) {
  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="pb-32 space-y-12">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><FiDollarSign className="text-6xl" /></div>
           <h3 className="text-sm tracking-widest text-white/50 uppercase mb-2">Total Revenue</h3>
           <div className="text-4xl font-light mb-4">{formatPrice(stats.revenue || 1250000)}</div>
           <div className="flex items-center gap-2 text-sm text-green-400"><FiTrendingUp /> +14.5% from last month</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><FiShoppingBag className="text-6xl" /></div>
           <h3 className="text-sm tracking-widest text-white/50 uppercase mb-2">Total Orders</h3>
           <div className="text-4xl font-light mb-4">{stats.orders || 142}</div>
           <div className="flex items-center gap-2 text-sm text-green-400"><FiTrendingUp /> +5.2% from last month</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><FiBox className="text-6xl" /></div>
           <h3 className="text-sm tracking-widest text-white/50 uppercase mb-2">Active Products</h3>
           <div className="text-4xl font-light mb-4">{stats.products || 300}</div>
           <Link href="/shop" className="text-sm text-white/60 hover:text-white underline transition-colors">Manage Catalog</Link>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Revenue Graph Mock */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-light">Revenue Overview</h3>
             <select className="bg-white/10 border-none outline-none text-sm px-4 py-2 rounded-full cursor-pointer">
               <option className="bg-black text-white">This Year</option>
               <option className="bg-black text-white">Last Year</option>
             </select>
          </div>
          <div className="h-64 flex items-end gap-2 justify-between px-4">
            {revenueData.map((data, i) => (
              <div key={i} className="w-1/12 flex flex-col items-center gap-2 group">
                <div className="relative w-full h-full flex items-end justify-center">
                  <div className="w-full bg-white/5 rounded-t-sm transition-all group-hover:bg-white/10" style={{ height: `${(data.previous / 10000) * 100}%` }} />
                  <div className="absolute bottom-0 w-full bg-white rounded-t-sm transition-all group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ height: `${(data.current / 10000) * 100}%` }} />
                </div>
                <span className="text-xs text-white/40">{data.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:w-1/3 bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-light">Recent Orders</h3>
             <Link href="/admin/orders" className="text-sm text-white/40 hover:text-white">View All</Link>
          </div>
          <div className="space-y-6">
            {recentOrders.length === 0 ? (
              <div className="text-sm text-white/40">No recent orders.</div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center pb-6 border-b border-white/10 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium mb-1">{order.user?.name || "Guest User"}</div>
                    <div className="text-xs text-white/50">#{order.id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-light">{formatPrice(order.totalAmount)}</div>
                    <div className={`text-[10px] tracking-widest uppercase mt-1 ${order.status === 'PENDING' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Mock Order if DB is empty for UI purposes */}
            {recentOrders.length === 0 && (
              <div className="flex justify-between items-center pb-6 border-b border-white/10 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium mb-1">Priya Sharma</div>
                    <div className="text-xs text-white/50">#A9B2C4 • Today</div>
                  </div>
                  <div className="text-right">
                    <div className="font-light">{formatPrice(84500)}</div>
                    <div className="text-[10px] tracking-widest uppercase mt-1 text-green-400">PAID</div>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
