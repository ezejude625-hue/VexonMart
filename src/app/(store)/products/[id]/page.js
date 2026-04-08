"use client";
// ============================================================
// PRODUCT DETAIL — src/app/(store)/products/[id]/page.js
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, getDiscountPercent } from "@/lib/utils";

const PRODUCT = {
  id: 1,
  name: "Sony WH-1000XM5 Wireless Headphones",
  category: "Electronics",
  price: 349.99,
  sale_price: 279.99,
  rating: 4.8,
  reviews: 2341,
  total_sales: 5820,
  stock: 34,
  in_stock: true,
  description:
    "Industry-leading noise cancellation with the Integrated Processor V1. Experience crystal-clear hands-free calling with 8 microphones optimised by AI. Up to 30-hour battery life with quick charging — 3 hours of use from just 3 minutes of charge.",
  features: [
    "Industry-leading noise cancellation",
    "30-hour battery + quick charge",
    "8 AI-powered microphones",
    "Multipoint Bluetooth connection",
    "Precision Touch sensor controls",
    "Lightweight 250g foldable design",
  ],
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=85",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=85",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=700&q=85",
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=700&q=85",
  ],
  seller: {
    name: "TechZone Official",
    rating: 4.9,
    sales: 12400,
    since: "2021",
  },
  tags: ["headphones", "wireless", "noise-cancelling", "sony", "bluetooth"],
};

const REVIEWS = [
  {
    id: 1,
    user: "Amara O.",
    rating: 5,
    date: "Feb 15, 2024",
    title: "Best headphones I have ever owned",
    body: "The noise cancellation is phenomenal. I use these on my daily commute and they are life-changing. Worth every single penny.",
  },
  {
    id: 2,
    user: "Lucas F.",
    rating: 5,
    date: "Jan 28, 2024",
    title: "Worth every penny",
    body: "Sound quality is incredible and the battery life lives up to the hype. Extremely comfortable for long work sessions.",
  },
  {
    id: 3,
    user: "Priya M.",
    rating: 4,
    date: "Jan 10, 2024",
    title: "Great, minor nitpick on controls",
    body: "Love the sound and comfort. The touch controls are occasionally a little too sensitive, but a very minor complaint.",
  },
];

