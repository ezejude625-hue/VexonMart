"use client";
// Admin Customers — src/app/admin/customers/page.js
import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const CUSTOMERS = [
  {
    id: 1,
    name: "Amara Osei",
    email: "amara@example.com",
    phone: "+234 801 234 5678",
    orders: 12,
    spent: 1842.5,
    status: "active",
    joined: "2023-11-01",
    avatar: "A",
    color: "#003F47",
  },
  {
    id: 2,
    name: "Lucas Ferreira",
    email: "lucas@example.com",
    phone: "+55 11 98765-4321",
    orders: 8,
    spent: 692.0,
    status: "active",
    joined: "2023-12-15",
    avatar: "L",
    color: "#7C3AED",
  },
  {
    id: 3,
    name: "Priya Mehta",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    orders: 5,
    spent: 430.99,
    status: "active",
    joined: "2024-01-08",
    avatar: "P",
    color: "#ec4899",
  },
  {
    id: 4,
    name: "James Carter",
    email: "james@example.com",
    phone: "+1 555 123 4567",
    orders: 3,
    spent: 179.99,
    status: "active",
    joined: "2024-02-01",
    avatar: "J",
    color: "#059669",
  },
  {
    id: 5,
    name: "Sofia Novak",
    email: "sofia@example.com",
    phone: "+420 777 123 456",
    orders: 1,
    spent: 89.99,
    status: "suspended",
    joined: "2024-02-20",
    avatar: "S",
    color: "#6B7D8A",
  },
  {
    id: 6,
    name: "Chen Wei",
    email: "chen@example.com",
    phone: "+86 138 0013 8000",
    orders: 7,
    spent: 1240.0,
    status: "active",
    joined: "2023-10-14",
    avatar: "C",
    color: "#0ea5e9",
  },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = CUSTOMERS.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      (!search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())),
  );

  const totalRevenue = filtered.reduce((s, c) => s + c.spent, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-black text-onyx"
            style={{
              fontFamily: "'Roboto Slab',sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Customers
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            {filtered.length} customers · {formatCurrency(totalRevenue)} total
            spend
          </p>
        </div>
        <button className="btn-primary text-sm gap-2 h-10">
          <span className="material-symbols-outlined text-[16px]">
            download
          </span>
          Export
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Customers",
            value: CUSTOMERS.length,
            icon: "group",
            color: "#003F47",
          },
          {
            label: "Active",
            value: CUSTOMERS.filter((c) => c.status === "active").length,
            icon: "person_check",
            color: "#22c55e",
          },
          {
            label: "Total Revenue",
            value: formatCurrency(CUSTOMERS.reduce((s, c) => s + c.spent, 0)),
            icon: "payments",
            color: "#E8A355",
          },
          {
            label: "Avg. Order Value",
            value: formatCurrency(
              CUSTOMERS.reduce((s, c) => s + c.spent, 0) /
                CUSTOMERS.reduce((s, c) => s + c.orders, 0),
            ),
            icon: "analytics",
            color: "#7C3AED",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}12` }}
              >
                <span
                  className="material-symbols-outlined text-[17px]"
                  style={{ color: s.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {s.icon}
                </span>
              </div>
            </div>
            <p
              className="text-xl font-black text-onyx tabular-nums"
              style={{ fontFamily: "'Roboto Slab',sans-serif" }}
            >
              {s.value}
            </p>
            <p className="text-[11px] text-onyx/40 font-semibold uppercase tracking-[0.06em] mt-0.5">
              {s.label}
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
          {["all", "active", "suspended"].map((f) => (
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
            placeholder="Search customers…"
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
                  "Customer",
                  "Contact",
                  "Orders",
                  "Total Spent",
                  "Joined",
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
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="transition-colors duration-150"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#FAF4EC")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                        style={{ background: `${c.color}12`, color: c.color }}
                      >
                        {c.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-onyx text-sm">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-onyx/35 font-mono">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-onyx/50">{c.phone}</td>
                  <td className="px-5 py-4 font-semibold text-onyx tabular-nums">
                    {c.orders}
                  </td>
                  <td className="px-5 py-4 font-bold text-onyx tabular-nums">
                    {formatCurrency(c.spent)}
                  </td>
                  <td className="px-5 py-4 text-onyx/45 whitespace-nowrap text-sm">
                    {formatDate(c.joined, { month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge capitalize ${c.status === "active" ? "badge-success" : "badge-error"}`}
                      style={{ fontSize: "11px" }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="text-xs font-bold text-oceanic hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="px-5 py-3.5 border-t flex items-center justify-between"
          style={{ borderColor: "#EDE3D2", background: "#FAF4EC" }}
        >
          <p className="text-xs text-onyx/40">{filtered.length} customers</p>
          <div className="flex gap-1">
            {[1, 2].map((n) => (
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
