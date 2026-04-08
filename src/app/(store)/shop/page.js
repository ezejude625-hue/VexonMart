"use client";
// ============================================================
// SHOP PAGE — src/app/(store)/shop/page.js
// ============================================================

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, getDiscountPercent } from "@/lib/utils";

const CATEGORIES = [
  { slug: "all", label: "All Products", count: 1204, icon: "apps" },
  { slug: "electronics", label: "Electronics", count: 342, icon: "devices" },
  { slug: "fashion", label: "Fashion", count: 218, icon: "checkroom" },
  { slug: "home-living", label: "Home & Living", count: 167, icon: "chair" },
  { slug: "sports", label: "Sports", count: 89, icon: "sports" },
  { slug: "beauty", label: "Beauty", count: 96, icon: "spa" },
  { slug: "books", label: "Books", count: 134, icon: "menu_book" },
  {
    slug: "digital-goods",
    label: "Digital Goods",
    count: 158,
    icon: "download",
  },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low–High" },
  { value: "price_desc", label: "Price: High–Low" },
  { value: "rating", label: "Top Rated" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    cat: "electronics",
    price: 349.99,
    sale: 279.99,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    rating: 4.8,
    reviews: 1204,
    badge: "Sale",
  },
  {
    id: 2,
    name: "Premium Leather Sneakers",
    cat: "fashion",
    price: 189.99,
    sale: 149.99,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    rating: 4.6,
    reviews: 830,
    badge: "Sale",
  },
  {
    id: 3,
    name: "Minimalist Arc Desk Lamp",
    cat: "home-living",
    price: 89.99,
    sale: null,
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    rating: 4.7,
    reviews: 412,
    badge: null,
  },
  {
    id: 4,
    name: "React 19 Mastery Course",
    cat: "digital-goods",
    price: 149.0,
    sale: 49.0,
    img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&q=80",
    rating: 4.9,
    reviews: 3280,
    badge: "Hot Deal",
  },
  {
    id: 5,
    name: "Apple AirPods Pro (2nd Gen)",
    cat: "electronics",
    price: 249.0,
    sale: null,
    img: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=500&q=80",
    rating: 4.7,
    reviews: 3812,
    badge: "New",
  },
  {
    id: 6,
    name: "Next.js 14 SaaS Boilerplate",
    cat: "digital-goods",
    price: 299.0,
    sale: 199.0,
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80",
    rating: 4.8,
    reviews: 680,
    badge: "Sale",
  },
  {
    id: 7,
    name: "Yoga Mat Pro — 6mm",
    cat: "sports",
    price: 64.99,
    sale: 49.99,
    img: "https://images.unsplash.com/photo-1601925228270-3f3958f70bfd?w=500&q=80",
    rating: 4.9,
    reviews: 2100,
    badge: null,
  },
  {
    id: 8,
    name: "Oversized Merino Hoodie",
    cat: "fashion",
    price: 129.0,
    sale: null,
    img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80",
    rating: 4.9,
    reviews: 244,
    badge: "New",
  },
  {
    id: 9,
    name: "Hydro Flask 32oz",
    cat: "sports",
    price: 49.95,
    sale: null,
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    rating: 4.8,
    reviews: 5120,
    badge: null,
  },
  {
    id: 10,
    name: "The Pragmatic Programmer",
    cat: "books",
    price: 39.99,
    sale: 29.99,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    rating: 4.9,
    reviews: 8800,
    badge: "Sale",
  },
  {
    id: 11,
    name: "Glow Vitamin C Face Serum",
    cat: "beauty",
    price: 34.99,
    sale: null,
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
    rating: 4.6,
    reviews: 1640,
    badge: "New",
  },
  {
    id: 12,
    name: "Ergonomic Mesh Office Chair",
    cat: "home-living",
    price: 399.0,
    sale: 299.0,
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
    rating: 4.5,
    reviews: 720,
    badge: "Sale",
  },
];

const BADGE_STYLE = {
  Sale: "bg-red-500 text-white",
  "Hot Deal": "bg-nectarine text-onyx",
  New: "bg-emerald-500 text-white",
};

