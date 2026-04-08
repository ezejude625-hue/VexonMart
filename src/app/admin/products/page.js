"use client";
// ============================================================
// ADMIN PRODUCTS — src/app/admin/products/page.js
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    cat: "Electronics",
    price: 279.99,
    stock: 48,
    status: "active",
    sales: 820,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&q=80",
  },
  {
    id: 2,
    name: "Premium Leather Sneakers",
    cat: "Fashion",
    price: 149.99,
    stock: 85,
    status: "active",
    sales: 410,
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&q=80",
  },
  {
    id: 3,
    name: "Minimalist Arc Desk Lamp",
    cat: "Home",
    price: 89.99,
    stock: 33,
    status: "active",
    sales: 260,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=60&q=80",
  },
  {
    id: 4,
    name: "React 19 Mastery Course",
    cat: "Digital",
    price: 49.0,
    stock: -1,
    status: "active",
    sales: 4120,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=60&q=80",
  },
  {
    id: 5,
    name: "Yoga Mat Pro 6mm",
    cat: "Sports",
    price: 49.99,
    stock: 210,
    status: "active",
    sales: 1820,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1601925228270-3f3958f70bfd?w=60&q=80",
  },
  {
    id: 6,
    name: "Next.js 14 SaaS Boilerplate",
    cat: "Digital",
    price: 199.0,
    stock: -1,
    status: "draft",
    sales: 342,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=60&q=80",
  },
  {
    id: 7,
    name: "Apple AirPods Pro (2nd Gen)",
    cat: "Electronics",
    price: 249.0,
    stock: 62,
    status: "active",
    sales: 1540,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=60&q=80",
  },
  {
    id: 8,
    name: "Hydro Flask Water Bottle 32oz",
    cat: "Sports",
    price: 49.95,
    stock: 180,
    status: "active",
    sales: 5120,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=60&q=80",
  },
];

const STATUS_STYLE = {
  active: { badge: "badge-success", dot: "#22c55e" },
  draft: { badge: "badge-neutral", dot: "#9ca3af" },
  paused: { badge: "badge-warning", dot: "#f59e0b" },
  archived: { badge: "badge-error", dot: "#ef4444" },
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("id");

  const filtered = PRODUCTS.filter(
    (p) => filter === "all" || p.status === filter,
  )
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.cat.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === "price"
        ? b.price - a.price
        : sortBy === "sales"
          ? b.sales - a.sales
          : a.id - b.id,
    );

  const totalRevenue = filtered.reduce((s, p) => s + p.price * p.sales, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-black text-onyx"
            style={{
              fontFamily: '"Roboto Slab",sans-serif',
              letterSpacing: "-0.025em",
            }}
          >
            Products
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            {filtered.length} products · {formatCurrency(totalRevenue)} total
            revenue
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="btn-primary text-sm gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>Add
          Product
        </Link>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-2xl p-4 flex flex-wrap gap-3 items-center"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
        }}
      >
        {/* Status tabs */}
        <div className="flex flex-wrap gap-1.5">
          {["all", "active", "draft", "paused", "archived"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-150"
              style={{
                background: filter === f ? "#003F47" : "#F5EBD8",
                color: filter === f ? "#FFF6E9" : "#6B7D8A",
                boxShadow: filter === f ? "0 2px 8px rgba(0,63,71,0.25)" : "",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onyx/30 text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 pl-9 pr-4 rounded-xl text-sm outline-none"
            style={{ background: "#F5EBD8", border: "1.5px solid transparent" }}
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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-9 px-3 rounded-xl text-sm font-medium border outline-none cursor-pointer"
          style={{
            background: "#fff",
            borderColor: "#E2D5C0",
            color: "#3D5060",
          }}
        >
          <option value="id">Newest</option>
          <option value="sales">Most Sales</option>
          <option value="price">Highest Price</option>
        </select>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "#FAF4EC",
                  borderBottom: "1px solid #EDE3D2",
                }}
              >
                {[
                  "Product",
                  "Category",
                  "Price",
                  "Stock",
                  "Sales",
                  "Status",
                  "",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.06em] ${i === 6 ? "text-right" : "text-left"}`}
                    style={{ color: "#6B7D8A" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#F2EAE0" }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl text-onyx/12 block mb-2">
                      inventory_2
                    </span>
                    <p className="text-onyx/35 font-semibold">
                      No products found
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const s = STATUS_STYLE[p.status];
                  return (
                    <tr
                      key={p.id}
                      className="transition-colors duration-150"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#FAF4EC")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "")
                      }
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl overflow-hidden shrink-0"
                            style={{ border: "1px solid #EDE3D2" }}
                          >
                            <img
                              src={p.img}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-onyx text-sm line-clamp-1">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-onyx/40 mt-0.5">
                              SKU: PRD-{String(p.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-5 py-4 text-sm text-onyx/55">
                        {p.cat}
                      </td>
                      {/* Price */}
                      <td className="px-5 py-4 font-bold text-onyx tabular-nums">
                        {formatCurrency(p.price)}
                      </td>
                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-semibold tabular-nums ${p.stock === 0 ? "text-red-500" : p.stock === -1 ? "text-oceanic" : "text-onyx"}`}
                        >
                          {p.stock === -1
                            ? "∞"
                            : p.stock === 0
                              ? "Out"
                              : p.stock}
                        </span>
                      </td>
                      {/* Sales */}
                      <td className="px-5 py-4 text-sm text-onyx/55 tabular-nums">
                        {p.sales.toLocaleString()}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: s.dot }}
                          />
                          <span
                            className={`badge capitalize ${s.badge}`}
                            style={{ fontSize: "11px" }}
                          >
                            {p.status}
                          </span>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-xl text-onyx/30 hover:text-oceanic hover:bg-oceanic/10 transition-all duration-150"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              edit
                            </span>
                          </Link>
                          <button className="w-8 h-8 flex items-center justify-center rounded-xl text-onyx/30 hover:text-red-500 hover:bg-red-50 transition-all duration-150">
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-t"
          style={{ borderColor: "#EDE3D2", background: "#FAF4EC" }}
        >
          <p className="text-xs text-onyx/40">
            Showing {filtered.length} of {PRODUCTS.length} products
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className="w-8 h-8 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: n === 1 ? "#003F47" : "transparent",
                  color: n === 1 ? "#FFF6E9" : "#6B7D8A",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
