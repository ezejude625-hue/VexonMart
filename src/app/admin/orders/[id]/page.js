"use client";
// Admin Order Detail — src/app/admin/orders/[id]/page.js
import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const ORDER = {
  id: "VXM-20240301-A3K9",
  date: "2024-03-01T10:23:00Z",
  status: "delivered",
  payment_status: "paid",
  payment_method: "Stripe (Visa ••4242)",
  customer: {
    name: "Amara Osei",
    email: "amara@example.com",
    phone: "+234 801 234 5678",
    joined: "2023-11-01",
  },
  shipping: {
    address: "14 Broad Street",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    postal: "101001",
  },
  items: [
    {
      id: 1,
      name: "Sony WH-1000XM5 Headphones",
      sku: "SONY-WH1000",
      qty: 1,
      unit: 279.99,
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80",
    },
    {
      id: 2,
      name: "React 19 Mastery Course",
      sku: "REACT-V19",
      qty: 1,
      unit: 49.0,
      img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=80&q=80",
    },
  ],
  subtotal: 328.99,
  discount: 20.0,
  tax: 23.17,
  shipping_cost: 0,
  total: 332.16,
  timeline: [
    {
      event: "Order placed",
      date: "2024-03-01 10:23",
      icon: "add_shopping_cart",
      done: true,
    },
    {
      event: "Payment confirmed",
      date: "2024-03-01 10:24",
      icon: "payments",
      done: true,
    },
    {
      event: "Processing started",
      date: "2024-03-01 11:00",
      icon: "inventory_2",
      done: true,
    },
    {
      event: "Shipped via DHL",
      date: "2024-03-02 09:15",
      icon: "local_shipping",
      done: true,
    },
    {
      event: "Delivered",
      date: "2024-03-04 14:40",
      icon: "check_circle",
      done: true,
    },
  ],
};
const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_BADGE = {
  delivered: "badge-success",
  processing: "badge-info",
  shipped: "badge-warning",
  pending: "badge-neutral",
  cancelled: "badge-error",
};

