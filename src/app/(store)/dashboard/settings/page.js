"use client";
// ============================================================
// DASHBOARD SETTINGS — src/app/(store)/dashboard/settings/page.js
// ============================================================

import { useState } from "react";
import Link from "next/link";

const TABS = [
  { k: "profile", l: "Profile", i: "person" },
  { k: "security", l: "Security", i: "lock" },
  { k: "addresses", l: "Addresses", i: "location_on" },
  { k: "notifications", l: "Notifications", i: "notifications" },
];

const ADDRESSES = [
  {
    id: 1,
    label: "Home",
    name: "Amara Osei",
    street: "14 Broad Street",
    city: "Lagos",
    country: "Nigeria",
    default: true,
  },
  {
    id: 2,
    label: "Office",
    name: "Amara Osei",
    street: "7 Victoria Island Boulevard",
    city: "Lagos",
    country: "Nigeria",
    default: false,
  },
];

const NOTIF_ITEMS = [
  {
    k: "order_updates",
    l: "Order Updates",
    d: "Shipping and delivery status changes",
    i: "local_shipping",
    v: true,
  },
  {
    k: "promotions",
    l: "Deals & Promos",
    d: "Exclusive offers and discount codes",
    i: "local_offer",
    v: true,
  },
  {
    k: "new_arrivals",
    l: "New Arrivals",
    d: "New products in your saved categories",
    i: "new_releases",
    v: false,
  },
  {
    k: "security",
    l: "Security Alerts",
    d: "Login attempts and account changes",
    i: "security",
    v: true,
  },
  {
    k: "newsletters",
    l: "Newsletter",
    d: "Monthly digest and shopping guides",
    i: "mail",
    v: false,
  },
];

