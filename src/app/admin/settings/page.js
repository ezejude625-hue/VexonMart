"use client";
// ============================================================
// ADMIN SETTINGS — src/app/admin/settings/page.js
// ============================================================

import { useState } from "react";

const TABS = [
  { k: "general", l: "General", i: "settings" },
  { k: "payment", l: "Payment", i: "payment" },
  { k: "shipping", l: "Shipping", i: "local_shipping" },
  { k: "email", l: "Email", i: "mail" },
  { k: "seo", l: "SEO", i: "travel_explore" },
];

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  help = "",
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
      {help && <p className="text-[11px] text-onyx/35 mt-1">{help}</p>}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3.5 border-b last:border-0"
      style={{ borderColor: "#F2EAE0" }}
    >
      <div>
        <p className="text-sm font-semibold text-onyx">{label}</p>
        {desc && <p className="text-xs text-onyx/45 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-12 h-6 rounded-full transition-all duration-200 shrink-0"
        style={{
          background: checked ? "#003F47" : "#E2D5C0",
          boxShadow: checked ? "0 2px 8px rgba(0,63,71,0.3)" : "",
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ transform: checked ? "translateX(24px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

function SaveBtn({ saving, saved, onSave }) {
  return (
    <div
      className="flex items-center gap-3 pt-5 border-t"
      style={{ borderColor: "#EDE3D2" }}
    >
      <button
        onClick={onSave}
        disabled={saving}
        className="btn-primary gap-2 h-11"
      >
        {saving ? (
          <>
            <span className="material-symbols-outlined text-[16px] animate-spin-smooth">
              progress_activity
            </span>
            Saving…
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[16px]">save</span>
            Save Settings
          </>
        )}
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold animate-scale-in">
          <span className="material-symbols-outlined text-[15px] material-symbols-filled">
            check_circle
          </span>
          Saved!
        </span>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    store_name: "VexonMart",
    tagline: "Shop Smarter. Live Better.",
    email: "hello@vexonmart.com",
    phone: "+234 800 000 0000",
    address: "Victoria Island, Lagos, Nigeria",
    currency: "USD",
    timezone: "Africa/Lagos",
  });
  const [payment, setPayment] = useState({
    stripe_key: "pk_test_...",
    stripe_secret: "sk_test_...",
    paypal_enabled: true,
    cod_enabled: true,
    test_mode: true,
  });
  const [shipping, setShipping] = useState({
    free_threshold: 100,
    flat_rate: 9.99,
    express_rate: 24.99,
    international: false,
    carriers: ["DHL", "FedEx"],
  });
  const [email, setEmail] = useState({
    from_name: "VexonMart",
    from_email: "noreply@vexonmart.com",
    smtp_host: "smtp.gmail.com",
    smtp_port: "587",
    order_confirm: true,
    shipping_notify: true,
    promo_emails: true,
  });
  const [seo, setSeo] = useState({
    meta_title: "VexonMart — Shop Smarter. Live Better.",
    meta_desc:
      "Discover thousands of premium products with fast delivery and world-class service.",
    og_image: "",
    ga_id: "G-XXXXXXXXXX",
    robots: true,
  });
  const [notifs, setNotifs] = useState({
    new_order: true,
    low_stock: true,
    new_review: false,
    new_customer: true,
  });

  async function saveAll() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-[1000px]">
      <div>
        <h1
          className="text-2xl font-black text-onyx"
          style={{
            fontFamily: '"Roboto Slab",sans-serif',
            letterSpacing: "-0.025em",
          }}
        >
          Store Settings
        </h1>
        <p className="text-onyx/45 text-sm mt-0.5">
          Configure your marketplace preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Tab nav */}
        <nav className="md:w-52 shrink-0">
          <div
            className="bg-white rounded-2xl p-2 space-y-0.5"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-150"
                style={{
                  background: tab === t.k ? "#003F47" : "transparent",
                  color: tab === t.k ? "#FFF6E9" : "#3D5060",
                  boxShadow: tab === t.k ? "0 2px 8px rgba(0,63,71,0.2)" : "",
                }}
                onMouseEnter={(e) => {
                  if (tab !== t.k) {
                    e.currentTarget.style.background = "#F5EBD8";
                    e.currentTarget.style.color = "#0A171D";
                  }
                }}
                onMouseLeave={(e) => {
                  if (tab !== t.k) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#3D5060";
                  }
                }}
              >
                <span
                  className="material-symbols-outlined text-[17px]"
                  style={{ color: tab === t.k ? "#FFBD76" : undefined }}
                >
                  {t.i}
                </span>
                {t.l}
              </button>
            ))}
          </div>
        </nav>

        {/* Settings panel */}
        <div
          className="flex-1 bg-white rounded-2xl p-6"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
          }}
        >
          {/* GENERAL */}
          {tab === "general" && (
            <div className="space-y-5">
              <h2
                className="font-bold text-onyx text-lg border-b pb-3"
                style={{
                  fontFamily: '"Roboto Slab",sans-serif',
                  borderColor: "#EDE3D2",
                }}
              >
                General Settings
              </h2>

              {/* Logo upload */}
              <div>
                <label className="label">Store Logo</label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "#003F47" }}
                  >
                    <span
                      className="material-symbols-outlined text-nectarine text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      storefront
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn-ghost text-xs px-3 py-2 h-auto gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        upload
                      </span>
                      Upload Logo
                    </button>
                    <p className="text-[11px] text-onyx/35 mt-1">
                      PNG, SVG · 512×512px recommended
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Store Name"
                  name="store_name"
                  value={general.store_name}
                  onChange={(e) =>
                    setGeneral((p) => ({ ...p, store_name: e.target.value }))
                  }
                />
                <Field
                  label="Tagline"
                  name="tagline"
                  value={general.tagline}
                  onChange={(e) =>
                    setGeneral((p) => ({ ...p, tagline: e.target.value }))
                  }
                />
                <Field
                  label="Contact Email"
                  name="email"
                  type="email"
                  value={general.email}
                  onChange={(e) =>
                    setGeneral((p) => ({ ...p, email: e.target.value }))
                  }
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={general.phone}
                  onChange={(e) =>
                    setGeneral((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
              <Field
                label="Business Address"
                name="address"
                value={general.address}
                onChange={(e) =>
                  setGeneral((p) => ({ ...p, address: e.target.value }))
                }
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Currency</label>
                  <select
                    value={general.currency}
                    onChange={(e) =>
                      setGeneral((p) => ({ ...p, currency: e.target.value }))
                    }
                    className="input-field"
                  >
                    {["USD", "EUR", "GBP", "NGN", "GHS", "KES", "ZAR"].map(
                      (c) => (
                        <option key={c}>{c}</option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select
                    value={general.timezone}
                    onChange={(e) =>
                      setGeneral((p) => ({ ...p, timezone: e.target.value }))
                    }
                    className="input-field"
                  >
                    {[
                      "Africa/Lagos",
                      "Africa/Accra",
                      "Africa/Nairobi",
                      "Europe/London",
                      "America/New_York",
                      "America/Los_Angeles",
                    ].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <SaveBtn saving={saving} saved={saved} onSave={saveAll} />
            </div>
          )}

          {/* PAYMENT */}
          {tab === "payment" && (
            <div className="space-y-5">
              <h2
                className="font-bold text-onyx text-lg border-b pb-3"
                style={{
                  fontFamily: '"Roboto Slab",sans-serif',
                  borderColor: "#EDE3D2",
                }}
              >
                Payment Settings
              </h2>
              <Toggle
                label="Test Mode (Sandbox)"
                desc="Use test API keys — no real charges"
                checked={payment.test_mode}
                onChange={(v) => setPayment((p) => ({ ...p, test_mode: v }))}
              />
              <div className="space-y-4">
                <h3 className="font-semibold text-onyx text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-oceanic text-[16px]">
                    credit_card
                  </span>
                  Stripe
                </h3>
                <Field
                  label="Publishable Key"
                  name="stripe_key"
                  value={payment.stripe_key}
                  onChange={(e) =>
                    setPayment((p) => ({ ...p, stripe_key: e.target.value }))
                  }
                  placeholder="pk_test_..."
                />
                <Field
                  label="Secret Key"
                  name="stripe_secret"
                  value={payment.stripe_secret}
                  onChange={(e) =>
                    setPayment((p) => ({ ...p, stripe_secret: e.target.value }))
                  }
                  type="password"
                  placeholder="sk_test_..."
                />
              </div>
              <Toggle
                label="Enable PayPal"
                desc="Allow customers to pay via PayPal"
                checked={payment.paypal_enabled}
                onChange={(v) =>
                  setPayment((p) => ({ ...p, paypal_enabled: v }))
                }
              />
              <Toggle
                label="Enable Pay on Delivery"
                desc="Cash payment on delivery (selected areas)"
                checked={payment.cod_enabled}
                onChange={(v) => setPayment((p) => ({ ...p, cod_enabled: v }))}
              />
              <SaveBtn saving={saving} saved={saved} onSave={saveAll} />
            </div>
          )}

          {/* SHIPPING */}
          {tab === "shipping" && (
            <div className="space-y-5">
              <h2
                className="font-bold text-onyx text-lg border-b pb-3"
                style={{
                  fontFamily: '"Roboto Slab",sans-serif',
                  borderColor: "#EDE3D2",
                }}
              >
                Shipping Settings
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Free Shipping Threshold ($)"
                  name="free_threshold"
                  type="number"
                  value={shipping.free_threshold}
                  onChange={(e) =>
                    setShipping((p) => ({
                      ...p,
                      free_threshold: e.target.value,
                    }))
                  }
                  help="Orders above this amount get free shipping"
                />
                <Field
                  label="Standard Flat Rate ($)"
                  name="flat_rate"
                  type="number"
                  value={shipping.flat_rate}
                  onChange={(e) =>
                    setShipping((p) => ({ ...p, flat_rate: e.target.value }))
                  }
                  help="Applied to orders below the threshold"
                />
                <Field
                  label="Express Rate ($)"
                  name="express_rate"
                  type="number"
                  value={shipping.express_rate}
                  onChange={(e) =>
                    setShipping((p) => ({ ...p, express_rate: e.target.value }))
                  }
                />
              </div>
              <Toggle
                label="International Shipping"
                desc="Enable delivery to international addresses"
                checked={shipping.international}
                onChange={(v) =>
                  setShipping((p) => ({ ...p, international: v }))
                }
              />
              <div>
                <label className="label">Shipping Carriers</label>
                <div className="flex flex-wrap gap-2">
                  {["DHL", "FedEx", "UPS", "USPS", "Royal Mail"].map(
                    (carrier) => (
                      <button
                        key={carrier}
                        type="button"
                        onClick={() =>
                          setShipping((p) => ({
                            ...p,
                            carriers: p.carriers.includes(carrier)
                              ? p.carriers.filter((c) => c !== carrier)
                              : [...p.carriers, carrier],
                          }))
                        }
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          background: shipping.carriers.includes(carrier)
                            ? "#003F47"
                            : "#F5EBD8",
                          color: shipping.carriers.includes(carrier)
                            ? "#FFF6E9"
                            : "#6B7D8A",
                          border: `1px solid ${shipping.carriers.includes(carrier) ? "transparent" : "#E2D5C0"}`,
                        }}
                      >
                        {carrier}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <SaveBtn saving={saving} saved={saved} onSave={saveAll} />
            </div>
          )}

          {/* EMAIL */}
          {tab === "email" && (
            <div className="space-y-5">
              <h2
                className="font-bold text-onyx text-lg border-b pb-3"
                style={{
                  fontFamily: '"Roboto Slab",sans-serif',
                  borderColor: "#EDE3D2",
                }}
              >
                Email Settings
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Sender Name"
                  name="from_name"
                  value={email.from_name}
                  onChange={(e) =>
                    setEmail((p) => ({ ...p, from_name: e.target.value }))
                  }
                />
                <Field
                  label="Sender Email"
                  name="from_email"
                  type="email"
                  value={email.from_email}
                  onChange={(e) =>
                    setEmail((p) => ({ ...p, from_email: e.target.value }))
                  }
                />
                <Field
                  label="SMTP Host"
                  name="smtp_host"
                  value={email.smtp_host}
                  onChange={(e) =>
                    setEmail((p) => ({ ...p, smtp_host: e.target.value }))
                  }
                />
                <Field
                  label="SMTP Port"
                  name="smtp_port"
                  value={email.smtp_port}
                  onChange={(e) =>
                    setEmail((p) => ({ ...p, smtp_port: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-0">
                <Toggle
                  label="Order Confirmation"
                  desc="Send email when order is placed"
                  checked={email.order_confirm}
                  onChange={(v) =>
                    setEmail((p) => ({ ...p, order_confirm: v }))
                  }
                />
                <Toggle
                  label="Shipping Notification"
                  desc="Email when order ships"
                  checked={email.shipping_notify}
                  onChange={(v) =>
                    setEmail((p) => ({ ...p, shipping_notify: v }))
                  }
                />
                <Toggle
                  label="Promotional Emails"
                  desc="Marketing emails to customers"
                  checked={email.promo_emails}
                  onChange={(v) => setEmail((p) => ({ ...p, promo_emails: v }))}
                />
              </div>
              <button className="btn-ghost text-sm h-10 gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  send
                </span>
                Send Test Email
              </button>
              <SaveBtn saving={saving} saved={saved} onSave={saveAll} />
            </div>
          )}

          {/* SEO */}
          {tab === "seo" && (
            <div className="space-y-5">
              <h2
                className="font-bold text-onyx text-lg border-b pb-3"
                style={{
                  fontFamily: '"Roboto Slab",sans-serif',
                  borderColor: "#EDE3D2",
                }}
              >
                SEO Settings
              </h2>
              <Field
                label="Default Meta Title"
                name="meta_title"
                value={seo.meta_title}
                onChange={(e) =>
                  setSeo((p) => ({ ...p, meta_title: e.target.value }))
                }
              />
              <div>
                <label className="label">Default Meta Description</label>
                <textarea
                  rows={3}
                  value={seo.meta_desc}
                  onChange={(e) =>
                    setSeo((p) => ({ ...p, meta_desc: e.target.value }))
                  }
                  className="input-field resize-none py-3"
                  style={{ height: "auto" }}
                />
                <p className="text-[11px] text-onyx/35 mt-1">
                  {seo.meta_desc.length}/160 characters
                </p>
              </div>
              <Field
                label="Google Analytics ID"
                name="ga_id"
                value={seo.ga_id}
                onChange={(e) =>
                  setSeo((p) => ({ ...p, ga_id: e.target.value }))
                }
                placeholder="G-XXXXXXXXXX"
                help="Your GA4 measurement ID"
              />
              <Toggle
                label="Allow Search Engine Indexing"
                desc="Enables robots.txt indexing of your store"
                checked={seo.robots}
                onChange={(v) => setSeo((p) => ({ ...p, robots: v }))}
              />
              <SaveBtn saving={saving} saved={saved} onSave={saveAll} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