function StarRow({ count }) {
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-[13px] ${i <= Math.round(count) ? "text-nectarine-dark star-filled" : "text-onyx/15"}`}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function ShopPage() {
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(500);
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState("grid"); // 'grid' | 'list'

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => cat === "all" || p.cat === cat)
      .filter(
        (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((p) => (p.sale || p.price) <= maxPrice);
    switch (sort) {
      case "price_asc":
        return list.sort((a, b) => (a.sale || a.price) - (b.sale || b.price));
      case "price_desc":
        return list.sort((a, b) => (b.sale || b.price) - (a.sale || a.price));
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "popular":
        return list.sort((a, b) => b.reviews - a.reviews);
      default:
        return list.sort((a, b) => b.id - a.id);
    }
  }, [cat, sort, maxPrice, search]);

  function toggleWishlist(id) {
    setWishlist((w) =>
      w.includes(id) ? w.filter((i) => i !== id) : [...w, id],
    );
  }

  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <p className="text-[11px] font-bold text-onyx/35 uppercase tracking-[0.1em] mb-3">
          Categories
        </p>
        <div className="space-y-0.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150"
              style={{
                background: cat === c.slug ? "#003F47" : "transparent",
                color: cat === c.slug ? "#FFF6E9" : "#3D5060",
              }}
              onMouseEnter={(e) => {
                if (cat !== c.slug)
                  e.currentTarget.style.background = "#F5EBD8";
              }}
              onMouseLeave={(e) => {
                if (cat !== c.slug)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ color: cat === c.slug ? "#FFBD76" : undefined }}
              >
                {c.icon}
              </span>
              <span className="font-medium flex-1 text-left">{c.label}</span>
              <span className="text-[11px] font-semibold opacity-50">
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-onyx/35 uppercase tracking-[0.1em]">
            Max Price
          </p>
          <span className="text-sm font-bold text-oceanic">
            {formatCurrency(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: "#003F47" }}
        />
        <div className="flex justify-between text-[11px] text-onyx/30 font-medium mt-1.5">
          <span>$10</span>
          <span>$500</span>
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <p className="text-[11px] font-bold text-onyx/35 uppercase tracking-[0.1em] mb-3">
          Min Rating
        </p>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map((r) => (
            <button
              key={r}
              className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-xl text-sm text-onyx/55 hover:bg-wheat-dark hover:text-onyx transition-all"
            >
              <div className="flex gap-px">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`material-symbols-outlined text-xs ${i <= Math.round(r) ? "text-nectarine-dark star-filled" : "text-onyx/15"}`}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-medium">{r}+ stars</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {(cat !== "all" || maxPrice < 500 || search) && (
        <button
          onClick={() => {
            setCat("all");
            setMaxPrice(500);
            setSearch("");
          }}
          className="w-full py-2 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-all duration-150"
        >
          <span className="material-symbols-outlined text-[16px] align-middle mr-1">
            close
          </span>
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-wheat">
      {/* Page header */}
      <div className="bg-onyx py-12 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%,rgba(255,189,118,0.08) 0%,transparent 55%)",
          }}
        />
        <div className="relative">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-[0.12em] mb-2">
            {filtered.length.toLocaleString()} products available
          </p>
          <h1
            className="text-white"
            style={{
              fontFamily: '"Roboto Slab",sans-serif',
              fontWeight: 800,
              fontSize: "clamp(1.75rem,4vw,2.5rem)",
              letterSpacing: "-0.025em",
            }}
          >
            All Products
          </h1>
          <p className="text-white/40 text-sm mt-2">
            {cat !== "all"
              ? CATEGORIES.find((c) => c.slug === cat)?.label
              : "Browse our complete collection"}
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div
              className="bg-white rounded-2xl p-5 sticky top-24"
              style={{
                border: "1px solid #EDE3D2",
                boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
              }}
            >
              <p
                className="font-bold text-onyx mb-5"
                style={{ fontFamily: '"Roboto Slab",sans-serif' }}
              >
                Filters
              </p>
              <FilterPanel />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Controls bar */}
            <div
              className="flex flex-wrap items-center gap-3 mb-6 bg-white rounded-2xl px-4 py-3"
              style={{
                border: "1px solid #EDE3D2",
                boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
              }}
            >
              {/* Mobile filter button */}
              <button
                onClick={() => setFiltersOpen((s) => !s)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-onyx/60 border border-wheat-dark hover:bg-wheat transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>
                Filters
                {(cat !== "all" || maxPrice < 500) && (
                  <span className="w-2 h-2 rounded-full bg-oceanic inline-block" />
                )}
              </button>

              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onyx/30 text-[18px] pointer-events-none">
                  search
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full h-9 pl-9 pr-4 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#F5EBD8",
                    border: "1.5px solid transparent",
                    color: "#0A171D",
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
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 px-3 rounded-xl text-sm font-medium border outline-none cursor-pointer"
                style={{
                  background: "#fff",
                  borderColor: "#E2D5C0",
                  color: "#3D5060",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* View toggle */}
              <div className="flex border border-wheat-dark rounded-xl overflow-hidden shrink-0">
                {["grid", "list"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="w-9 h-9 flex items-center justify-center transition-all duration-150"
                    style={{
                      background: view === v ? "#003F47" : "transparent",
                      color: view === v ? "#FFF6E9" : "#9AAAB5",
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {v === "grid" ? "grid_view" : "list"}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-sm text-onyx/40 font-medium hidden sm:block ml-auto">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Mobile filter drawer */}
            {filtersOpen && (
              <div
                className="lg:hidden bg-white rounded-2xl p-5 mb-4 animate-scale-in"
                style={{
                  border: "1px solid #EDE3D2",
                  boxShadow: "0 4px 20px rgba(10,23,29,0.10)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="font-bold text-onyx"
                    style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                  >
                    Filters
                  </p>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-wheat text-onyx/40"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                </div>
                <FilterPanel />
              </div>
            )}

            {/* Products */}
            {filtered.length === 0 ? (
              <div
                className="text-center py-24 bg-white rounded-2xl"
                style={{ border: "1px solid #EDE3D2" }}
              >
                <span className="material-symbols-outlined text-6xl text-onyx/15 block mb-3">
                  search_off
                </span>
                <p className="font-bold text-onyx/35 text-base">
                  No products found
                </p>
                <p className="text-sm text-onyx/25 mt-1">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCat("all");
                    setMaxPrice(500);
                  }}
                  className="btn-secondary mt-5 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 stagger-grid">
                {filtered.map((p) => {
                  const eff = p.sale || p.price;
                  const disc = p.sale ? getDiscountPercent(p.price, p.sale) : 0;
                  const wl = wishlist.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl overflow-hidden flex flex-col group"
                      style={{
                        border: "1px solid #EDE3D2",
                        boxShadow: "0 2px 10px rgba(10,23,29,0.06)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 36px rgba(10,23,29,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 10px rgba(10,23,29,0.06)";
                      }}
                    >
                      {/* Image */}
                      <div
                        className="relative overflow-hidden bg-wheat-faint"
                        style={{ aspectRatio: "4/3" }}
                      >
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-onyx/30 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {p.badge && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${BADGE_STYLE[p.badge]}`}
                            >
                              {p.badge}
                            </span>
                          )}
                          {disc > 0 && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-onyx/80 text-white backdrop-blur-sm">
                              -{disc}%
                            </span>
                          )}
                        </div>
                        {/* Quick action */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex gap-1.5">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(p.id);
                            }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                            style={{
                              background: "rgba(255,255,255,0.9)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              color: wl ? "#ef4444" : "#6B7D8A",
                            }}
                          >
                            <span
                              className={`material-symbols-outlined text-[17px] ${wl ? "star-filled" : ""}`}
                            >
                              favorite
                            </span>
                          </button>
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                            style={{
                              background: "#FFBD76",
                              color: "#0A171D",
                              boxShadow: "0 4px 12px rgba(255,189,118,0.4)",
                            }}
                          >
                            <span className="material-symbols-outlined text-[17px]">
                              add_shopping_cart
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-[10px] font-bold text-oceanic/60 uppercase tracking-[0.08em] mb-1.5">
                          {p.cat.replace("-", " ")}
                        </p>
                        <Link
                          href={`/products/${p.id}`}
                          className="font-semibold text-onyx text-sm leading-snug line-clamp-2 flex-1 hover:text-oceanic transition-colors duration-200 mb-2.5"
                        >
                          {p.name}
                        </Link>
                        <div className="flex items-center gap-1.5 mb-3">
                          <StarRow count={p.rating} />
                          <span className="text-[11px] text-onyx/40 font-medium">
                            {p.rating} ({p.reviews.toLocaleString()})
                          </span>
                        </div>
                        <div
                          className="flex items-center justify-between pt-3 border-t"
                          style={{ borderColor: "#F2EAE0" }}
                        >
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-oceanic tabular-nums">
                              {formatCurrency(eff)}
                            </span>
                            {p.sale && (
                              <span className="text-xs text-onyx/30 line-through tabular-nums">
                                {formatCurrency(p.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List view */
              <div className="space-y-3">
                {filtered.map((p) => {
                  const eff = p.sale || p.price;
                  const disc = p.sale ? getDiscountPercent(p.price, p.sale) : 0;
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl overflow-hidden flex gap-4 p-4 group"
                      style={{
                        border: "1px solid #EDE3D2",
                        boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 6px 24px rgba(10,23,29,0.10)";
                        e.currentTarget.style.borderColor = "#C8B89A";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(10,23,29,0.05)";
                        e.currentTarget.style.borderColor = "#EDE3D2";
                      }}
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-wheat-faint shrink-0">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-oceanic/60 uppercase tracking-[0.08em] mb-0.5">
                            {p.cat.replace("-", " ")}
                          </p>
                          <Link
                            href={`/products/${p.id}`}
                            className="font-semibold text-onyx text-sm hover:text-oceanic transition-colors line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1">
                            <StarRow count={p.rating} />
                            <span className="text-[11px] text-onyx/40">
                              {p.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="font-black text-oceanic tabular-nums">
                              {formatCurrency(eff)}
                            </span>
                            {p.sale && (
                              <span className="text-xs text-onyx/30 line-through">
                                {formatCurrency(p.price)}
                              </span>
                            )}
                            {disc > 0 && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-600">
                                -{disc}%
                              </span>
                            )}
                          </div>
                          <button className="btn-primary text-xs px-3 py-1.5 h-auto gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              add
                            </span>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
