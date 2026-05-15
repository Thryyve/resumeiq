"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Zap, Check, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BillingPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      // Create order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert("Failed to create order");
        setLoading(false);
        return;
      }

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: "INR",
          name: "ResumeIQ",
          description: "Pro Plan — Unlimited Analyses",
          order_id: orderData.orderId,
          handler: async (response: any) => {
            // Verify payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              await update(); // refresh session
              alert("🎉 Payment successful! You are now on Pro plan.");
              window.location.reload();
            } else {
              alert("Payment verification failed. Contact support.");
            }
          },
          prefill: {
            name: session?.user.name,
            email: session?.user.email,
          },
          theme: {
            color: "#2563eb",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      };
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  const isPro = session?.user.plan === "PRO";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-gray-400 mt-1">Manage your subscription</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {/* Free Plan */}
        <div className={`bg-gray-900 border rounded-xl p-6 ${
          !isPro ? "border-blue-500" : "border-gray-800"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Free</h2>
            {!isPro && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                Current Plan
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-white mb-1">₹0</p>
          <p className="text-gray-400 text-sm mb-6">Forever free</p>
          <ul className="space-y-3">
            {["3 resume analyses", "Basic AI feedback", "History tracking"].map(
              (feature) => (
                <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check size={16} className="text-green-400" />
                  {feature}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className={`bg-gray-900 border rounded-xl p-6 ${
          isPro ? "border-blue-500" : "border-gray-800"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Pro</h2>
            {isPro && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                Current Plan
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-white mb-1">₹499</p>
          <p className="text-gray-400 text-sm mb-6">One-time payment</p>
          <ul className="space-y-3 mb-6">
            {[
              "Unlimited analyses",
              "Advanced AI feedback",
              "ATS keyword analysis",
              "Priority support",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                <Check size={16} className="text-green-400" />
                {feature}
              </li>
            ))}
          </ul>

          {!isPro && (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Zap size={18} />
              )}
              {loading ? "Processing..." : "Upgrade to Pro"}
            </button>
          )}

          {isPro && (
            <div className="w-full text-center py-3 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium">
              ✓ You are on Pro Plan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}