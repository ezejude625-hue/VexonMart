// ============================================================
// INVOICE — src/app/(store)/orders/[id]/invoice/page.js
// ============================================================

import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const INV = {
  order_number: "VXM-20240301-A3K9",
  date: "2024-03-01",
  due: "2024-03-08",
  status: "paid",
  customer: {
    name: "Amara Osei",
    email: "amara@example.com",
    phone: "+234 801 234 5678",
    address: "14 Broad Street, Lagos Island",
    city: "Lagos, Nigeria",
  },
  items: [
    {
      name: "Sony WH-1000XM5 Wireless Headphones",
      sku: "SONY-WH1000-BLK",
      qty: 1,
      price: 279.99,
    },
    {
      name: "React 19 Mastery Video Course",
      sku: "COURSE-REACT19",
      qty: 1,
      price: 49.0,
    },
    {
      name: "Minimalist Leather Bifold Wallet",
      sku: "WALLET-LTH-BRN",
      qty: 2,
      price: 34.99,
    },
  ],
  subtotal: 398.97,
  discount: 20.0,
  tax: 30.32,
  shipping: 0,
  total: 409.29,
};

export default function InvoicePage() {
  const total_items = INV.items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-wheat py-10 px-4">
      {/* Print controls — hidden when printing */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-6 no-print">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 text-sm font-semibold text-onyx/60 hover:text-onyx transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back to Orders
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="btn-ghost h-9 px-4 text-sm gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary h-9 px-4 text-sm gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              download
            </span>
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice card */}
      <div
        className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 8px 48px rgba(10,23,29,0.12)",
        }}
      >
        {/* Header band */}
        <div
          className="relative overflow-hidden px-10 py-8"
          style={{
            background:
              "linear-gradient(135deg,#0A171D 0%,#1C3040 50%,#003F47 100%)",
          }}
        >
          {/* Decorative rings */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-white/5" />
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full border border-white/8" />

          <div className="relative flex items-start justify-between">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-nectarine/15 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-nectarine text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    storefront
                  </span>
                </div>
                <span
                  className="text-white font-black text-xl tracking-tight"
                  style={{
                    fontFamily: '"Roboto Slab",sans-serif',
                    fontWeight: 800,
                  }}
                >
                  Vexon<span className="text-nectarine">Mart</span>
                </span>
              </div>
              <p className="text-white/30 text-xs">
                Shop Smarter. Live Better.
              </p>
              <p className="text-white/30 text-xs mt-0.5">
                support@vexonmart.com
              </p>
            </div>

            {/* Invoice details */}
            <div className="text-right">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5">
                Invoice
              </p>
              <p className="text-white font-mono font-bold text-xl">
                {INV.order_number}
              </p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="badge badge-success">PAID</span>
              </div>
              <p className="text-white/30 text-xs mt-2">
                {formatDate(INV.date)}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-10 py-8">
          {/* Bill to + details grid */}
          <div
            className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b"
            style={{ borderColor: "#EDE3D2" }}
          >
            {/* Bill to */}
            <div>
              <p className="text-[10px] font-bold text-onyx/35 uppercase tracking-[0.12em] mb-3">
                Bill To
              </p>
              <p className="font-bold text-onyx text-base">
                {INV.customer.name}
              </p>
              <p className="text-sm text-onyx/55 mt-1">{INV.customer.email}</p>
              <p className="text-sm text-onyx/55">{INV.customer.phone}</p>
              <p className="text-sm text-onyx/55 mt-1.5">
                {INV.customer.address}
              </p>
              <p className="text-sm text-onyx/55">{INV.customer.city}</p>
            </div>

            {/* Invoice details */}
            <div>
              <p className="text-[10px] font-bold text-onyx/35 uppercase tracking-[0.12em] mb-3">
                Details
              </p>
              <div className="space-y-2">
                {[
                  { label: "Invoice Date", val: formatDate(INV.date) },
                  { label: "Payment Due", val: formatDate(INV.due) },
                  {
                    label: "Items",
                    val: `${total_items} item${total_items !== 1 ? "s" : ""}`,
                  },
                  { label: "Method", val: "Stripe (Card)" },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-onyx/40">{label}</span>
                    <span className="font-semibold text-onyx">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="mb-8">
            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl mb-2 text-[10px] font-bold text-onyx/35 uppercase tracking-[0.1em]"
              style={{ background: "#F5EBD8" }}
            >
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Table rows */}
            <div className="divide-y" style={{ borderColor: "#F2EAE0" }}>
              {INV.items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-4 px-4 py-4 items-center"
                >
                  <div className="col-span-6">
                    <p className="font-semibold text-onyx text-sm">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-onyx/35 font-mono mt-0.5">
                      {item.sku}
                    </p>
                  </div>
                  <div className="col-span-2 text-center text-sm text-onyx/55 font-medium">
                    {item.qty}
                  </div>
                  <div className="col-span-2 text-right text-sm text-onyx/55 tabular-nums">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="col-span-2 text-right text-sm font-bold text-onyx tabular-nums">
                    {formatCurrency(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals block */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2.5">
              {[
                { label: "Subtotal", val: formatCurrency(INV.subtotal) },
                {
                  label: "Discount",
                  val: `-${formatCurrency(INV.discount)}`,
                  green: true,
                },
                { label: "Tax (7.5%)", val: formatCurrency(INV.tax) },
                {
                  label: "Shipping",
                  val:
                    INV.shipping === 0 ? "FREE" : formatCurrency(INV.shipping),
                  green: INV.shipping === 0,
                },
              ].map(({ label, val, green }) => (
                <div
                  key={label}
                  className="flex justify-between items-center text-sm py-1 border-b"
                  style={{ borderColor: "#F2EAE0" }}
                >
                  <span className="text-onyx/50">{label}</span>
                  <span
                    className={`font-semibold ${green ? "text-emerald-600" : "text-onyx"} tabular-nums`}
                  >
                    {val}
                  </span>
                </div>
              ))}

              {/* Total row */}
              <div className="flex justify-between items-center pt-3">
                <span className="font-bold text-onyx text-base">Total Due</span>
                <span
                  className="font-black text-onyx tabular-nums"
                  style={{
                    fontFamily: '"Roboto Slab",sans-serif',
                    fontSize: "1.5rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatCurrency(INV.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment confirmed notice */}
          <div
            className="mt-8 p-5 rounded-2xl flex items-start gap-4"
            style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-emerald-600 text-[20px] material-symbols-filled">
                verified
              </span>
            </div>
            <div>
              <p className="font-bold text-emerald-800 text-sm">
                Payment Successfully Received
              </p>
              <p className="text-emerald-700/70 text-xs mt-0.5 leading-relaxed">
                This invoice is your official payment receipt. Transaction was
                processed securely via Stripe.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            className="mt-8 pt-6 border-t text-center"
            style={{ borderColor: "#EDE3D2" }}
          >
            <p className="text-xs text-onyx/30">
              Questions? Contact us at{" "}
              <a
                href="mailto:support@vexonmart.com"
                className="text-oceanic hover:underline font-medium"
              >
                support@vexonmart.com
              </a>{" "}
              · VexonMart © {new Date().getFullYear()} · Shop Smarter. Live
              Better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
