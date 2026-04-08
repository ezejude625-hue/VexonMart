"use client";
// ============================================================
// ADMIN ORDERS — src/app/admin/orders/page.js
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const ORDERS = [
  {
    id: "VXM-20240301-A3K9",
    customer: "Amara Osei",
    avatar: "A",
    email: "amara@example.com",
    total: 279.99,
    status: "delivered",
    payment: "paid",
    date: "2024-03-01",
    items: 1,
  },
  {
    id: "VXM-20240301-B7F2",
    customer: "Lucas Ferreira",
    avatar: "L",
    email: "lucas@example.com",
    total: 149.98,
    status: "processing",
    payment: "paid",
    date: "2024-03-01",
    items: 2,
  },
  {
    id: "VXM-20240228-C1M4",
    customer: "Priya Mehta",
    avatar: "P",
    email: "priya@example.com",
    total: 49.99,
    status: "shipped",
    payment: "paid",
    date: "2024-02-28",
    items: 1,
  },
  {
    id: "VXM-20240228-D9X1",
    customer: "James Carter",
    avatar: "J",
    email: "james@example.com",
    total: 629.97,
    status: "pending",
    payment: "unpaid",
    date: "2024-02-28",
    items: 3,
  },
  {
    id: "VXM-20240227-E4W8",
    customer: "Sofia Novak",
    avatar: "S",
    email: "sofia@example.com",
    total: 89.99,
    status: "cancelled",
    payment: "refunded",
    date: "2024-02-27",
    items: 1,
  },
  {
    id: "VXM-20240226-F3R5",
    customer: "Chen Wei",
    avatar: "C",
    email: "chen@example.com",
    total: 199.5,
    status: "delivered",
    payment: "paid",
    date: "2024-02-26",
    items: 2,
  },
  {
    id: "VXM-20240225-G8T1",
    customer: "Fatima Al-Amin",
    avatar: "F",
    email: "fatima@example.com",
    total: 344.0,
    status: "processing",
    payment: "paid",
    date: "2024-02-25",
    items: 4,
  },
];

const STATUS_STYLES = {
  delivered: { badge: "badge-success", dot: "#22c55e", label: "Delivered" },
  processing: { badge: "badge-info", dot: "#0ea5e9", label: "Processing" },
  shipped: { badge: "badge-warning", dot: "#f59e0b", label: "Shipped" },
  pending: { badge: "badge-neutral", dot: "#9ca3af", label: "Pending" },
  cancelled: { badge: "badge-error", dot: "#ef4444", label: "Cancelled" },
};

const AVATAR_COLORS = [
  "#003F47",
  "#7C3AED",
  "#E8A355",
  "#059669",
  "#0ea5e9",
  "#ec4899",
  "#6B7D8A",
];

const TABS = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter(
    (o) =>
      (status === "all" || o.status === status) &&
      (!search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase())),
  );

  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0);

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
            Orders
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            {filtered.length} orders · {formatCurrency(totalRevenue)} revenue
          </p>
        </div>
        <button className="btn-primary text-sm gap-2 h-10">
          <span className="material-symbols-outlined text-[16px]">
            download
          </span>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
        }}
      >
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setStatus(t)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-150"
              style={{
                background: status === t ? "#003F47" : "#F5EBD8",
                color: status === t ? "#FFF6E9" : "#6B7D8A",
                boxShadow: status === t ? "0 2px 8px rgba(0,63,71,0.25)" : "",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onyx/30 text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…"
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
                  "Order ID",
                  "Customer",
                  "Items",
                  "Date",
                  "Amount",
                  "Payment",
                  "Status",
                  "",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.06em] ${i === 7 ? "text-right" : "text-left"}`}
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
                  <td colSpan={8} className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl text-onyx/12 block mb-2">
                      receipt_long
                    </span>
                    <p className="text-onyx/35 font-semibold">
                      No orders found
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((o, idx) => {
                  const s = STATUS_STYLES[o.status];
                  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  return (
                    <tr
                      key={o.id}
                      className="transition-colors duration-150"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#FAF4EC")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "")
                      }
                    >
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-oceanic">
                        {o.id.slice(-8)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                            style={{
                              background: avatarColor + "15",
                              color: avatarColor,
                            }}
                          >
                            {o.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-onyx text-sm">
                              {o.customer}
                            </p>
                            <p className="text-[11px] text-onyx/35">
                              {o.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-onyx/55">{o.items}</td>
                      <td className="px-5 py-4 text-onyx/45 whitespace-nowrap text-sm">
                        {formatDate(o.date, { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-5 py-4 font-bold text-onyx tabular-nums">
                        {formatCurrency(o.total)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`badge capitalize ${o.payment === "paid" ? "badge-success" : o.payment === "refunded" ? "badge-error" : "badge-warning"}`}
                          style={{ fontSize: "11px" }}
                        >
                          {o.payment}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: s.dot }}
                          />
                          <span
                            className={`badge capitalize ${s.badge}`}
                            style={{ fontSize: "11px" }}
                          >
                            {s.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="text-xs font-bold text-oceanic hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div
          className="flex items-center justify-between px-5 py-3.5 border-t"
          style={{ borderColor: "#EDE3D2", background: "#FAF4EC" }}
        >
          <p className="text-xs text-onyx/40">
            Showing {filtered.length} of {ORDERS.length}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className="w-8 h-8 rounded-xl text-xs font-bold"
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
