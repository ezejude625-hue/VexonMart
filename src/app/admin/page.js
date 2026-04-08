"use client";
// ============================================================
// ADMIN DASHBOARD — src/app/admin/page.js
// ============================================================
// Premium KPI cards with sparklines · revenue chart ·
// top products · recent orders table · all pixel-perfect
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const MOCK_STATS = {
  total_revenue: 148320.5,
  revenue_change: 12.4,
  total_orders: 1204,
  orders_change: 8.2,
  total_customers: 2841,
  customers_change: 5.7,
  total_products: 342,
};

const RECENT_ORDERS = [
  {
    id: "VXM-20240301-A3K9",
    customer: "Amara Osei",
    avatar: "A",
    total: 279.99,
    status: "delivered",
    date: "2024-03-01",
  },
  {
    id: "VXM-20240301-B7F2",
    customer: "Lucas Ferreira",
    avatar: "L",
    total: 149.98,
    status: "processing",
    date: "2024-03-01",
  },
  {
    id: "VXM-20240228-C1M4",
    customer: "Priya Mehta",
    avatar: "P",
    total: 49.99,
    status: "shipped",
    date: "2024-02-28",
  },
  {
    id: "VXM-20240228-D9X1",
    customer: "James Carter",
    avatar: "J",
    total: 629.97,
    status: "pending",
    date: "2024-02-28",
  },
  {
    id: "VXM-20240227-E4W8",
    customer: "Sofia Novak",
    avatar: "S",
    total: 89.99,
    status: "cancelled",
    date: "2024-02-27",
  },
];

const TOP_PRODUCTS = [
  { name: "React 19 Mastery Course", sales: 4120, revenue: 201880, pct: 92 },
  { name: "Sony WH-1000XM5 Headphones", sales: 820, revenue: 229592, pct: 78 },
  { name: "Next.js 14 SaaS Boilerplate", sales: 342, revenue: 68058, pct: 55 },
  { name: "Yoga Mat Pro 6mm", sales: 1820, revenue: 90962, pct: 48 },
  { name: "Apple AirPods Pro (2nd Gen)", sales: 614, revenue: 152886, pct: 40 },
];

const CHART = [
  { m: "Oct", r: 18400, o: 1120 },
  { m: "Nov", r: 22100, o: 1340 },
  { m: "Dec", r: 31500, o: 1980 },
  { m: "Jan", r: 19800, o: 1220 },
  { m: "Feb", r: 25600, o: 1560 },
  { m: "Mar", r: 31320, o: 1840 },
];

const STATUS_CONFIG = {
  delivered: {
    badge: "badge-success",
    dot: "bg-emerald-500",
    label: "Delivered",
  },
  processing: { badge: "badge-info", dot: "bg-sky-500", label: "Processing" },
  shipped: { badge: "badge-warning", dot: "bg-amber-500", label: "Shipped" },
  pending: { badge: "badge-neutral", dot: "bg-gray-400", label: "Pending" },
  cancelled: { badge: "badge-error", dot: "bg-red-500", label: "Cancelled" },
};

const maxR = Math.max(...CHART.map((c) => c.r));

// Mini sparkline bars for KPI cards
function Sparkline({ data, color = "#003F47" }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1 ? color : `${color}55`,
            minWidth: "4px",
          }}
        />
      ))}
    </div>
  );
}

