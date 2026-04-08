"use client";
// ============================================================
// ADMIN REPORTS — src/app/admin/reports/page.js
// ============================================================

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

const REPORTS = [
  {
    id: "sales",
    name: "Sales Report",
    icon: "bar_chart",
    color: "#003F47",
    desc: "Revenue breakdown by product, category, and time period",
    formats: ["CSV", "PDF", "XLSX"],
    lastGen: "2024-03-01",
    metrics: [
      { l: "Total Revenue", v: formatCurrency(148320) },
      { l: "Orders", v: "1,204" },
      { l: "Avg Order", v: formatCurrency(123.19) },
    ],
  },
  {
    id: "customers",
    name: "Customer Report",
    icon: "group",
    color: "#7C3AED",
    desc: "Customer acquisition, retention, and lifetime value analysis",
    formats: ["CSV", "PDF"],
    lastGen: "2024-03-01",
    metrics: [
      { l: "New Customers", v: "342" },
      { l: "Returning", v: "860" },
      { l: "Churn Rate", v: "4.2%" },
    ],
  },
  {
    id: "products",
    name: "Products Report",
    icon: "inventory_2",
    color: "#E8A355",
    desc: "Best sellers, low stock alerts, and product performance",
    formats: ["CSV", "PDF", "XLSX"],
    lastGen: "2024-02-28",
    metrics: [
      { l: "Top Product", v: "Sony WH-1000XM5" },
      { l: "Low Stock", v: "8 items" },
      { l: "Active SKUs", v: "342" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Report",
    icon: "campaign",
    color: "#ec4899",
    desc: "Coupon performance, conversion rates, and channel attribution",
    formats: ["CSV", "PDF"],
    lastGen: "2024-02-28",
    metrics: [
      { l: "Coupons Used", v: "571" },
      { l: "Discount Given", v: formatCurrency(8420) },
      { l: "ROAS", v: "4.2×" },
    ],
  },
  {
    id: "inventory",
    name: "Inventory Report",
    icon: "warehouse",
    color: "#0ea5e9",
    desc: "Stock levels, reorder points, and fulfillment performance",
    formats: ["CSV", "XLSX"],
    lastGen: "2024-03-01",
    metrics: [
      { l: "In Stock", v: "334 items" },
      { l: "Out of Stock", v: "8 items" },
      { l: "Low Stock", v: "18 items" },
    ],
  },
  {
    id: "taxes",
    name: "Tax Report",
    icon: "receipt_long",
    color: "#059669",
    desc: "Tax collected by region, for accounting and compliance",
    formats: ["CSV", "PDF"],
    lastGen: "2024-02-29",
    metrics: [
      { l: "Tax Collected", v: formatCurrency(9372) },
      { l: "Regions", v: "12" },
      { l: "Returns", v: formatCurrency(420) },
    ],
  },
];

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: "2024-03-31",
  });
  const [generating, setGenerating] = useState(null);
  const [generated, setGenerated] = useState(null);

  async function generateReport(id, format) {
    const key = `${id}-${format}`;
    setGenerating(key);
    await new Promise((r) => setTimeout(r, 1500));
    setGenerating(null);
    setGenerated(key);
    setTimeout(() => setGenerated(null), 3000);
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
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
            Reports
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            Generate and download detailed business reports
          </p>
        </div>
      </div>

      {/* Date range selector */}
      <div
        className="bg-white rounded-2xl p-5"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-oceanic text-[18px]">
              date_range
            </span>
            <span className="font-semibold text-onyx text-sm">
              Report Period
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <label className="text-xs text-onyx/50 font-medium">From</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((p) => ({ ...p, from: e.target.value }))
                }
                className="h-9 px-3 rounded-xl text-sm outline-none"
                style={{
                  background: "#F5EBD8",
                  border: "1.5px solid transparent",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#003F47";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "transparent";
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-onyx/50 font-medium">To</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((p) => ({ ...p, to: e.target.value }))
                }
                className="h-9 px-3 rounded-xl text-sm outline-none"
                style={{
                  background: "#F5EBD8",
                  border: "1.5px solid transparent",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#003F47";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "transparent";
                }}
              />
            </div>
          </div>

          {/* Quick ranges */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "This Month", from: "2024-03-01", to: "2024-03-31" },
              { label: "Last Month", from: "2024-02-01", to: "2024-02-29" },
              { label: "Q1 2024", from: "2024-01-01", to: "2024-03-31" },
              { label: "This Year", from: "2024-01-01", to: "2024-12-31" },
            ].map((r) => (
              <button
                key={r.label}
                onClick={() => setDateRange({ from: r.from, to: r.to })}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background:
                    dateRange.from === r.from && dateRange.to === r.to
                      ? "#003F47"
                      : "#F5EBD8",
                  color:
                    dateRange.from === r.from && dateRange.to === r.to
                      ? "#FFF6E9"
                      : "#6B7D8A",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl p-5"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            {/* Report header */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: `${report.color}12`,
                  border: `1px solid ${report.color}20`,
                }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ color: report.color }}
                >
                  {report.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-onyx text-sm">{report.name}</p>
                <p className="text-[11px] text-onyx/45 mt-0.5 leading-snug">
                  {report.desc}
                </p>
              </div>
            </div>

            {/* Metrics preview */}
            <div
              className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl"
              style={{ background: "#F5EBD8" }}
            >
              {report.metrics.map((m) => (
                <div key={m.l} className="text-center">
                  <p className="text-xs font-black text-onyx truncate tabular-nums">
                    {m.v}
                  </p>
                  <p className="text-[10px] text-onyx/35 font-medium mt-0.5 truncate">
                    {m.l}
                  </p>
                </div>
              ))}
            </div>

            {/* Last generated */}
            <p className="text-[11px] text-onyx/35 flex items-center gap-1 mb-3">
              <span className="material-symbols-outlined text-[12px]">
                history
              </span>
              Last generated: {report.lastGen}
            </p>

            {/* Format buttons */}
            <div className="flex gap-2">
              {report.formats.map((fmt) => {
                const key = `${report.id}-${fmt}`;
                const isGen = generating === key;
                const isDone = generated === key;
                const fmtColors = {
                  CSV: "#059669",
                  PDF: "#ef4444",
                  XLSX: "#003F47",
                };
                return (
                  <button
                    key={fmt}
                    onClick={() => generateReport(report.id, fmt)}
                    disabled={!!generating}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                    style={{
                      background: isDone ? "#dcfce7" : `${fmtColors[fmt]}12`,
                      color: isDone ? "#166534" : fmtColors[fmt],
                      border: `1px solid ${isDone ? "#bbf7d0" : `${fmtColors[fmt]}25`}`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isGen && !isDone) {
                        e.currentTarget.style.background = fmtColors[fmt];
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isGen && !isDone) {
                        e.currentTarget.style.background = `${fmtColors[fmt]}12`;
                        e.currentTarget.style.color = fmtColors[fmt];
                      }
                    }}
                  >
                    <span
                      className={`material-symbols-outlined text-[13px] ${isGen ? "animate-spin-smooth" : ""}`}
                    >
                      {isDone
                        ? "check_circle"
                        : isGen
                          ? "progress_activity"
                          : "download"}
                    </span>
                    {isDone ? "Ready!" : isGen ? "…" : fmt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled reports section */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2
              className="font-bold text-onyx"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              Scheduled Reports
            </h2>
            <p className="text-sm text-onyx/45 mt-0.5">
              Automatically send reports to your inbox
            </p>
          </div>
          <button className="btn-primary text-sm h-9 px-4 gap-1.5">
            <span className="material-symbols-outlined text-[15px]">add</span>
            Schedule
          </button>
        </div>

        <div className="space-y-3">
          {[
            {
              name: "Weekly Sales Summary",
              freq: "Every Monday 9:00 AM",
              next: "Apr 1, 2024",
              to: "admin@vexonmart.com",
              active: true,
            },
            {
              name: "Monthly Finance Overview",
              freq: "1st of each month",
              next: "Apr 1, 2024",
              to: "finance@vexonmart.com",
              active: true,
            },
            {
              name: "Daily Low Stock Alert",
              freq: "Every day at 7:00 AM",
              next: "Tomorrow",
              to: "ops@vexonmart.com",
              active: false,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all"
              style={{
                border: "1px solid #EDE3D2",
                background: s.active ? "#fff" : "#FAF4EC",
                opacity: s.active ? 1 : 0.6,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: s.active ? "rgba(0,63,71,0.08)" : "#F5EBD8",
                }}
              >
                <span
                  className="material-symbols-outlined text-[17px]"
                  style={{ color: s.active ? "#003F47" : "#9AAAB5" }}
                >
                  schedule
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-onyx text-sm">{s.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px] text-onyx/40 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      repeat
                    </span>
                    {s.freq}
                  </span>
                  <span className="text-[11px] text-onyx/40 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      mail
                    </span>
                    {s.to}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-onyx/30 uppercase tracking-wide">
                    Next run
                  </p>
                  <p className="text-xs font-semibold text-onyx">{s.next}</p>
                </div>
                <span
                  className={`badge ${s.active ? "badge-success" : "badge-neutral"}`}
                  style={{ fontSize: "10px" }}
                >
                  {s.active ? "Active" : "Paused"}
                </span>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-onyx/25 hover:text-oceanic hover:bg-oceanic/10 transition-all">
                  <span className="material-symbols-outlined text-[14px]">
                    edit
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
