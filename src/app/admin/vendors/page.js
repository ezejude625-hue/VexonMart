"use client";
// ============================================================
// ADMIN VENDORS — src/app/admin/vendors/page.js
// ============================================================

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

const VENDORS = [
  {
    id: 1,
    name: "TechZone Official",
    email: "vendor@techzone.io",
    avatar: "T",
    color: "#003F47",
    joined: "2023-09-01",
    products: 48,
    sales: 12400,
    revenue: 342800,
    rating: 4.9,
    status: "active",
    verified: true,
    payout: "bank_transfer",
  },
  {
    id: 2,
    name: "Fashion Forward Co.",
    email: "hello@fashionfwd.com",
    avatar: "F",
    color: "#ec4899",
    joined: "2023-10-15",
    products: 134,
    sales: 3820,
    revenue: 91200,
    rating: 4.7,
    status: "active",
    verified: true,
    payout: "paypal",
  },
  {
    id: 3,
    name: "HomeStyle Decor",
    email: "info@homestyle.co",
    avatar: "H",
    color: "#E8A355",
    joined: "2023-11-20",
    products: 62,
    sales: 2100,
    revenue: 62400,
    rating: 4.5,
    status: "active",
    verified: false,
    payout: "stripe",
  },
  {
    id: 4,
    name: "Digital Creators Hub",
    email: "sell@digitalcr.io",
    avatar: "D",
    color: "#7C3AED",
    joined: "2024-01-08",
    products: 24,
    sales: 8900,
    revenue: 214000,
    rating: 4.8,
    status: "active",
    verified: true,
    payout: "bank_transfer",
  },
  {
    id: 5,
    name: "SportsGear Pro",
    email: "pro@sportsgear.net",
    avatar: "S",
    color: "#059669",
    joined: "2024-02-14",
    products: 38,
    sales: 1240,
    revenue: 34900,
    rating: 4.6,
    status: "pending",
    verified: false,
    payout: "pending",
  },
  {
    id: 6,
    name: "Beauty Essentials",
    email: "team@beautyess.com",
    avatar: "B",
    color: "#ef4444",
    joined: "2023-12-05",
    products: 19,
    sales: 980,
    revenue: 28200,
    rating: 4.4,
    status: "suspended",
    verified: false,
    payout: "stripe",
  },
];

