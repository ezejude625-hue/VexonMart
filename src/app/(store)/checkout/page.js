"use client";
// ============================================================
// CHECKOUT PAGE — src/app/(store)/checkout/page.js
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency, generateOrderNumber } from "@/lib/utils";

const ITEMS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    qty: 1,
    price: 279.99,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80",
  },
  {
    id: 2,
    name: "React 19 Mastery Course",
    qty: 1,
    price: 49.0,
    img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=80&q=80",
  },
];
const SUBTOTAL = ITEMS.reduce((s, i) => s + i.price * i.qty, 0);

const STEPS = [
  { key: "shipping", label: "Shipping", icon: "local_shipping", num: 1 },
  { key: "payment", label: "Payment", icon: "payment", num: 2 },
  { key: "confirm", label: "Review", icon: "task_alt", num: 3 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState("shipping");
  const [placing, setPlacing] = useState(false);

  const [shipping, setShipping] = useState({
    full_name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postal: "",
    country: "Nigeria",
  });
  const [payment, setPayment] = useState({
    method: "card",
    card_number: "",
    expiry: "",
    cvv: "",
    card_name: "",
  });

  const shChange = (e) =>
    setShipping((p) => ({ ...p, [e.target.name]: e.target.value }));
  const pyChange = (e) =>
    setPayment((p) => ({ ...p, [e.target.name]: e.target.value }));

  const stepIdx = STEPS.findIndex((s) => s.key === step);

  async function placeOrder() {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1400));
    const num = generateOrderNumber();
    localStorage.removeItem("vexon_cart");
    window.dispatchEvent(new Event("storage"));
    router.push("/checkout/success?order=" + num);
  }

  const Field = ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    half = false,
  }) => (
    <div className={half ? "" : "col-span-2"}>
      <label className="label">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-field"
        style={{ height: "44px" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-wheat">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/cart"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-onyx/50 hover:text-onyx hover:bg-white transition-all duration-150"
            style={{ border: "1.5px solid #E2D5C0" }}
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
          </Link>
          <div>
            <h1
              className="text-2xl font-black text-onyx"
              style={{
                fontFamily: '"Roboto Slab",sans-serif',
                letterSpacing: "-0.025em",
              }}
            >
              Checkout
            </h1>
            <p className="text-onyx/45 text-xs mt-0.5">
              Secure · Encrypted · Fast
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] material-symbols-filled">
              lock
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              SSL Secured
            </span>
          </div>
        </div>

        {/* Step progress bar */}
        <div
          className="flex items-center mb-8 bg-white rounded-2xl p-4"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
          }}
        >
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1">
              <div className="flex items-center gap-2.5">
                {/* Step circle */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300"
                  style={{
                    background:
                      i < stepIdx
                        ? "#003F47"
                        : i === stepIdx
                          ? "#FFBD76"
                          : "#F5EBD8",
                    color:
                      i < stepIdx
                        ? "#FFF6E9"
                        : i === stepIdx
                          ? "#0A171D"
                          : "#9AAAB5",
                    boxShadow:
                      i === stepIdx ? "0 4px 12px rgba(255,189,118,0.4)" : "",
                  }}
                >
                  {i < stepIdx ? (
                    <span className="material-symbols-outlined text-[16px] material-symbols-filled">
                      check
                    </span>
                  ) : (
                    s.num
                  )}
                </div>
                <div className="hidden sm:block">
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.08em]"
                    style={{
                      color:
                        i === stepIdx
                          ? "#003F47"
                          : i < stepIdx
                            ? "#22c55e"
                            : "#9AAAB5",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 mx-3 h-1 rounded-full transition-all duration-500"
                  style={{ background: i < stepIdx ? "#003F47" : "#EDE3D2" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form area */}
          <div className="lg:col-span-2">
            {/* SHIPPING STEP */}
            {step === "shipping" && (
              <div
                className="bg-white rounded-2xl p-6"
                style={{
                  border: "1px solid #EDE3D2",
                  boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
                }}
              >
                <h2
                  className="font-bold text-onyx text-base mb-5 flex items-center gap-2"
                  style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-oceanic/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-oceanic text-[16px]">
                      local_shipping
                    </span>
                  </div>
                  Shipping Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Full Name"
                    name="full_name"
                    value={shipping.full_name}
                    onChange={shChange}
                    placeholder="Amara Osei"
                    required
                    half
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    value={shipping.phone}
                    onChange={shChange}
                    placeholder="+234 801 234 5678"
                    half
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={shipping.email}
                    onChange={shChange}
                    placeholder="you@example.com"
                    required
                  />
                  <Field
                    label="Street Address"
                    name="street"
                    value={shipping.street}
                    onChange={shChange}
                    placeholder="14 Broad Street"
                    required
                  />
                  <Field
                    label="City"
                    name="city"
                    value={shipping.city}
                    onChange={shChange}
                    placeholder="Lagos"
                    required
                    half
                  />
                  <Field
                    label="State"
                    name="state"
                    value={shipping.state}
                    onChange={shChange}
                    placeholder="Lagos State"
                    half
                  />
                  <Field
                    label="Postal Code"
                    name="postal"
                    value={shipping.postal}
                    onChange={shChange}
                    placeholder="101001"
                    half
                  />
                  <div className="half">
                    <label className="label">Country</label>
                    <select
                      name="country"
                      value={shipping.country}
                      onChange={shChange}
                      className="input-field"
                      style={{ height: "44px" }}
                    >
                      {[
                        "Nigeria",
                        "Ghana",
                        "Kenya",
                        "South Africa",
                        "United States",
                        "United Kingdom",
                        "Canada",
                        "Australia",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setStep("payment")}
                  className="btn-primary w-full justify-center h-12 mt-6 text-base"
                >
                  Continue to Payment{" "}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}

            {/* PAYMENT STEP */}
            {step === "payment" && (
              <div
                className="bg-white rounded-2xl p-6"
                style={{
                  border: "1px solid #EDE3D2",
                  boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
                }}
              >
                <h2
                  className="font-bold text-onyx text-base mb-5 flex items-center gap-2"
                  style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-oceanic/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-oceanic text-[16px]">
                      payment
                    </span>
                  </div>
                  Payment Method
                </h2>

                {/* Method tabs */}
                <div className="flex gap-2 mb-5">
                  {[
                    { k: "card", l: "Card", i: "credit_card" },
                    { k: "paypal", l: "PayPal", i: "account_balance" },
                    { k: "cod", l: "Pay on Delivery", i: "local_shipping" },
                  ].map((m) => (
                    <button
                      key={m.k}
                      onClick={() => setPayment((p) => ({ ...p, method: m.k }))}
                      className="flex-1 flex flex-col items-center gap-1.5 p-3.5 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{
                        border: `2px solid ${payment.method === m.k ? "#003F47" : "#E2D5C0"}`,
                        background:
                          payment.method === m.k
                            ? "rgba(0,63,71,0.05)"
                            : "#fff",
                        color: payment.method === m.k ? "#003F47" : "#6B7D8A",
                        boxShadow:
                          payment.method === m.k
                            ? "0 0 0 3px rgba(0,63,71,0.08)"
                            : "",
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {m.i}
                      </span>
                      {m.l}
                    </button>
                  ))}
                </div>

                {payment.method === "card" && (
                  <div className="space-y-4">
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: "#F5EBD8",
                        border: "1px solid #E2D5C0",
                      }}
                    >
                      <p className="text-[11px] font-bold text-onyx/40 uppercase tracking-[0.08em] mb-1">
                        Test card number
                      </p>
                      <p className="font-mono text-sm text-onyx font-semibold">
                        4242 4242 4242 4242
                      </p>
                    </div>
                    <div>
                      <label className="label">Card Number</label>
                      <input
                        name="card_number"
                        value={payment.card_number}
                        onChange={pyChange}
                        placeholder="1234 5678 9012 3456"
                        className="input-field font-mono"
                        style={{ height: "44px" }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Expiry</label>
                        <input
                          name="expiry"
                          value={payment.expiry}
                          onChange={pyChange}
                          placeholder="MM/YY"
                          className="input-field"
                          style={{ height: "44px" }}
                        />
                      </div>
                      <div>
                        <label className="label">CVV</label>
                        <input
                          name="cvv"
                          value={payment.cvv}
                          onChange={pyChange}
                          placeholder="123"
                          className="input-field"
                          style={{ height: "44px" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Name on Card</label>
                      <input
                        name="card_name"
                        value={payment.card_name}
                        onChange={pyChange}
                        placeholder="Amara Osei"
                        className="input-field"
                        style={{ height: "44px" }}
                      />
                    </div>
                  </div>
                )}
                {payment.method === "paypal" && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-blue-600 text-3xl">
                        account_balance
                      </span>
                    </div>
                    <p className="font-semibold text-onyx">
                      You will be redirected to PayPal
                    </p>
                    <p className="text-sm text-onyx/45 mt-1">
                      Complete your payment securely on PayPal&apos;s platform
                    </p>
                  </div>
                )}
                {payment.method === "cod" && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{
                      background: "#F5EBD8",
                      border: "1px solid #E2D5C0",
                    }}
                  >
                    <span className="material-symbols-outlined text-oceanic text-xl mt-0.5">
                      info
                    </span>
                    <p className="text-sm text-onyx/65 leading-relaxed">
                      Pay in cash when your order arrives. Available for
                      selected delivery areas only. A small handling fee may
                      apply.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep("shipping")}
                    className="btn-ghost h-12 flex-1 justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_back
                    </span>
                    Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="btn-primary h-12 flex-1 justify-center"
                  >
                    Review Order{" "}
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* CONFIRM STEP */}
            {step === "confirm" && (
              <div
                className="bg-white rounded-2xl p-6"
                style={{
                  border: "1px solid #EDE3D2",
                  boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
                }}
              >
                <h2
                  className="font-bold text-onyx text-base mb-5 flex items-center gap-2"
                  style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-oceanic/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-oceanic text-[16px]">
                      task_alt
                    </span>
                  </div>
                  Review Your Order
                </h2>

                {/* Shipping summary */}
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{ background: "#F5EBD8", border: "1px solid #E2D5C0" }}
                >
                  <p className="text-[11px] font-bold text-onyx/40 uppercase tracking-[0.08em] mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[13px]">
                      location_on
                    </span>
                    Delivering to
                  </p>
                  <p className="font-semibold text-onyx text-sm">
                    {shipping.full_name || "Your Name"}
                  </p>
                  <p className="text-sm text-onyx/55 mt-0.5">
                    {shipping.street || "Your address"},{" "}
                    {shipping.city || "City"}, {shipping.country}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {ITEMS.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ border: "1px solid #EDE3D2" }}
                    >
                      <img
                        src={i.img}
                        alt={i.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-onyx text-sm truncate">
                          {i.name}
                        </p>
                        <p className="text-xs text-onyx/40 mt-0.5">
                          Qty: {i.qty}
                        </p>
                      </div>
                      <span className="font-bold text-onyx tabular-nums shrink-0">
                        {formatCurrency(i.price * i.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="btn-ghost h-12 flex-1 justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_back
                    </span>
                    Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="btn-primary h-12 flex-1 justify-center text-base"
                    style={{ boxShadow: "0 6px 24px rgba(255,189,118,0.45)" }}
                  >
                    {placing ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin-smooth">
                          progress_activity
                        </span>
                        Placing…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          lock
                        </span>
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="space-y-4">
            <div
              className="bg-white rounded-2xl p-5"
              style={{
                border: "1px solid #EDE3D2",
                boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
              }}
            >
              <h3
                className="font-bold text-onyx mb-4"
                style={{ fontFamily: '"Roboto Slab",sans-serif' }}
              >
                Summary
              </h3>
              <div className="space-y-3 mb-4">
                {ITEMS.map((i) => (
                  <div key={i.id} className="flex gap-3">
                    <img
                      src={i.img}
                      alt={i.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                      style={{ border: "1px solid #EDE3D2" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-onyx line-clamp-2 leading-snug">
                        {i.name}
                      </p>
                      <p className="text-[11px] text-onyx/40 mt-0.5">
                        ×{i.qty}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-onyx shrink-0 tabular-nums">
                      {formatCurrency(i.price * i.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="flex justify-between pt-3 border-t font-black text-onyx"
                style={{ borderColor: "#EDE3D2" }}
              >
                <span>Total</span>
                <span
                  className="tabular-nums"
                  style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                >
                  {formatCurrency(SUBTOTAL)}
                </span>
              </div>
            </div>

            {/* Security note */}
            <div
              className="flex items-start gap-2.5 p-4 rounded-2xl"
              style={{
                background: "rgba(0,63,71,0.05)",
                border: "1px solid rgba(0,63,71,0.12)",
              }}
            >
              <span className="material-symbols-outlined text-oceanic text-xl mt-0.5 material-symbols-filled shrink-0">
                security
              </span>
              <p className="text-xs text-onyx/55 leading-relaxed">
                Your payment info is encrypted with 256-bit SSL. We never store
                your full card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