function Stars({ count, size = "base" }) {
  const sz = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" }[
    size
  ];
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined ${sz} ${i <= Math.round(count) ? "text-nectarine-dark star-filled" : "text-onyx/15"}`}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [tab, setTab] = useState("description");

  const discount = getDiscountPercent(PRODUCT.price, PRODUCT.sale_price);
  const price = PRODUCT.sale_price;

  function addToCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("vexon_cart") || "[]");
      const existing = cart.find((i) => i.id === PRODUCT.id);
      if (existing) existing.qty = (existing.qty || 1) + qty;
      else
        cart.push({
          id: PRODUCT.id,
          name: PRODUCT.name,
          price,
          qty,
          img: PRODUCT.images[0],
          category: PRODUCT.category,
        });
      localStorage.setItem("vexon_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="min-h-screen bg-wheat">
      {/* Breadcrumb */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-1.5 text-sm text-onyx/40 flex-wrap">
          {[
            { l: "Home", h: "/" },
            { l: "Shop", h: "/shop" },
            {
              l: PRODUCT.category,
              h: `/shop?category=${PRODUCT.category.toLowerCase()}`,
            },
          ].map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="material-symbols-outlined text-[14px] text-onyx/20">
                  chevron_right
                </span>
              )}
              <Link href={b.h} className="hover:text-oceanic transition-colors">
                {b.l}
              </Link>
            </span>
          ))}
          <span className="material-symbols-outlined text-[14px] text-onyx/20">
            chevron_right
          </span>
          <span className="text-onyx font-medium truncate max-w-[180px]">
            {PRODUCT.name}
          </span>
        </nav>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image gallery */}
          <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            {/* Main image */}
            <div
              className="relative overflow-hidden rounded-3xl bg-white"
              style={{
                aspectRatio: "1/1",
                border: "1px solid #EDE3D2",
                boxShadow: "0 4px 24px rgba(10,23,29,0.08)",
              }}
            >
              <img
                src={PRODUCT.images[activeImg]}
                alt={PRODUCT.name}
                className="w-full h-full object-cover transition-all duration-500"
                loading="eager"
              />
              {/* Discount badge on image */}
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-black bg-red-500 text-white"
                    style={{ boxShadow: "0 4px 12px rgba(239,68,68,0.4)" }}
                  >
                    -{discount}% OFF
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnail grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {PRODUCT.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="relative aspect-square rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    border: `2px solid ${activeImg === i ? "#003F47" : "#EDE3D2"}`,
                    boxShadow:
                      activeImg === i ? "0 0 0 3px rgba(0,63,71,0.15)" : "",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {activeImg === i && (
                    <div className="absolute inset-0 bg-oceanic/10" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-5">
            {/* Category tag */}
            <div className="inline-flex items-center gap-1.5 bg-oceanic/8 text-oceanic px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.08em]">
              <span className="material-symbols-outlined text-[14px]">
                devices
              </span>
              {PRODUCT.category}
            </div>

            {/* Name */}
            <h1
              className="text-onyx leading-tight"
              style={{
                fontFamily: '"Roboto Slab",sans-serif',
                fontWeight: 800,
                fontSize: "clamp(1.5rem,3vw,2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              {PRODUCT.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Stars count={PRODUCT.rating} size="sm" />
                <span className="text-sm font-bold text-onyx">
                  {PRODUCT.rating}
                </span>
                <span className="text-sm text-onyx/40">
                  ({PRODUCT.reviews.toLocaleString()} reviews)
                </span>
              </div>
              <div className="w-px h-4 bg-onyx/15 hidden sm:block" />
              <span className="text-sm text-onyx/40">
                {PRODUCT.total_sales.toLocaleString()} sold
              </span>
            </div>

            {/* Price block */}
            <div
              className="flex items-baseline gap-4 py-5 border-t border-b"
              style={{ borderColor: "#EDE3D2" }}
            >
              <span
                className="text-4xl font-black text-oceanic tabular-nums"
                style={{ fontFamily: '"Roboto Slab",sans-serif' }}
              >
                {formatCurrency(price)}
              </span>
              {PRODUCT.sale_price && (
                <>
                  <span className="text-xl text-onyx/30 line-through tabular-nums">
                    {formatCurrency(PRODUCT.price)}
                  </span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200">
                    <span className="material-symbols-outlined text-red-500 text-[14px]">
                      local_offer
                    </span>
                    <span className="text-red-600 text-xs font-black">
                      Save {formatCurrency(PRODUCT.price - PRODUCT.sale_price)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Stock indicator */}
            <div
              className={`flex items-center gap-2 text-sm font-semibold ${PRODUCT.in_stock ? "text-emerald-600" : "text-red-500"}`}
            >
              <div className="relative">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{
                    background: PRODUCT.in_stock ? "#22c55e" : "#ef4444",
                  }}
                />
                {PRODUCT.in_stock && (
                  <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
                )}
              </div>
              {PRODUCT.in_stock
                ? `In stock — ${PRODUCT.stock} units remaining`
                : "Out of stock"}
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ border: "1.5px solid #E2D5C0" }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-11 h-12 flex items-center justify-center text-onyx/50 hover:text-onyx hover:bg-wheat-dark transition-all duration-150"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    remove
                  </span>
                </button>
                <span className="w-12 text-center font-bold text-onyx text-base tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(PRODUCT.stock, q + 1))}
                  className="w-11 h-12 flex items-center justify-center text-onyx/50 hover:text-onyx hover:bg-wheat-dark transition-all duration-150"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={addToCart}
                disabled={!PRODUCT.in_stock}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2.5 text-sm font-bold transition-all duration-300 ${added ? "bg-emerald-500 text-white" : "btn-primary"}`}
                style={{
                  boxShadow: added ? "0 4px 20px rgba(34,197,94,0.4)" : "",
                }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {added ? "check_circle" : "add_shopping_cart"}
                </span>
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  border: `1.5px solid ${wishlisted ? "#fca5a5" : "#E2D5C0"}`,
                  background: wishlisted ? "#fee2e2" : "#fff",
                  color: wishlisted ? "#ef4444" : "#9AAAB5",
                }}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${wishlisted ? "star-filled" : ""}`}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  icon: "verified_user",
                  label: "Secure",
                  sub: "SSL protected",
                },
                {
                  icon: "local_shipping",
                  label: "Fast",
                  sub: "Express delivery",
                },
                { icon: "replay", label: "Returns", sub: "30-day policy" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center"
                  style={{ background: "#F5EBD8", border: "1px solid #E2D5C0" }}
                >
                  <span className="material-symbols-outlined text-oceanic text-xl">
                    {b.icon}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-onyx">{b.label}</p>
                    <p className="text-[10px] text-onyx/40">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seller card */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "#F5EBD8", border: "1px solid #E2D5C0" }}
            >
              <div className="w-11 h-11 rounded-xl bg-oceanic/12 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-oceanic text-xl">
                  storefront
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-onyx text-sm">
                  {PRODUCT.seller.name}
                </p>
                <p className="text-xs text-onyx/45 mt-0.5">
                  {PRODUCT.seller.rating}★ ·{" "}
                  {PRODUCT.seller.sales.toLocaleString()} total sales · Since{" "}
                  {PRODUCT.seller.since}
                </p>
              </div>
              <Link
                href="#"
                className="text-xs font-semibold text-oceanic hover:underline shrink-0"
              >
                Visit store →
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div
          className="bg-white rounded-3xl overflow-hidden"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 16px rgba(10,23,29,0.06)",
          }}
        >
          {/* Tab bar */}
          <div className="flex border-b" style={{ borderColor: "#EDE3D2" }}>
            {[
              { key: "description", label: "Description", icon: "description" },
              { key: "features", label: "Features", icon: "checklist" },
              {
                key: "reviews",
                label: `Reviews (${PRODUCT.reviews.toLocaleString()})`,
                icon: "rate_review",
              },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-200 border-b-2"
                style={{
                  borderColor: tab === t.key ? "#003F47" : "transparent",
                  color: tab === t.key ? "#003F47" : "#6B7D8A",
                  background:
                    tab === t.key ? "rgba(0,63,71,0.04)" : "transparent",
                }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {t.icon}
                </span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6 md:p-8">
            {tab === "description" && (
              <p className="text-onyx/65 leading-relaxed text-base max-w-2xl">
                {PRODUCT.description}
              </p>
            )}
            {tab === "features" && (
              <ul className="space-y-3 max-w-lg">
                {PRODUCT.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-emerald-600 text-[14px] material-symbols-filled">
                        check
                      </span>
                    </div>
                    <span className="text-onyx/75 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            )}
            {tab === "reviews" && (
              <div>
                {/* Rating summary */}
                <div
                  className="flex items-center gap-8 mb-8 pb-8 border-b"
                  style={{ borderColor: "#EDE3D2" }}
                >
                  <div className="text-center">
                    <p
                      className="text-7xl font-black text-onyx tabular-nums"
                      style={{
                        fontFamily: '"Roboto Slab",sans-serif',
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {PRODUCT.rating}
                    </p>
                    <Stars count={PRODUCT.rating} size="base" />
                    <p className="text-xs text-onyx/40 mt-1">
                      {PRODUCT.reviews.toLocaleString()} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-2 max-w-xs">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <div
                        key={n}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <span className="w-3 text-onyx/40 text-right text-xs">
                          {n}
                        </span>
                        <span className="material-symbols-outlined text-nectarine-dark text-sm star-filled">
                          star
                        </span>
                        <div
                          className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ background: "#EDE3D2" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${n === 5 ? 70 : n === 4 ? 20 : n === 3 ? 7 : 2}%`,
                              background: "#FFBD76",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Individual reviews */}
                <div className="space-y-6">
                  {REVIEWS.map((r) => (
                    <div
                      key={r.id}
                      className="pb-6 border-b last:border-0 last:pb-0"
                      style={{ borderColor: "#F2EAE0" }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-oceanic/10 flex items-center justify-center font-bold text-oceanic text-sm shrink-0">
                          {r.user.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-onyx text-sm">
                              {r.user}
                            </p>
                            <span className="text-xs text-onyx/35">
                              {r.date}
                            </span>
                          </div>
                          <Stars count={r.rating} size="xs" />
                        </div>
                      </div>
                      <p className="font-semibold text-onyx text-sm mb-1">
                        {r.title}
                      </p>
                      <p className="text-sm text-onyx/60 leading-relaxed">
                        {r.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