function SaveBtn({ saving, saved }) {
  return (
    <div
      className="flex items-center gap-3 pt-5 border-t"
      style={{ borderColor: "#EDE3D2" }}
    >
      <button
        type="submit"
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
            Save Changes
          </>
        )}
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold animate-scale-in">
          <span className="material-symbols-outlined text-[16px] material-symbols-filled">
            check_circle
          </span>
          Saved!
        </span>
      )}
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-4 border-b last:border-0"
      style={{ borderColor: "#F2EAE0" }}
    >
      <div>
        <p className="text-sm font-semibold text-onyx">{label}</p>
        {desc && <p className="text-xs text-onyx/45 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
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

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    first_name: "Amara",
    last_name: "Osei",
    email: "amara@example.com",
    phone: "+234 801 234 5678",
    bio: "Digital enthusiast and online shopper.",
  });
  const [pwd, setPwd] = useState({ current: "", newPwd: "", confirm: "" });
  const [notifs, setNotifs] = useState(
    Object.fromEntries(NOTIF_ITEMS.map((n) => [n.k, n.v])),
  );

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-black text-onyx tracking-tight"
          style={{
            fontFamily: '"Roboto Slab",sans-serif',
            letterSpacing: "-0.025em",
          }}
        >
          Account Settings
        </h1>
        <p className="text-onyx/45 text-sm mt-0.5">
          Manage your profile, security, and preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Tab nav */}
        <nav className="md:w-48 shrink-0">
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

        {/* Form panel */}
        <div
          className="flex-1 bg-white rounded-2xl p-6"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
          }}
        >
          {/* PROFILE */}
          {tab === "profile" && (
            <form onSubmit={save} className="space-y-5">
              <h2
                className="font-bold text-onyx text-lg border-b pb-3"
                style={{
                  fontFamily: '"Roboto Slab",sans-serif',
                  borderColor: "#EDE3D2",
                }}
              >
                Personal Information
              </h2>

              {/* Avatar */}
              <div
                className="flex items-center gap-5 p-4 rounded-2xl"
                style={{ background: "#F5EBD8", border: "1px solid #E2D5C0" }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#003F47,#005566)",
                    color: "#FFBD76",
                  }}
                >
                  {profile.first_name.charAt(0)}
                </div>
                <div>
                  <button
                    type="button"
                    className="btn-ghost text-xs px-3 py-2 h-auto gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      upload
                    </span>
                    Upload photo
                  </button>
                  <p className="text-[11px] text-onyx/35 mt-1">
                    JPG, PNG or WebP · Max 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="First Name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, first_name: e.target.value }))
                  }
                  placeholder="Amara"
                />
                <Field
                  label="Last Name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, last_name: e.target.value }))
                  }
                  placeholder="Osei"
                />
              </div>
              <Field
                label="Email Address"
                name="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="you@example.com"
              />
              <Field
                label="Phone Number"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+234 801 234 5678"
              />
              <div>
                <label className="label">Bio</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, bio: e.target.value }))
                  }
                  className="input-field resize-none py-3"
                  style={{ height: "auto" }}
                />
              </div>
              <SaveBtn saving={saving} saved={saved} />
            </form>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <form onSubmit={save} className="space-y-5">
              <h2
                className="font-bold text-onyx text-lg border-b pb-3"
                style={{
                  fontFamily: '"Roboto Slab",sans-serif',
                  borderColor: "#EDE3D2",
                }}
              >
                Change Password
              </h2>
              {[
                {
                  label: "Current Password",
                  k: "current",
                  p: "Enter current password",
                },
                { label: "New Password", k: "newPwd", p: "Min. 8 characters" },
                {
                  label: "Confirm Password",
                  k: "confirm",
                  p: "Repeat new password",
                },
              ].map((f) => (
                <div key={f.k}>
                  <label className="label">{f.label}</label>
                  <input
                    type="password"
                    value={pwd[f.k]}
                    onChange={(e) =>
                      setPwd((p) => ({ ...p, [f.k]: e.target.value }))
                    }
                    placeholder={f.p}
                    className="input-field"
                  />
                </div>
              ))}

              {/* 2FA teaser */}
              <div
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{
                  background: "rgba(255,189,118,0.08)",
                  border: "1px solid rgba(255,189,118,0.25)",
                }}
              >
                <span className="material-symbols-outlined text-nectarine-dark text-xl mt-0.5">
                  shield
                </span>
                <div>
                  <p className="text-sm font-bold text-onyx">
                    Two-factor authentication
                  </p>
                  <p className="text-xs text-onyx/50 mt-0.5">
                    Coming soon — adds an extra layer of security to your
                    account.
                  </p>
                </div>
              </div>
              <SaveBtn saving={saving} saved={saved} />
            </form>
          )}

          {/* ADDRESSES */}
          {tab === "addresses" && (
            <div className="space-y-4">
              <div
                className="flex items-center justify-between border-b pb-3"
                style={{ borderColor: "#EDE3D2" }}
              >
                <h2
                  className="font-bold text-onyx text-lg"
                  style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                >
                  Saved Addresses
                </h2>
                <button className="btn-primary text-xs h-8 px-3 gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    add
                  </span>
                  Add New
                </button>
              </div>
              {ADDRESSES.map((addr, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 p-4 rounded-2xl transition-all"
                  style={{ border: "1.5px solid #EDE3D2" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#003F47";
                    e.currentTarget.style.background = "#F5EBD8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#EDE3D2";
                    e.currentTarget.style.background = "";
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-oceanic/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-oceanic text-[17px]">
                        location_on
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-onyx">
                          {addr.label}
                        </span>
                        {addr.default && (
                          <span
                            className="badge badge-success"
                            style={{ fontSize: "10px" }}
                          >
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-onyx/60">{addr.name}</p>
                      <p className="text-sm text-onyx/45">
                        {addr.street}, {addr.city}, {addr.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-onyx/30 hover:text-oceanic hover:bg-oceanic/10 transition-all">
                      <span className="material-symbols-outlined text-[16px]">
                        edit
                      </span>
                    </button>
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-onyx/30 hover:text-red-500 hover:bg-red-50 transition-all">
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === "notifications" && (
            <div className="space-y-2">
              <h2
                className="font-bold text-onyx text-lg border-b pb-3 mb-1"
                style={{
                  fontFamily: '"Roboto Slab",sans-serif',
                  borderColor: "#EDE3D2",
                }}
              >
                Notification Preferences
              </h2>
              <p className="text-sm text-onyx/50 pb-3">
                Choose which updates you want to receive.
              </p>
              {NOTIF_ITEMS.map((item) => (
                <Toggle
                  key={item.k}
                  label={item.l}
                  desc={item.d}
                  checked={notifs[item.k]}
                  onChange={(v) => setNotifs((n) => ({ ...n, [item.k]: v }))}
                />
              ))}
              <div className="pt-4">
                <button
                  onClick={save}
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
                      <span className="material-symbols-outlined text-[16px]">
                        save
                      </span>
                      Save Preferences
                    </>
                  )}
                </button>
                {saved && (
                  <span className="ml-3 text-emerald-600 text-sm font-semibold animate-scale-in inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] material-symbols-filled">
                      check_circle
                    </span>
                    Saved!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