const STATUS_STYLES = {
  active: { badge: "badge-success", dot: "#22c55e", label: "Active" },
  pending: { badge: "badge-warning", dot: "#f59e0b", label: "Pending" },
  suspended: { badge: "badge-error", dot: "#ef4444", label: "Suspended" },
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState(VENDORS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = vendors.filter(
    (v) =>
      (filter === "all" || v.status === filter) &&
      (!search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase())),
  );

  function changeStatus(id, status) {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
  }

  const totalRevenue = vendors
    .filter((v) => v.status === "active")
    .reduce((s, v) => s + v.revenue, 0);
  const activeCount = vendors.filter((v) => v.status === "active").length;
  const pendingCount = vendors.filter((v) => v.status === "pending").length;

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
            Vendors
          </h1>
          <p className="text-sm text-onyx/45 mt-0.5">
            <span className="text-emerald-600 font-semibold">
              {activeCount} active
            </span>
            {pendingCount > 0 && (
              <span className="text-amber-500 font-semibold ml-2">
                · {pendingCount} pending approval
              </span>
            )}
          </p>
        </div>
        <button className="btn-primary text-sm gap-2 h-10">
          <span className="material-symbols-outlined text-[16px]">
            person_add
          </span>
          Invite Vendor
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            l: "Total Vendors",
            v: vendors.length,
            i: "storefront",
            c: "#003F47",
          },
          {
            l: "Active Vendors",
            v: activeCount,
            i: "check_circle",
            c: "#22c55e",
          },
          {
            l: "Vendor Revenue",
            v: formatCurrency(totalRevenue),
            i: "payments",
            c: "#E8A355",
          },
          {
            l: "Avg Rating",
            v: `${(vendors.reduce((s, v) => s + v.rating, 0) / vendors.length).toFixed(1)}★`,
            i: "star",
            c: "#7C3AED",
          },
        ].map((k) => (
          <div
            key={k.l}
            className="bg-white rounded-2xl p-4"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${k.c}12` }}
            >
              <span
                className="material-symbols-outlined text-[17px]"
                style={{ color: k.c, fontVariationSettings: "'FILL' 1" }}
              >
                {k.i}
              </span>
            </div>
            <p
              className="text-xl font-black text-onyx tabular-nums"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              {k.v}
            </p>
            <p className="text-[11px] text-onyx/40 font-semibold uppercase tracking-[0.06em] mt-0.5">
              {k.l}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-2xl p-4 flex flex-wrap gap-3"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
        }}
      >
        <div className="flex gap-1.5">
          {["all", "active", "pending", "suspended"].map((f) => (
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
        <div className="relative flex-1 min-w-[180px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onyx/30 text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors…"
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
      </div>

      {/* Vendor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((v) => {
          const s = STATUS_STYLES[v.status];
          return (
            <div
              key={v.id}
              className="bg-white rounded-2xl p-5 transition-all duration-200"
              style={{
                border: "1px solid #EDE3D2",
                boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(10,23,29,0.10)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 10px rgba(10,23,29,0.05)";
                e.currentTarget.style.transform = "";
              }}
            >
              {/* Vendor header */}
              <div
                className="flex items-start gap-3 mb-4 pb-4 border-b"
                style={{ borderColor: "#F2EAE0" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0"
                  style={{ background: `${v.color}14`, color: v.color }}
                >
                  {v.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <p className="font-bold text-onyx text-sm">{v.name}</p>
                    {v.verified && (
                      <span
                        className="material-symbols-outlined text-oceanic text-[14px] material-symbols-filled"
                        title="Verified"
                      >
                        verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-onyx/40">{v.email}</p>
                  <p className="text-[11px] text-onyx/30 mt-0.5">
                    Joined{" "}
                    {formatDate(v.joined, { month: "short", year: "numeric" })}
                  </p>
                </div>
                <span
                  className={`badge shrink-0 ${s.badge}`}
                  style={{ fontSize: "10px" }}
                >
                  {s.label}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { l: "Products", v: v.products },
                  { l: "Sales", v: v.sales.toLocaleString() },
                  { l: "Revenue", v: formatCurrency(v.revenue / 1000) + "k" },
                ].map((stat) => (
                  <div
                    key={stat.l}
                    className="text-center p-2.5 rounded-xl"
                    style={{ background: "#F5EBD8" }}
                  >
                    <p className="font-black text-onyx text-sm tabular-nums">
                      {stat.v}
                    </p>
                    <p className="text-[10px] text-onyx/40 font-semibold">
                      {stat.l}
                    </p>
                  </div>
                ))}
              </div>

              {/* Rating + payout */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-nectarine-dark text-[14px] material-symbols-filled">
                    star
                  </span>
                  <span className="font-bold text-onyx">{v.rating}</span>
                  <span className="text-onyx/35">rating</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-onyx/40">
                  <span className="material-symbols-outlined text-[13px]">
                    payment
                  </span>
                  <span className="capitalize">
                    {v.payout.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {v.status === "pending" && (
                  <button
                    onClick={() => changeStatus(v.id, "active")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-emerald-700 transition-all"
                    style={{
                      background: "#dcfce7",
                      border: "1px solid #bbf7d0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#22c55e";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#dcfce7";
                      e.currentTarget.style.color = "#166534";
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      check_circle
                    </span>
                    Approve
                  </button>
                )}
                {v.status === "active" && (
                  <button
                    onClick={() => changeStatus(v.id, "suspended")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: "#F5EBD8",
                      color: "#6B7D8A",
                      border: "1px solid #E2D5C0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                      e.currentTarget.style.color = "#991b1b";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#F5EBD8";
                      e.currentTarget.style.color = "#6B7D8A";
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      block
                    </span>
                    Suspend
                  </button>
                )}
                {v.status === "suspended" && (
                  <button
                    onClick={() => changeStatus(v.id, "active")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-emerald-700 transition-all"
                    style={{
                      background: "#dcfce7",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      lock_open
                    </span>
                    Reinstate
                  </button>
                )}
                <button className="w-9 h-9 flex items-center justify-center rounded-xl text-onyx/30 hover:text-oceanic hover:bg-oceanic/10 transition-all">
                  <span className="material-symbols-outlined text-[16px]">
                    open_in_new
                  </span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl text-onyx/30 hover:text-red-500 hover:bg-red-50 transition-all">
                  <span className="material-symbols-outlined text-[16px]">
                    delete
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