export default function AdminOrderDetailPage({ params }) {
  const [status, setStatus] = useState(ORDER.status);
  const [saving, setSaving] = useState(false);

  async function changeStatus(s) {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setStatus(s);
    setSaving(false);
  }

  return (
    <div className="space-y-5 max-w-[1100px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-onyx/50 hover:text-onyx hover:bg-wheat-dark transition-all"
            style={{ border: "1.5px solid #E2D5C0" }}
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
          </Link>
          <div>
            <h1 className="font-mono font-black text-onyx text-xl">
              #{ORDER.id}
            </h1>
            <p className="text-onyx/40 text-xs mt-0.5">
              {formatDate(ORDER.date)}
            </p>
          </div>
          <span className={`badge capitalize ${STATUS_BADGE[status]}`}>
            {status}
          </span>
        </div>
        <Link
          href={`/orders/${ORDER.id}/invoice`}
          target="_blank"
          className="btn-ghost text-sm h-10 gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">print</span>
          Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: items + timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <div
              className="px-5 py-4 border-b flex items-center gap-2 font-bold text-onyx"
              style={{
                borderColor: "#EDE3D2",
                fontFamily: '"Roboto Slab",sans-serif',
              }}
            >
              <span className="material-symbols-outlined text-oceanic text-[17px]">
                shopping_bag
              </span>
              Order Items ({ORDER.items.length})
            </div>
            <div className="divide-y" style={{ borderColor: "#F2EAE0" }}>
              {ORDER.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    style={{ border: "1px solid #EDE3D2" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-onyx text-sm">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-onyx/35 font-mono mt-0.5">
                      {item.sku}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-onyx/45">
                      {item.qty} × {formatCurrency(item.unit)}
                    </p>
                    <p className="font-bold text-onyx">
                      {formatCurrency(item.unit * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div
              className="px-5 py-4 border-t space-y-2"
              style={{ background: "#FAF4EC", borderColor: "#EDE3D2" }}
            >
              {[
                { l: "Subtotal", v: ORDER.subtotal },
                { l: "Discount", v: -ORDER.discount, g: true },
                { l: "Tax", v: ORDER.tax },
                {
                  l: "Shipping",
                  v: ORDER.shipping_cost,
                  g: ORDER.shipping_cost === 0,
                  f: ORDER.shipping_cost === 0 ? "FREE" : null,
                },
              ].map(({ l, v, g, f }) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-onyx/50">{l}</span>
                  <span
                    className={`font-medium tabular-nums ${g ? "text-emerald-600" : "text-onyx"}`}
                  >
                    {f || (v < 0 ? "-" : "") + formatCurrency(Math.abs(v))}
                  </span>
                </div>
              ))}
              <div
                className="flex justify-between pt-2 border-t font-black text-onyx"
                style={{ borderColor: "#EDE3D2" }}
              >
                <span>Total</span>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: '"Roboto Slab",sans-serif',
                    fontSize: "1.1rem",
                  }}
                >
                  {formatCurrency(ORDER.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <h2
              className="font-bold text-onyx mb-5 flex items-center gap-2"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              <span className="material-symbols-outlined text-oceanic text-[17px]">
                timeline
              </span>
              Order Timeline
            </h2>
            <div className="relative pl-8">
              {/* Vertical line */}
              <div
                className="absolute left-3.5 top-0 bottom-0 w-0.5 rounded-full"
                style={{ background: "#EDE3D2" }}
              />
              <div className="space-y-5">
                {ORDER.timeline.map((step, i) => (
                  <div key={i} className="relative">
                    {/* Circle */}
                    <div
                      className="absolute -left-8 w-7 h-7 rounded-xl flex items-center justify-center"
                      style={{
                        background: step.done ? "#003F47" : "#F5EBD8",
                        border: `1.5px solid ${step.done ? "#003F47" : "#E2D5C0"}`,
                        boxShadow: step.done
                          ? "0 2px 8px rgba(0,63,71,0.3)"
                          : "",
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{
                          color: step.done ? "#FFBD76" : "#9AAAB5",
                          fontVariationSettings: step.done
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        {step.done ? "check" : step.icon}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${step.done ? "text-onyx" : "text-onyx/40"}`}
                      >
                        {step.event}
                      </p>
                      <p className="text-[11px] text-onyx/35 mt-0.5">
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: status + customer + payment */}
        <div className="space-y-4">
          {/* Status control */}
          <div
            className="bg-white rounded-2xl p-5 space-y-3"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <h2
              className="font-bold text-onyx text-sm flex items-center gap-2"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              <span className="material-symbols-outlined text-oceanic text-[16px]">
                pending_actions
              </span>
              Order Status
            </h2>
            <div className="space-y-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(s)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-150"
                  style={{
                    background: status === s ? "#003F47" : "transparent",
                    color: status === s ? "#FFF6E9" : "#3D5060",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== s) {
                      e.currentTarget.style.background = "#F5EBD8";
                      e.currentTarget.style.color = "#0A171D";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status !== s) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#3D5060";
                    }
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: status === s ? "#FFBD76" : "#D1D5DB" }}
                  />
                  {s}
                  {status === s && saving && (
                    <span className="material-symbols-outlined text-[13px] ml-auto animate-spin-smooth">
                      progress_activity
                    </span>
                  )}
                  {status === s && !saving && (
                    <span className="material-symbols-outlined text-[13px] ml-auto text-nectarine">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div
            className="bg-white rounded-2xl p-5 space-y-3"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <h2
              className="font-bold text-onyx text-sm flex items-center gap-2"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              <span className="material-symbols-outlined text-oceanic text-[16px]">
                person
              </span>
              Customer
            </h2>
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                style={{
                  background: "linear-gradient(135deg,#003F47,#005566)",
                  color: "#FFBD76",
                }}
              >
                {ORDER.customer.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-onyx text-sm">
                  {ORDER.customer.name}
                </p>
                <p className="text-xs text-onyx/40">{ORDER.customer.email}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-onyx/50">
              <p className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-oceanic">
                  phone
                </span>
                {ORDER.customer.phone}
              </p>
              <p className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-oceanic">
                  calendar_today
                </span>
                Joined {formatDate(ORDER.customer.joined)}
              </p>
            </div>
            <Link
              href={`/admin/customers/${ORDER.customer.email}`}
              className="text-xs text-oceanic font-semibold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">
                open_in_new
              </span>
              View profile
            </Link>
          </div>

          {/* Shipping */}
          <div
            className="bg-white rounded-2xl p-5 space-y-1.5"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <h2
              className="font-bold text-onyx text-sm flex items-center gap-2 mb-3"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              <span className="material-symbols-outlined text-oceanic text-[16px]">
                location_on
              </span>
              Shipping Address
            </h2>
            {[
              ORDER.customer.name,
              ORDER.shipping.address,
              `${ORDER.shipping.city}, ${ORDER.shipping.state} ${ORDER.shipping.postal}`,
              ORDER.shipping.country,
            ].map((l, i) => (
              <p
                key={i}
                className={`text-sm ${i === 0 ? "font-semibold text-onyx" : "text-onyx/55"}`}
              >
                {l}
              </p>
            ))}
          </div>

          {/* Payment */}
          <div
            className="bg-white rounded-2xl p-5 space-y-3"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <h2
              className="font-bold text-onyx text-sm flex items-center gap-2"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              <span className="material-symbols-outlined text-oceanic text-[16px]">
                payment
              </span>
              Payment
            </h2>
            {[
              { l: "Method", v: ORDER.payment_method },
              { l: "Status", badge: "badge-success", bText: "Paid" },
            ].map(({ l, v, badge, bText }) => (
              <div
                key={l}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-onyx/45">{l}</span>
                {badge ? (
                  <span
                    className={`badge ${badge}`}
                    style={{ fontSize: "11px" }}
                  >
                    {bText}
                  </span>
                ) : (
                  <span className="font-medium text-onyx text-xs">{v}</span>
                )}
              </div>
            ))}
            <button className="btn-danger w-full justify-center h-10 text-sm gap-2 mt-1">
              <span className="material-symbols-outlined text-[16px]">
                currency_exchange
              </span>
              Issue Refund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
