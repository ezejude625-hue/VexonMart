"use client";
// ============================================================
// DASHBOARD ORDERS — src/app/(store)/dashboard/orders/page.js
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const ORDERS = [
  {
    id: "VXM-20240301-A3K9",
    date: "2024-03-01",
    total: 329.31,
    status: "delivered",
    items: 2,
    payment: "paid",
  },
  {
    id: "VXM-20240210-B7F2",
    date: "2024-02-10",
    total: 49.0,
    status: "delivered",
    items: 1,
    payment: "paid",
  },
  {
    id: "VXM-20240115-C1M4",
    date: "2024-01-15",
    total: 189.99,
    status: "delivered",
    items: 1,
    payment: "paid",
  },
  {
    id: "VXM-20231215-D9X1",
    date: "2023-12-15",
    total: 279.99,
    status: "refunded",
    items: 1,
    payment: "refunded",
  },
  {
    id: "VXM-20231110-E4W8",
    date: "2023-11-10",
    total: 59.5,
    status: "cancelled",
    items: 2,
    payment: "refunded",
  },
];

const STATUS_CONFIG = {
  delivered: {
    badge: "badge-success",
    dot: "#22c55e",
    icon: "check_circle",
    label: "Delivered",
  },
  processing: {
    badge: "badge-info",
    dot: "#0ea5e9",
    icon: "pending",
    label: "Processing",
  },
  shipped: {
    badge: "badge-warning",
    dot: "#f59e0b",
    icon: "local_shipping",
    label: "Shipped",
  },
  pending: {
    badge: "badge-neutral",
    dot: "#9ca3af",
    icon: "schedule",
    label: "Pending",
  },
  refunded: {
    badge: "badge-error",
    dot: "#ef4444",
    icon: "currency_exchange",
    label: "Refunded",
  },
  cancelled: {
    badge: "badge-error",
    dot: "#ef4444",
    icon: "cancel",
    label: "Cancelled",
  },
};

const FILTER_TABS = [
  "all",
  "delivered",
  "processing",
  "shipped",
  "pending",
  "refunded",
  "cancelled",
];

export default function DashboardOrdersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter((o) => {
    const matchF = filter === "all" || o.status === filter;
    const matchS = !search || o.id.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-black text-onyx tracking-tight"
            style={{
              fontFamily: '"Roboto Slab",sans-serif',
              letterSpacing: "-0.025em",
            }}
          >
            My Orders
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            {filtered.length} order{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link
          href="/shop"
          className="btn-primary text-sm h-9 px-4 gap-1.5 hidden sm:inline-flex"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Order
        </Link>
      </div>

      {/* Filter + search bar */}
      <div
        className="bg-white rounded-2xl p-4"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
        }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status chips */}
          <div className="flex flex-wrap gap-1.5">
            {FILTER_TABS.map((f) => (
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
                {f !== "all" && (
                  <span className="ml-1.5 opacity-60">
                    {ORDERS.filter((o) => o.status === f).length}
                  </span>
                )}
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
              placeholder="Search order ID…"
              className="w-full h-9 pl-9 pr-4 rounded-xl text-sm outline-none transition-all"
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
          </div>
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div
          className="bg-white rounded-2xl py-20 text-center"
          style={{ border: "1px solid #EDE3D2" }}
        >
          <span className="material-symbols-outlined text-6xl text-onyx/12 block mb-3">
            receipt_long
          </span>
          <p className="font-semibold text-onyx/35">No orders found</p>
          <p className="text-sm text-onyx/25 mt-1">Try adjusting your filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const s = STATUS_CONFIG[order.status];
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 transition-all duration-200"
                style={{
                  border: "1px solid #EDE3D2",
                  boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(10,23,29,0.10)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(10,23,29,0.05)";
                  e.currentTarget.style.transform = "";
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: order info */}
                  <div className="flex items-center gap-4">
                    {/* Status icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background: `${s.dot}14`,
                        border: `1px solid ${s.dot}25`,
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{
                          color: s.dot,
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        {s.icon}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-semibold text-sm text-onyx">
                          {order.id}
                        </span>
                        <span
                          className={`badge ${s.badge}`}
                          style={{ fontSize: "11px" }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-onyx/40 mt-0.5">
                        {formatDate(order.date)} · {order.items} item
                        {order.items !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Right: amount + actions */}
                  <div className="flex items-center gap-4 sm:shrink-0">
                    <span
                      className="font-black text-onyx tabular-nums text-lg"
                      style={{
                        fontFamily: '"Roboto Slab",sans-serif',
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatCurrency(order.total)}
                    </span>

                    <div className="flex gap-2">
                      {order.status === "delivered" && (
                        <button
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-oceanic transition-all duration-150"
                          style={{
                            background: "rgba(0,63,71,0.08)",
                            border: "1px solid rgba(0,63,71,0.15)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#003F47";
                            e.currentTarget.style.color = "#FFF6E9";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(0,63,71,0.08)";
                            e.currentTarget.style.color = "#003F47";
                          }}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            star
                          </span>
                          Review
                        </button>
                      )}
                      <Link
                        href={`/orders/${order.id}/invoice`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-onyx/55 hover:text-onyx transition-all duration-150"
                        style={{ border: "1px solid #E2D5C0" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#003F47";
                          e.currentTarget.style.background = "#F5EBD8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E2D5C0";
                          e.currentTarget.style.background = "";
                        }}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          receipt
                        </span>
                        Invoice
                      </Link>
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
