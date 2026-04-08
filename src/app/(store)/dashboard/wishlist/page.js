"use client";
// ============================================================
// DASHBOARD WISHLIST — src/app/(store)/dashboard/wishlist/page.js
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, getDiscountPercent } from "@/lib/utils";

const INITIAL = [
  {
    id: 1,
    name: "Apple AirPods Pro (2nd Gen)",
    category: "Electronics",
    price: 249.0,
    sale: null,
    img: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=300&q=80",
    in_stock: true,
    rating: 4.7,
  },
  {
    id: 2,
    name: "Oversized Merino Wool Hoodie",
    category: "Fashion",
    price: 129.0,
    sale: null,
    img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&q=80",
    in_stock: true,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Ergonomic Mesh Office Chair",
    category: "Home",
    price: 399.0,
    sale: 299.0,
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
    in_stock: false,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Next.js 14 SaaS Boilerplate",
    category: "Digital",
    price: 299.0,
    sale: 199.0,
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80",
    in_stock: true,
    rating: 4.8,
  },
  {
    id: 5,
    name: "Yoga Mat Pro — 6mm",
    category: "Sports",
    price: 64.99,
    sale: 49.99,
    img: "https://images.unsplash.com/photo-1601925228270-3f3958f70bfd?w=300&q=80",
    in_stock: true,
    rating: 4.9,
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-xs ${i <= Math.round(count) ? "text-nectarine-dark star-filled" : "text-onyx/15"}`}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function WishlistPage() {
  const [items, setItems] = useState(INITIAL);
  const [adding, setAdding] = useState(null);

  function remove(id) {
    setItems((list) => list.filter((i) => i.id !== id));
  }

  async function addToCart(item) {
    setAdding(item.id);
    await new Promise((r) => setTimeout(r, 600));
    try {
      const cart = JSON.parse(localStorage.getItem("vexon_cart") || "[]");
      const ex = cart.find((i) => i.id === item.id);
      if (ex) ex.qty = (ex.qty || 1) + 1;
      else
        cart.push({
          id: item.id,
          name: item.name,
          price: item.sale || item.price,
          qty: 1,
          img: item.img,
          category: item.category,
        });
      localStorage.setItem("vexon_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    setAdding(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-black text-onyx tracking-tight"
            style={{
              fontFamily: '"Roboto Slab",sans-serif',
              letterSpacing: "-0.025em",
            }}
          >
            Wishlist
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            {items.length} saved item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => {
              items.forEach((i) => {
                if (i.in_stock) addToCart(i);
              });
            }}
            className="btn-secondary text-sm h-9 px-4 gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              add_shopping_cart
            </span>
            Add All to Cart
          </button>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div
          className="bg-white rounded-3xl py-24 text-center"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
          }}
        >
          <div
            className="w-20 h-20 rounded-3xl bg-wheat flex items-center justify-center mx-auto mb-5"
            style={{ border: "1px solid #EDE3D2" }}
          >
            <span className="material-symbols-outlined text-4xl text-onyx/20">
              favorite
            </span>
          </div>
          <h3
            className="font-bold text-onyx/40 text-lg mb-1"
            style={{ fontFamily: '"Roboto Slab",sans-serif' }}
          >
            Your wishlist is empty
          </h3>
          <p className="text-sm text-onyx/30 mb-6">
            Save products you love by tapping the heart icon
          </p>
          <Link href="/shop" className="btn-primary text-sm">
            <span className="material-symbols-outlined text-[18px]">
              storefront
            </span>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const price = item.sale || item.price;
            const discount = item.sale
              ? getDiscountPercent(item.price, item.sale)
              : 0;
            const isAdding = adding === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden flex gap-4 p-4 group transition-all duration-200"
                style={{
                  border: "1px solid #EDE3D2",
                  boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(10,23,29,0.10)";
                  e.currentTarget.style.borderColor = "#C8B89A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(10,23,29,0.05)";
                  e.currentTarget.style.borderColor = "#EDE3D2";
                }}
              >
                {/* Image */}
                <div
                  className="w-24 h-24 rounded-2xl overflow-hidden shrink-0"
                  style={{ border: "1px solid #EDE3D2" }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-oceanic/60 uppercase tracking-[0.08em] mb-0.5">
                      {item.category}
                    </p>
                    <Link
                      href={`/products/${item.id}`}
                      className="font-semibold text-onyx text-sm leading-snug line-clamp-2 hover:text-oceanic transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Stars count={item.rating} />
                      <span className="text-[11px] text-onyx/35">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-oceanic tabular-nums">
                        {formatCurrency(price)}
                      </span>
                      {item.sale && (
                        <span className="text-xs text-onyx/30 line-through">
                          {formatCurrency(item.price)}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-600">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.in_stock || isAdding}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200"
                        style={{
                          background: !item.in_stock
                            ? "#F5EBD8"
                            : isAdding
                              ? "#dcfce7"
                              : "#003F47",
                          color: !item.in_stock
                            ? "#9AAAB5"
                            : isAdding
                              ? "#16a34a"
                              : "#FFF6E9",
                          cursor: !item.in_stock ? "not-allowed" : "pointer",
                        }}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isAdding
                            ? "check"
                            : !item.in_stock
                              ? "block"
                              : "add_shopping_cart"}
                        </span>
                        {isAdding
                          ? "Added"
                          : !item.in_stock
                            ? "Out of Stock"
                            : "Add"}
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 text-onyx/25 hover:text-red-500 hover:bg-red-50"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
