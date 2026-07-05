export const dynamic = "force-dynamic";

import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 px-8 md:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-12">
          Secure <span className="font-semibold italic">Checkout</span>
        </h1>
        <CheckoutClient />
      </div>
    </main>
  );
}
