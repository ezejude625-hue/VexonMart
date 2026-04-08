"use client";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

const COUPONS = [
  {
    id: 1,
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    min: 0,
    used: 342,
    limit: 1000,
    active: true,
    expires: "2024-12-31",
    desc: "10% off first order",
  },
  {
    id: 2,
    code: "SAVE20",
    type: "percentage",
    value: 20,
    min: 100,
    used: 128,
    limit: 500,
    active: true,
    expires: "2024-06-30",
    desc: "20% off orders $100+",
  },
  {
    id: 3,
    code: "FLAT15",
    type: "fixed",
    value: 15,
    min: 50,
    used: 89,
    limit: 200,
    active: true,
    expires: "2024-09-30",
    desc: "$15 off orders $50+",
  },
  {
    id: 4,
    code: "VIP50",
    type: "fixed",
    value: 50,
    min: 200,
    used: 12,
    limit: 50,
    active: true,
    expires: "2024-06-01",
    desc: "$50 off for VIP customers",
  },
  {
    id: 5,
    code: "LAUNCH25",
    type: "percentage",
    value: 25,
    min: 0,
    used: 500,
    limit: 500,
    active: false,
    expires: "2024-01-31",
    desc: "Launch promotion",
  },
];

export default function AdminCouponsPage() {
  const [showForm, setShowForm] = useState(false);
  const [coupons, setCoupons] = useState(COUPONS);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    min: "0",
    limit: "",
    desc: "",
  });

  function toggleActive(id) {
    setCoupons((cs) =>
      cs.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  }

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-black text-onyx"
            style={{
              fontFamily: "'Roboto Slab',sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Coupons & Discounts
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            {coupons.filter((c) => c.active).length} active ·{" "}
            {coupons.reduce((s, c) => s + c.used, 0).toLocaleString()} total
            uses
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-primary text-sm gap-2 h-10"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Create Coupon
        </button>
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
            style={{ fontFamily: "'Roboto Slab',sans-serif" }}
          >
            <span className="material-symbols-outlined text-nectarine-dark">
              local_offer
            </span>
            Create Coupon
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Code</label>
              <input
                value={form.code}
                onChange={(e) =>
                  setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                }
                placeholder="SALE20"
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="label">Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
                className="input-field"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label className="label">
                Value ({form.type === "percentage" ? "%" : "$"})
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) =>
                  setForm((p) => ({ ...p, value: e.target.value }))
                }
                placeholder={form.type === "percentage" ? "10" : "15"}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Min Order ($)</label>
              <input
                type="number"
                value={form.min}
                onChange={(e) =>
                  setForm((p) => ({ ...p, min: e.target.value }))
                }
                placeholder="0"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Usage Limit</label>
              <input
                type="number"
                value={form.limit}
                onChange={(e) =>
                  setForm((p) => ({ ...p, limit: e.target.value }))
                }
                placeholder="Unlimited"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <input
                value={form.desc}
                onChange={(e) =>
                  setForm((p) => ({ ...p, desc: e.target.value }))
                }
                placeholder="Brief description"
                className="input-field"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setShowForm(false)}
              className="btn-primary gap-2 h-10"
            >
              <span className="material-symbols-outlined text-[16px]">
                save
              </span>
              Create
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

      {/* Coupons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-5 transition-all duration-200"
            style={{
              border: `1.5px solid ${c.active ? "#EDE3D2" : "#F2EAE0"}`,
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
              opacity: c.active ? 1 : 0.65,
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <code className="font-mono font-black text-lg text-onyx tracking-wider">
                    {c.code}
                  </code>
                  <span
                    className={`badge ${c.active ? "badge-success" : "badge-neutral"}`}
                    style={{ fontSize: "10px" }}
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-onyx/55">{c.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className="font-black text-2xl text-oceanic"
                  style={{ fontFamily: "'Roboto Slab',sans-serif" }}
                >
                  {c.type === "percentage" ? `${c.value}%` : `$${c.value}`}
                </p>
                <p className="text-[11px] text-onyx/35 capitalize">
                  {c.type} off
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { l: "Used", v: `${c.used}/${c.limit || "∞"}` },
                { l: "Min Order", v: c.min > 0 ? `$${c.min}` : "None" },
                {
                  l: "Expires",
                  v: formatDate(c.expires, { month: "short", day: "numeric" }),
                },
              ].map((s) => (
                <div
                  key={s.l}
                  className="text-center p-2 rounded-xl"
                  style={{ background: "#F5EBD8" }}
                >
                  <p className="text-xs font-bold text-onyx">{s.v}</p>
                  <p className="text-[10px] text-onyx/40 font-semibold">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>

            {/* Usage bar */}
            {c.limit && (
              <div className="mb-4">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#EDE3D2" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (c.used / c.limit) * 100)}%`,
                      background: c.used >= c.limit ? "#ef4444" : "#003F47",
                    }}
                  />
                </div>
                <p className="text-[10px] text-onyx/35 mt-1">
                  {c.used}/{c.limit} uses
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(c.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: c.active ? "#fee2e2" : "#dcfce7",
                  color: c.active ? "#991b1b" : "#166534",
                }}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {c.active ? "pause" : "play_arrow"}
                </span>
                {c.active ? "Pause" : "Activate"}
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl text-onyx/30 hover:text-oceanic hover:bg-oceanic/10 transition-all">
                <span className="material-symbols-outlined text-[16px]">
                  edit
                </span>
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl text-onyx/30 hover:text-red-500 hover:bg-red-50 transition-all">
                <span className="material-symbols-outlined text-[16px]">
                  delete
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