// KPI stat card
function StatCard({
  icon,
  label,
  value,
  change,
  prefix = "",
  color = "oceanic",
  spark,
}) {
  const up = (change || 0) >= 0;
  const colorMap = {
    oceanic: { icon: "bg-oceanic/10 text-oceanic", spark: "#003F47" },
    nectarine: {
      icon: "bg-nectarine/20 text-nectarine-dark",
      spark: "#FFBD76",
    },
    emerald: { icon: "bg-emerald-100 text-emerald-600", spark: "#10b981" },
    sky: { icon: "bg-sky-100 text-sky-600", spark: "#0ea5e9" },
  };
  const c = colorMap[color] || colorMap.oceanic;

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[11.5px] font-semibold text-onyx/45 uppercase tracking-[0.07em]">
            {label}
          </p>
          <p
            className="text-[28px] font-black text-onyx mt-1.5 leading-none tabular"
            style={{ fontFamily: "'Roboto Slab',sans-serif" }}
          >
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div
          className={`w-11 h-11 rounded-[13px] flex items-center justify-center flex-shrink-0 ${c.icon}`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>

      {/* Sparkline */}
      {spark && <Sparkline data={spark} color={c.spark} />}

      {/* Change indicator */}
      {change !== undefined && (
        <div
          className={`flex items-center gap-1 mt-2 text-[12px] font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {up ? "trending_up" : "trending_down"}
          </span>
          {Math.abs(change)}% vs last month
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setStats(d.data);
      })
      .catch(() => {}); // Fall back to mock data gracefully
  }, []);

  return (
    <div className="space-y-7 max-w-[1200px]">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-[26px] font-black text-onyx tracking-[-0.02em]"
            style={{ fontFamily: "'Roboto Slab',sans-serif" }}
          >
            Dashboard
          </h1>
          <p className="text-[13.5px] text-onyx/45 mt-0.5">
            {formatDate(new Date(), {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost h-10 px-4 text-[13px]">
            <span className="material-symbols-outlined text-[16px]">
              download
            </span>
            Export
          </button>
          <Link
            href="/admin/products/create"
            className="btn-primary h-10 px-4 text-[13px]"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Product
          </Link>
        </div>
      </div>

      {/* ── KPI cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-grid">
        <StatCard
          icon="payments"
          label="Total Revenue"
          prefix="$"
          value={
            stats.total_revenue
              ? stats.total_revenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "148,320.50"
          }
          change={stats.revenue_change}
          color="oceanic"
          spark={[12, 18, 14, 22, 19, 25, 31]}
        />
        <StatCard
          icon="receipt_long"
          label="Total Orders"
          value={stats.total_orders || 1204}
          change={stats.orders_change}
          color="sky"
          spark={[800, 1100, 900, 1340, 1100, 1560, 1840]}
        />
        <StatCard
          icon="group"
          label="Customers"
          value={stats.total_customers || 2841}
          change={stats.customers_change}
          color="emerald"
          spark={[1200, 1500, 1350, 1800, 1600, 2100, 2841]}
        />
        <StatCard
          icon="inventory_2"
          label="Active Products"
          value={stats.total_products || 342}
          color="nectarine"
          spark={[260, 280, 295, 310, 320, 335, 342]}
        />
      </div>

      {/* ── Revenue Chart + Top Products ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Revenue bar chart */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-[#EDE3D2] shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-onyx text-[15px]">
                Revenue Overview
              </h2>
              <p className="text-onyx/40 text-[12.5px] mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-oceanic inline-block" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-nectarine inline-block" />
                Orders
              </span>
            </div>
          </div>

          {/* Bar chart — CSS-driven, no library needed */}
          <div className="flex items-end gap-3 h-44 mb-3">
            {CHART.map(({ m, r, o }) => (
              <div
                key={m}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-full flex items-end gap-1"
                  style={{ height: "160px" }}
                >
                  {/* Revenue bar */}
                  <div
                    className="flex-1 bg-oceanic rounded-t-[6px] hover:bg-oceanic-light transition-colors duration-200 cursor-pointer relative"
                    style={{ height: `${(r / maxR) * 100}%` }}
                    title={formatCurrency(r)}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-onyx text-wheat text-[10px] font-bold px-2 py-1 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(r)}
                    </span>
                  </div>
                  {/* Orders bar */}
                  <div
                    className="flex-1 bg-nectarine/70 hover:bg-nectarine rounded-t-[6px] transition-colors duration-200"
                    style={{ height: `${(o / maxR) * 20}%` }}
                    title={`${o} orders`}
                  />
                </div>
                <p className="text-[11.5px] text-onyx/40 font-semibold">{m}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top products list */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#EDE3D2] shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-onyx text-[15px]">Top Products</h2>
            <Link
              href="/admin/products"
              className="text-[12.5px] text-oceanic font-semibold hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[13px] font-medium text-onyx/80 line-clamp-1 flex-1 pr-2">
                    {p.name}
                  </p>
                  <span className="text-[12px] font-bold text-onyx flex-shrink-0">
                    {p.sales.toLocaleString()} sold
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-wheat-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-oceanic to-oceanic-light rounded-full transition-all duration-700"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders table ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#EDE3D2] shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EDE3D2] flex items-center justify-between">
          <h2 className="font-bold text-onyx text-[15px]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-[12.5px] text-oceanic font-semibold hover:underline flex items-center gap-1"
          >
            View all{" "}
            <span className="material-symbols-outlined text-[14px]">
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <tr key={order.id}>
                    {/* Order ID */}
                    <td>
                      <span className="font-mono text-[12.5px] font-semibold text-onyx/60">
                        #{order.id}
                      </span>
                    </td>

                    {/* Customer with avatar */}
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[9px] bg-oceanic/10 flex items-center justify-center text-oceanic font-bold text-[13px] flex-shrink-0">
                          {order.avatar}
                        </div>
                        <span className="font-medium text-onyx text-[13.5px]">
                          {order.customer}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="text-onyx/50 text-[13px]">
                      {formatDate(order.date)}
                    </td>

                    {/* Amount */}
                    <td>
                      <span className="font-bold text-onyx text-[13.5px]">
                        {formatCurrency(order.total)}
                      </span>
                    </td>

                    {/* Status with dot */}
                    <td>
                      <span className={`badge ${sc.badge} gap-1.5`}>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                        />
                        {sc.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[12.5px] text-oceanic font-semibold hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
