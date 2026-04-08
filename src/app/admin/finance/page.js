"use client";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

const SUMMARY = {
  gross: 148320.5,
  net: 118656.4,
  pending: 12440.0,
  refunds: 4820.0,
  fees: 14832.05,
  tax: 9372.0,
};
const CHART = [
  { m: "Oct", r: 18400, e: 4200 },
  { m: "Nov", r: 22100, e: 5100 },
  { m: "Dec", r: 31500, e: 7800 },
  { m: "Jan", r: 19800, e: 4900 },
  { m: "Feb", r: 25600, e: 5900 },
  { m: "Mar", r: 31320, e: 6700 },
];
const TRANSACTIONS = [
  {
    id: "TXN-001",
    type: "sale",
    desc: "Sony WH-1000XM5 — Amara Osei",
    amount: 279.99,
    date: "2024-03-01",
  },
  {
    id: "TXN-002",
    type: "payout",
    desc: "Vendor payout — TechZone Official",
    amount: -840.0,
    date: "2024-03-01",
  },
  {
    id: "TXN-003",
    type: "sale",
    desc: "React 19 Course — Lucas Ferreira",
    amount: 49.0,
    date: "2024-02-29",
  },
  {
    id: "TXN-004",
    type: "refund",
    desc: "Order #VXM-20240227-E4W8 refund",
    amount: -89.99,
    date: "2024-02-28",
  },
  {
    id: "TXN-005",
    type: "fee",
    desc: "Platform fee — February",
    amount: -1240.0,
    date: "2024-02-28",
  },
  {
    id: "TXN-006",
    type: "sale",
    desc: "Yoga Mat Pro — Priya Mehta",
    amount: 49.99,
    date: "2024-02-27",
  },
];
const TYPE_BADGE = {
  sale: "badge-success",
  payout: "badge-info",
  refund: "badge-error",
  fee: "badge-warning",
};
const maxR = Math.max(...CHART.map((c) => c.r));

export default function AdminFinancePage() {
  const [range, setRange] = useState("30d");
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-black text-onyx"
            style={{
              fontFamily: '"Roboto Slab",sans-serif',
              letterSpacing: "-0.025em",
            }}
          >
            Finance
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            Revenue, payouts, and transaction ledger
          </p>
        </div>
        <div className="flex gap-2">
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
          <button className="btn-primary text-sm h-9 px-4 gap-1.5">
            <span className="material-symbols-outlined text-[16px]">
              download
            </span>
            Export
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            l: "Gross Revenue",
            v: SUMMARY.gross,
            i: "payments",
            c: "#003F47",
            s: "All transactions incl. fees",
          },
          {
            l: "Net Revenue",
            v: SUMMARY.net,
            i: "account_balance",
            c: "#059669",
            s: "After fees and refunds",
          },
          {
            l: "Pending Payout",
            v: SUMMARY.pending,
            i: "schedule_send",
            c: "#E8A355",
            s: "To be disbursed to vendors",
          },
          {
            l: "Total Refunds",
            v: SUMMARY.refunds,
            i: "currency_exchange",
            c: "#ef4444",
            s: "This period",
          },
          {
            l: "Platform Fees",
            v: SUMMARY.fees,
            i: "percent",
            c: "#7C3AED",
            s: "10% of gross revenue",
          },
          {
            l: "Tax Collected",
            v: SUMMARY.tax,
            i: "receipt_long",
            c: "#0ea5e9",
            s: "VAT / sales tax",
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
              <p className="text-[11px] font-bold text-onyx/40 uppercase tracking-[0.08em]">
                {k.l}
              </p>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${k.c}12` }}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ color: k.c }}
                >
                  {k.i}
                </span>
              </div>
            </div>
            <p
              className="text-2xl font-black text-onyx tabular-nums"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              {formatCurrency(k.v)}
            </p>
            <p className="text-[11px] text-onyx/35 mt-1">{k.s}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-bold text-onyx"
            style={{ fontFamily: '"Roboto Slab",sans-serif' }}
          >
            Revenue vs Expenses — Last 6 Months
          </h2>
          <div className="flex gap-4 text-xs text-onyx/40">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-oceanic inline-block" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-nectarine-dark inline-block" />
              Expenses
            </span>
          </div>
        </div>
        <div className="flex items-end gap-3" style={{ height: "150px" }}>
          {CHART.map(({ m, r, e }) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full flex items-end gap-0.5"
                style={{ height: "120px" }}
              >
                <div
                  className="flex-1 rounded-lg"
                  style={{
                    height: `${(r / maxR) * 100}%`,
                    background: "linear-gradient(180deg,#003F47,#005566)",
                    minHeight: "4px",
                  }}
                  title={formatCurrency(r)}
                />
                <div
                  className="flex-1 rounded-lg"
                  style={{
                    height: `${(e / maxR) * 100}%`,
                    background: "linear-gradient(180deg,#E8A355,#FFBD76)",
                    minHeight: "3px",
                  }}
                  title={formatCurrency(e)}
                />
              </div>
              <p className="text-[11px] text-onyx/40 font-medium">{m}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
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
            fontFamily: '"Roboto Slab",sans-serif',
          }}
        >
          Recent Transactions
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                background: "#FAF4EC",
                borderBottom: "1px solid #EDE3D2",
              }}
            >
              {["ID", "Description", "Date", "Type", "Amount"].map((h, i) => (
                <th
                  key={h}
                  className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] ${i === 4 ? "text-right" : "text-left"}`}
                  style={{ color: "#6B7D8A" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "#F2EAE0" }}>
            {TRANSACTIONS.map((tx) => (
              <tr
                key={tx.id}
                className="transition-colors duration-150"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#FAF4EC")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              >
                <td className="px-5 py-3.5 font-mono text-[11px] text-onyx/50">
                  {tx.id}
                </td>
                <td className="px-5 py-3.5 font-medium text-onyx text-sm">
                  {tx.desc}
                </td>
                <td className="px-5 py-3.5 text-onyx/45">
                  {formatDate(tx.date, { month: "short", day: "numeric" })}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`badge capitalize ${TYPE_BADGE[tx.type]}`}
                    style={{ fontSize: "11px" }}
                  >
                    {tx.type}
                  </span>
                </td>
                <td
                  className={`px-5 py-3.5 text-right font-bold tabular-nums ${tx.amount >= 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {formatCurrency(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
