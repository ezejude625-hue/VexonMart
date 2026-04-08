"use client";
// ============================================================
// CHECKOUT SUCCESS — src/app/(store)/checkout/success/page.js
// ============================================================

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { formatDate, formatCurrency } from "@/lib/utils";

function SuccessContent() {
  const params = useSearchParams();
  const orderNum =
    params.get("order") ||
    "VXM-" + Math.random().toString(36).toUpperCase().slice(2, 10);
  const today = formatDate(new Date());

  const NEXT_STEPS = [
    { icon: "mail", text: "Order confirmation emailed to you", done: true },
    {
      icon: "inventory_2",
      text: "Seller is preparing your items",
      done: false,
    },
    {
      icon: "local_shipping",
      text: "Tracking number sent once shipped",
      done: false,
    },
    {
      icon: "check_circle",
      text: "Estimated delivery: 3–5 business days",
      done: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] bg-wheat flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Animated success icon */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center mb-6">
            {/* Pulse rings */}
            <div className="absolute w-36 h-36 rounded-full bg-emerald-100 animate-ring-pulse" />
            <div
              className="absolute w-28 h-28 rounded-full bg-emerald-100 animate-ring-pulse"
              style={{ animationDelay: "0.3s" }}
            />
            {/* Icon */}
            <div
              className="relative w-24 h-24 rounded-3xl bg-white flex items-center justify-center"
              style={{
                border: "2px solid #bbf7d0",
                boxShadow: "0 8px 32px rgba(34,197,94,0.25)",
              }}
            >
              <span className="material-symbols-outlined text-emerald-500 text-5xl material-symbols-filled">
                check_circle
              </span>
            </div>
          </div>

          <h1
            className="text-onyx mb-2"
            style={{
              fontFamily: '"Roboto Slab",sans-serif',
              fontWeight: 800,
              fontSize: "clamp(1.75rem,4vw,2.25rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Order Confirmed!
          </h1>
          <p className="text-onyx/50 text-sm">
            Thank you for shopping with VexonMart. Your order is on its way.
          </p>
        </div>

        {/* Order details card */}
        <div
          className="bg-white rounded-3xl overflow-hidden mb-5"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 4px 24px rgba(10,23,29,0.08)",
          }}
        >
          {/* Card header */}
          <div
            className="px-6 py-4 border-b"
            style={{
              background: "linear-gradient(135deg,#003F47,#1C3040)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.1em]">
                  Order Number
                </p>
                <p className="text-white font-mono font-bold text-lg mt-0.5">
                  {orderNum}
                </p>
              </div>
              <span className="badge badge-success">Paid</span>
            </div>
          </div>

          {/* Details rows */}
          <div className="divide-y" style={{ borderColor: "#F2EAE0" }}>
            {[
              {
                icon: "calendar_today",
                label: "Order Date",
                val: today,
                mono: false,
              },
              {
                icon: "package_2",
                label: "Status",
                badge: "badge-warning",
                badgeText: "Processing",
              },
              {
                icon: "local_shipping",
                label: "Shipping",
                val: "Standard (3-5 days)",
                mono: false,
              },
              {
                icon: "payments",
                label: "Payment",
                badge: "badge-success",
                badgeText: "Confirmed",
              },
            ].map(({ icon, label, val, badge, badgeText, mono }) => (
              <div
                key={label}
                className="flex items-center justify-between px-6 py-3.5"
              >
                <div className="flex items-center gap-2.5 text-sm text-onyx/55">
                  <span className="material-symbols-outlined text-[17px] text-oceanic">
                    {icon}
                  </span>
                  {label}
                </div>
                {badge ? (
                  <span
                    className={`${badge} badge`}
                    style={{ fontSize: "11px" }}
                  >
                    {badgeText}
                  </span>
                ) : (
                  <span
                    className={`text-sm font-semibold text-onyx ${mono ? "font-mono" : ""}`}
                  >
                    {val}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div
          className="bg-white rounded-3xl p-6 mb-5"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
          }}
        >
          <h3
            className="font-bold text-onyx text-sm mb-4 flex items-center gap-2"
            style={{ fontFamily: '"Roboto Slab",sans-serif' }}
          >
            <span className="material-symbols-outlined text-oceanic text-[18px]">
              timeline
            </span>
            What happens next?
          </h3>
          <div className="space-y-3">
            {NEXT_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: step.done ? "#dcfce7" : "#F5EBD8",
                    border: `1px solid ${step.done ? "#bbf7d0" : "#E2D5C0"}`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{
                      color: step.done ? "#16a34a" : "#6B7D8A",
                      fontVariationSettings: step.done
                        ? "'FILL' 1"
                        : "'FILL' 0",
                    }}
                  >
                    {step.done ? "check_circle" : step.icon}
                  </span>
                </div>
                <p
                  className={`text-sm ${step.done ? "text-onyx font-medium" : "text-onyx/55"}`}
                >
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/orders"
            className="btn-secondary flex-1 justify-center h-12 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              receipt_long
            </span>
            Track My Order
          </Link>
          <Link
            href="/shop"
            className="btn-primary flex-1 justify-center h-12 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              storefront
            </span>
            Continue Shopping
          </Link>
        </div>

        {/* Invoice link */}
        <p className="text-center text-xs text-onyx/35 mt-5">
          Need a receipt?{" "}
          <Link
            href={`/orders/${orderNum}/invoice`}
            className="text-oceanic font-semibold hover:underline"
          >
            Download invoice
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-wheat">
          <span className="material-symbols-outlined text-4xl text-oceanic/30 animate-spin-smooth">
            progress_activity
          </span>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
