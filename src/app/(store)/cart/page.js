"use client";
// ============================================================
// CART PAGE — src/app/(store)/cart/page.js
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, applyCoupon } from "@/lib/utils";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ text: "", ok: false });
  const [applying, setApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vexon_cart");
      setItems(
        raw
          ? JSON.parse(raw)
          : [
              {
                id: 1,
                name: "Sony WH-1000XM5 Headphones",
                price: 279.99,
                qty: 1,
                img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
                category: "Electronics",
              },
              {
                id: 2,
                name: "Premium Leather Sneakers",
                price: 149.99,
                qty: 2,
                img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
                category: "Fashion",
              },
            ],
      );
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  function save(next) {
    setItems(next);
    localStorage.setItem("vexon_cart", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  }
  function updateQty(id, d) {
    save(
      items.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, (i.qty || 1) + d) } : i,
      ),
    );
  }
  function removeItem(id) {
    save(items.filter((i) => i.id !== id));
  }

  const subtotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + shipping + tax;

  async function applyCode() {
    if (!coupon.trim()) return;
    setApplying(true);
    setCouponMsg({ text: "", ok: false });
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: coupon.trim().toUpperCase(),
          cart_total: subtotal,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscount(data.data.discount_amount);
        setCouponMsg({
          text: `✓ Code applied — saving ${formatCurrency(data.data.discount_amount)}`,
          ok: true,
        });
      } else {
        setCouponMsg({
          text: data.message || "Invalid coupon code",
          ok: false,
        });
        setDiscount(0);
      }
    } catch {
      setCouponMsg({ text: "Could not apply coupon. Try again.", ok: false });
    } finally {
      setApplying(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-wheat">
        <span className="material-symbols-outlined text-4xl text-oceanic/30 animate-spin-smooth">
          progress_activity
        </span>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="min-h-screen bg-wheat flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mx-auto mb-6"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 4px 20px rgba(10,23,29,0.08)",
            }}
          >
            <span className="material-symbols-outlined text-5xl text-onyx/15">
              shopping_bag
            </span>
          </div>
          <h2
            className="text-2xl font-black text-onyx mb-2"
            style={{
              fontFamily: '"Roboto Slab",sans-serif',
              letterSpacing: "-0.025em",
            }}
          >
            Your cart is empty
          </h2>
          <p className="text-onyx/45 text-sm mb-8">
            Add products from the shop to get started
          </p>
          <Link href="/shop" className="btn-primary text-base px-8">
            <span className="material-symbols-outlined text-[18px]">
              storefront
            </span>
            Browse Products
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-wheat">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-black text-onyx tracking-tight"
              style={{
                fontFamily: '"Roboto Slab",sans-serif',
                letterSpacing: "-0.025em",
              }}
            >
              Your Cart
            </h1>
            <p className="text-onyx/45 text-sm mt-1">
              {items.reduce((s, i) => s + (i.qty || 1), 0)} item
              {items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-sm font-semibold text-oceanic hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4"
                style={{
                  border: "1px solid #EDE3D2",
                  boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
                }}
              >
                {/* Thumbnail */}
                <div
                  className="w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0"
                  style={{ border: "1px solid #EDE3D2" }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-oceanic/60 uppercase tracking-[0.08em]">
                    {item.category}
                  </p>
                  <p className="font-semibold text-onyx text-sm line-clamp-1 mt-0.5">
                    {item.name}
                  </p>
                  <p className="text-lg font-black text-oceanic mt-1 tabular-nums">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Qty stepper */}
                <div
                  className="flex items-center rounded-xl overflow-hidden shrink-0"
                  style={{ border: "1.5px solid #E2D5C0" }}
                >
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-9 h-9 flex items-center justify-center text-onyx/40 hover:text-onyx hover:bg-wheat-dark transition-all duration-150"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      remove
                    </span>
                  </button>
                  <span className="w-8 text-center font-bold text-onyx text-sm tabular-nums">
                    {item.qty || 1}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, +1)}
                    className="w-9 h-9 flex items-center justify-center text-onyx/40 hover:text-onyx hover:bg-wheat-dark transition-all duration-150"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                  </button>
                </div>

                {/* Line total + remove */}
                <div className="text-right shrink-0">
                  <p className="font-black text-onyx tabular-nums">
                    {formatCurrency(item.price * (item.qty || 1))}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-onyx/30 hover:text-red-500 transition-colors duration-150 mt-1 ml-auto"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      delete
                    </span>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Free shipping progress */}
            {shipping > 0 && (
              <div
                className="bg-white rounded-2xl p-4"
                style={{ border: "1px solid #EDE3D2" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-onyx">
                    <span className="material-symbols-outlined text-nectarine-dark text-[18px] align-middle mr-1">
                      local_shipping
                    </span>
                    Add{" "}
                    <span className="text-oceanic">
                      {formatCurrency(100 - subtotal)}
                    </span>{" "}
                    more for free shipping
                  </p>
                  <p className="text-xs text-onyx/40">
                    {Math.round((subtotal / 100) * 100)}%
                  </p>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "#EDE3D2" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / 100) * 100)}%`,
                      background: "linear-gradient(90deg,#003F47,#FFBD76)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{
                border: "1px solid #EDE3D2",
                boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
              }}
            >
              <h3 className="font-bold text-onyx text-sm mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-nectarine-dark text-[18px]">
                  local_offer
                </span>
                Coupon Code
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCode()}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 h-10 px-3.5 rounded-xl text-sm font-mono font-semibold uppercase outline-none transition-all"
                  style={{
                    background: "#F5EBD8",
                    border: "1.5px solid transparent",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#003F47";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,63,71,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "transparent";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  onClick={applyCode}
                  disabled={applying || !coupon.trim()}
                  className="btn-secondary h-10 px-4 text-xs shrink-0"
                >
                  {applying ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin-smooth">
                      progress_activity
                    </span>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
              {couponMsg.text && (
                <p
                  className={`text-xs mt-2 font-medium flex items-center gap-1 ${couponMsg.ok ? "text-emerald-600" : "text-red-500"}`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {couponMsg.ok ? "check_circle" : "error"}
                  </span>
                  {couponMsg.text}
                </p>
              )}
              <p className="text-[11px] text-onyx/35 mt-2">
                Try: WELCOME10 · SAVE20 · FLAT15
              </p>
            </div>

            {/* Totals */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{
                border: "1px solid #EDE3D2",
                boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
              }}
            >
              <h3
                className="font-bold text-onyx mb-4"
                style={{ fontFamily: '"Roboto Slab",sans-serif' }}
              >
                Order Summary
              </h3>

              <div className="space-y-3">
                {[
                  { label: "Subtotal", value: formatCurrency(subtotal) },
                  {
                    label: "Discount",
                    value: discount > 0 ? `-${formatCurrency(discount)}` : "—",
                    green: discount > 0,
                  },
                  {
                    label: "Shipping",
                    value: shipping === 0 ? "FREE" : formatCurrency(shipping),
                    green: shipping === 0,
                  },
                  { label: "Tax (7.5%)", value: formatCurrency(tax) },
                ].map(({ label, value, green }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-onyx/55">{label}</span>
                    <span
                      className={`text-sm font-semibold ${green ? "text-emerald-600" : "text-onyx"}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div
                  className="flex justify-between items-center pt-3 border-t"
                  style={{ borderColor: "#EDE3D2" }}
                >
                  <span className="font-bold text-onyx">Total</span>
                  <span
                    className="text-2xl font-black text-onyx tabular-nums"
                    style={{
                      fontFamily: '"Roboto Slab",sans-serif',
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full justify-center h-13 text-base mt-5 rounded-xl"
                style={{
                  height: "52px",
                  boxShadow: "0 6px 24px rgba(255,189,118,0.45)",
                }}
              >
                <span className="material-symbols-outlined text-[20px]">
                  lock
                </span>
                Secure Checkout
              </Link>

              {/* Payment icons */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="material-symbols-outlined text-onyx/20 text-[16px]">
                  credit_card
                </span>
                <p className="text-[11px] text-onyx/30 font-medium">
                  Visa · Mastercard · PayPal · Stripe
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: "verified_user", label: "Secure" },
                { icon: "local_shipping", label: "Fast Ship" },
                { icon: "replay", label: "Returns" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="bg-white rounded-xl p-3 text-center"
                  style={{ border: "1px solid #EDE3D2" }}
                >
                  <span className="material-symbols-outlined text-oceanic text-xl block mb-1">
                    {b.icon}
                  </span>
                  <p className="text-[10px] text-onyx/50 font-semibold uppercase tracking-[0.06em]">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
