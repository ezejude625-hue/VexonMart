"use client";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

const TRAFFIC = [
  { m: "Sep", visits: 8200, conv: 320 },
  { m: "Oct", visits: 9400, conv: 390 },
  { m: "Nov", visits: 11200, conv: 480 },
  { m: "Dec", visits: 15800, conv: 680 },
  { m: "Jan", visits: 10200, conv: 420 },
  { m: "Feb", visits: 13100, conv: 560 },
  { m: "Mar", visits: 15600, conv: 670 },
];
const TOP_PAGES = [
  { page: "/shop", views: 28400, bounce: "32%", time: "2:14" },
  { page: "/products/1", views: 14200, bounce: "28%", time: "3:40" },
  { page: "/", views: 12800, bounce: "45%", time: "1:30" },
  { page: "/cart", views: 8400, bounce: "18%", time: "4:12" },
  { page: "/checkout", views: 4200, bounce: "12%", time: "5:30" },
];
const TOP_SOURCES = [
  { src: "Organic Search", pct: 42, visits: 6552, color: "#003F47" },
  { src: "Direct", pct: 28, visits: 4368, color: "#FFBD76" },
  { src: "Social Media", pct: 18, visits: 2808, color: "#7C3AED" },
  { src: "Email", pct: 8, visits: 1248, color: "#059669" },
  { src: "Paid Ads", pct: 4, visits: 624, color: "#ef4444" },
];
const maxV = Math.max(...TRAFFIC.map((t) => t.visits));

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState("30d");
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-black text-onyx"
            style={{
              fontFamily: "Roboto Slab,sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Analytics
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            Store performance and traffic insights
          </p>
        </div>
        <div className="flex gap-1.5">
          {["7d", "30d", "90d", "1y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: range === r ? "#003F47" : "#fff",
                color: range === r ? "#FFF6E9" : "#6B7D8A",
                border: `1px solid ${range === r ? "transparent" : "#E2D5C0"}`,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            l: "Total Visits",
            v: "15,600",
            ch: "+18%",
            i: "visibility",
            c: "#003F47",
          },
          {
            l: "Unique Visitors",
            v: "11,200",
            ch: "+12%",
            i: "person",
            c: "#7C3AED",
          },
          {
            l: "Conv. Rate",
            v: "4.3%",
            ch: "+0.4%",
            i: "shopping_cart",
            c: "#E8A355",
          },
          {
            l: "Avg. Session",
            v: "3:12",
            ch: "+24s",
            i: "timer",
            c: "#059669",
          },
        ].map((k) => (
          <div
            key={k.l}
            className="bg-white rounded-2xl p-5"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${k.c}12` }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ color: k.c, fontVariationSettings: "'FILL' 1" }}
                >
                  {k.i}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {k.ch}
              </span>
            </div>
            <p
              className="text-2xl font-black text-onyx tabular-nums"
              style={{ fontFamily: "Roboto Slab,sans-serif" }}
            >
              {k.v}
            </p>
            <p className="text-[11px] text-onyx/40 font-semibold uppercase tracking-[0.06em] mt-0.5">
              {k.l}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Traffic chart */}
        <div
          className="xl:col-span-2 bg-white rounded-2xl p-6"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-bold text-onyx"
              style={{ fontFamily: "Roboto Slab,sans-serif" }}
            >
              Traffic Overview
            </h2>
            <div className="flex gap-4 text-xs text-onyx/40">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-oceanic inline-block" />
                Visits
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-nectarine-dark inline-block" />
                Conversions
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2.5" style={{ height: "160px" }}>
            {TRAFFIC.map(({ m, visits, conv }) => (
              <div
                key={m}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-full flex items-end gap-0.5"
                  style={{ height: "130px" }}
                >
                  <div
                    className="flex-1 rounded-lg transition-all duration-700 cursor-pointer group relative"
                    style={{
                      height: `${(visits / maxV) * 100}%`,
                      background: "linear-gradient(180deg,#003F47,#005566)",
                      minHeight: "4px",
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-onyx text-wheat text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                      {visits.toLocaleString()}
                    </div>
                  </div>
                  <div
                    className="flex-1 rounded-lg transition-all duration-700"
                    style={{
                      height: `${(conv / Math.max(...TRAFFIC.map((t) => t.conv))) * 70}%`,
                      background: "linear-gradient(180deg,#E8A355,#FFBD76)",
                      minHeight: "3px",
                    }}
                  />
                </div>
                <p className="text-[11px] text-onyx/40 font-medium">{m}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div
          className="bg-white rounded-2xl p-6"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
          }}
        >
          <h2
            className="font-bold text-onyx mb-5"
            style={{ fontFamily: "Roboto Slab,sans-serif" }}
          >
            Traffic Sources
          </h2>
          <div className="space-y-4">
            {TOP_SOURCES.map((s) => (
              <div key={s.src}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="font-medium text-onyx">{s.src}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-onyx/40 text-xs">
                      {s.visits.toLocaleString()}
                    </span>
                    <span className="font-bold text-onyx w-8 text-right">
                      {s.pct}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "#EDE3D2" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top pages table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
        }}
      >
        <div
          className="px-6 py-4 border-b font-bold text-onyx"
          style={{
            borderColor: "#EDE3D2",
            fontFamily: "Roboto Slab,sans-serif",
          }}
        >
          Top Pages
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                background: "#FAF4EC",
                borderBottom: "1px solid #EDE3D2",
              }}
            >
              {["Page", "Views", "Bounce Rate", "Avg. Time"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em]"
                  style={{ color: "#6B7D8A" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "#F2EAE0" }}>
            {TOP_PAGES.map((p, i) => (
              <tr
                key={i}
                className="transition-colors duration-150"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#FAF4EC")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-oceanic">
                  {p.page}
                </td>
                <td className="px-5 py-3.5 font-semibold text-onyx tabular-nums">
                  {p.views.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-onyx/55">{p.bounce}</td>
                <td className="px-5 py-3.5 text-onyx/55">{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
