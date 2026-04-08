"use client";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

const EXPENSES = [
  {
    id: 1,
    cat: "infrastructure",
    desc: "AWS Server Hosting — March",
    amount: 1240.0,
    date: "2024-03-01",
    receipt: true,
  },
  {
    id: 2,
    cat: "marketing",
    desc: "Google Ads Campaign — Q1",
    amount: 3200.0,
    date: "2024-03-01",
    receipt: true,
  },
  {
    id: 3,
    cat: "salaries",
    desc: "Customer Support Team — Feb",
    amount: 8400.0,
    date: "2024-02-29",
    receipt: false,
  },
  {
    id: 4,
    cat: "operations",
    desc: "Office Supplies & Equipment",
    amount: 340.5,
    date: "2024-02-28",
    receipt: true,
  },
  {
    id: 5,
    cat: "infrastructure",
    desc: "MySQL Cloud DB — February",
    amount: 220.0,
    date: "2024-02-28",
    receipt: true,
  },
  {
    id: 6,
    cat: "marketing",
    desc: "Influencer Sponsorship",
    amount: 1500.0,
    date: "2024-02-25",
    receipt: false,
  },
  {
    id: 7,
    cat: "other",
    desc: "Legal & Compliance Review",
    amount: 900.0,
    date: "2024-02-20",
    receipt: true,
  },
];
const CAT_ICON = {
  infrastructure: "dns",
  marketing: "campaign",
  salaries: "people",
  operations: "build",
  other: "category",
};
const CAT_COLOR = {
  infrastructure: "#0ea5e9",
  marketing: "#E8A355",
  salaries: "#22c55e",
  operations: "#7C3AED",
  other: "#6B7D8A",
};
const CAT_BADGE = {
  infrastructure: "badge-info",
  marketing: "badge-warning",
  salaries: "badge-success",
  operations: "badge-neutral",
  other: "badge-neutral",
};
const CATS = [
  "all",
  "operations",
  "marketing",
  "infrastructure",
  "salaries",
  "other",
];

export default function AdminExpensesPage() {
  const [cat, setCat] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    description: "",
    category: "operations",
    amount: "",
    date: "",
  });

  const filtered = EXPENSES.filter((e) => cat === "all" || e.cat === cat);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

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
            Expenses
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            Track and manage operational costs
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm h-10 gap-2">
            <span className="material-symbols-outlined text-[16px]">
              download
            </span>
            Export CSV
          </button>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="btn-primary text-sm gap-2 h-10"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Log Expense
          </button>
        </div>
      </div>

      {showForm && (
        <div
          className="bg-white rounded-2xl p-6"
          style={{
            border: "1.5px solid #FFBD76",
            boxShadow: "0 4px 20px rgba(255,189,118,0.2)",
          }}
        >
          <h2
            className="font-bold text-onyx mb-4 flex items-center gap-2"
            style={{ fontFamily: '"Roboto Slab",sans-serif' }}
          >
            <span className="material-symbols-outlined text-nectarine-dark">
              add_circle
            </span>
            New Expense
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="e.g. AWS Server Hosting — March"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                className="input-field"
              >
                {CATS.filter((c) => c !== "all").map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Amount (USD)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                placeholder="0.00"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="input-field"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="btn-primary gap-2 h-10"
            >
              <span className="material-symbols-outlined text-[16px]">
                save
              </span>
              Save Expense
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost h-10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div
        className="bg-white rounded-2xl p-4 flex flex-wrap items-center gap-3"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
        }}
      >
        <div className="flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
              style={{
                background: cat === c ? "#003F47" : "#F5EBD8",
                color: cat === c ? "#FFF6E9" : "#6B7D8A",
                boxShadow: cat === c ? "0 2px 8px rgba(0,63,71,0.25)" : "",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-onyx/40">Total:</span>
          <span
            className="font-black text-onyx tabular-nums"
            style={{ fontFamily: '"Roboto Slab",sans-serif' }}
          >
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
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
                  "#",
                  "Description",
                  "Category",
                  "Date",
                  "Receipt",
                  "Amount",
                  "",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.06em] ${i >= 5 ? "text-right" : "text-left"}`}
                    style={{ color: "#6B7D8A" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#F2EAE0" }}>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className="transition-colors duration-150"
                  onMouseEnter={(x) =>
                    (x.currentTarget.style.background = "#FAF4EC")
                  }
                  onMouseLeave={(x) => (x.currentTarget.style.background = "")}
                >
                  <td className="px-5 py-4 text-[11px] text-onyx/30 font-mono">
                    #{e.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${CAT_COLOR[e.cat]}12` }}
                      >
                        <span
                          className="material-symbols-outlined text-[15px]"
                          style={{ color: CAT_COLOR[e.cat] }}
                        >
                          {CAT_ICON[e.cat]}
                        </span>
                      </div>
                      <span className="font-medium text-onyx text-sm">
                        {e.desc}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge capitalize ${CAT_BADGE[e.cat]}`}
                      style={{ fontSize: "11px" }}
                    >
                      {e.cat}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-onyx/45 text-sm">
                    {formatDate(e.date, { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    {e.receipt ? (
                      <span className="material-symbols-outlined text-emerald-500 text-[20px] material-symbols-filled">
                        check_circle
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-onyx/20 text-[20px]">
                        radio_button_unchecked
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-onyx tabular-nums">
                    {formatCurrency(e.amount)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg text-onyx/30 hover:text-oceanic hover:bg-oceanic/10 transition-all">
                        <span className="material-symbols-outlined text-[14px]">
                          edit
                        </span>
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg text-onyx/30 hover:text-red-500 hover:bg-red-50 transition-all">
                        <span className="material-symbols-outlined text-[14px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr
                style={{
                  background: "#FAF4EC",
                  borderTop: "2px solid #EDE3D2",
                }}
              >
                <td
                  colSpan={5}
                  className="px-5 py-3 text-sm font-bold text-onyx/55"
                >
                  {filtered.length} expense{filtered.length !== 1 ? "s" : ""}
                </td>
                <td
                  className="px-5 py-3 text-right font-black text-onyx tabular-nums"
                  style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                >
                  {formatCurrency(total)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
