"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import { FiBox, FiHeart, FiMapPin, FiLogOut, FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export default function DashboardClient({ user, orders }: { user: any, orders: any[] }) {
  const [activeTab, setActiveTab] = useState("wishlist");
  const { wishlist, toggleWishlist } = useStore();
  const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const tabs = [
    { id: "wishlist", label: "Wishlist", icon: FiHeart },
    { id: "orders", label: "Order History", icon: FiBox },
    { id: "addresses", label: "Address Book", icon: FiMapPin },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-12 pb-32">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <div className="mb-8">
          <div className="text-sm font-semibold tracking-widest text-white/40 uppercase mb-2">Welcome</div>
          <div className="text-xl font-light">{user?.name}</div>
          <div className="text-xs text-white/50">{user?.email}</div>
        </div>
        
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon /> {tab.label}
          </button>
        ))}
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white/60 hover:text-white hover:bg-white/5 mt-8 border-t border-white/10"
        >
          <FiLogOut /> Sign Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-light mb-8">Curated Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="text-center text-white/40 py-20 font-light">Your wishlist is currently empty.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map(product => (
                    <div key={product.id} className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                      <Link href={`/shop/${product.id}`} className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 block bg-white/5">
                        <Image src={product.heroImage} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </Link>
                      <Link href={`/shop/${product.id}`} className="flex-1">
                        <h3 className="font-light text-sm line-clamp-1 mb-1">{product.name}</h3>
                        <div className="text-xs text-white/50">{product.sku}</div>
                      </Link>
                      <div className="flex justify-between items-end mt-4">
                        <div className="text-sm">{formatPrice(product.salePrice || product.price)}</div>
                        <button onClick={() => toggleWishlist(product)} className="text-xs text-white/40 hover:text-white underline">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-light mb-8">Order History</h2>
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <FiBox className="text-4xl text-white/20 mx-auto mb-4" />
                  <div className="text-white/40 font-light mb-6">No recent orders found.</div>
                  <Link href="/shop" className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                       <div>
                         <div className="text-sm font-medium mb-1">Order #{order.id.slice(-8).toUpperCase()}</div>
                         <div className="text-xs text-white/50 mb-3">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                         <div className="text-xs tracking-widest uppercase px-3 py-1 bg-white/10 rounded-full inline-block">{order.status}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-xl font-light">{formatPrice(order.totalAmount)}</div>
                         <div className="text-xs text-white/50">{order.items?.length || 0} items</div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light">Address Book</h2>
                <button className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white/10">Add New</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white/10 border border-white/30 p-6 rounded-2xl relative">
                    <div className="absolute top-6 right-6 text-xs bg-white text-black px-2 py-1 rounded">Default</div>
                    <h3 className="font-medium mb-2">{user?.name || "John Doe"}</h3>
                    <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                      123 Luxury Avenue, Suite 400<br/>
                      Bandora West, Mumbai<br/>
                      Maharashtra, 400050<br/>
                      India
                    </p>
                    <div className="flex gap-4 text-sm text-white/50">
                      <button className="hover:text-white transition-colors">Edit</button>
                      <button className="hover:text-red-400 transition-colors">Delete</button>
                    </div>
                 </div>
               </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-light mb-8">Account Settings</h2>
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-white/40 uppercase mb-2">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl outline-none focus:border-white/40 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-white/40 uppercase mb-2">Email Address</label>
                  <input type="email" defaultValue={user?.email} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl outline-none focus:border-white/40 text-sm text-white/50" readOnly />
                </div>
                <button className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)]">Save Changes</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
