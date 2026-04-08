"use client";
// ============================================================
// ADMIN ROLES — src/app/admin/roles/page.js
// ============================================================

import { useState } from "react";

const PERMISSIONS = [
  {
    group: "Store",
    items: [
      "view_products",
      "manage_products",
      "manage_categories",
      "manage_coupons",
    ],
  },
  {
    group: "Orders",
    items: ["view_orders", "manage_orders", "process_refunds", "export_orders"],
  },
  {
    group: "Customers",
    items: ["view_customers", "manage_customers", "message_customers"],
  },
  {
    group: "Finance",
    items: [
      "view_revenue",
      "manage_expenses",
      "view_reports",
      "export_finance",
    ],
  },
  {
    group: "System",
    items: ["manage_roles", "manage_settings", "view_logs", "manage_vendors"],
  },
];

const INITIAL_ROLES = [
  {
    id: 1,
    name: "Admin",
    color: "#003F47",
    icon: "admin_panel_settings",
    desc: "Full system access — can manage everything",
    users: 2,
    system: true,
    perms: [
      "view_products",
      "manage_products",
      "manage_categories",
      "manage_coupons",
      "view_orders",
      "manage_orders",
      "process_refunds",
      "export_orders",
      "view_customers",
      "manage_customers",
      "message_customers",
      "view_revenue",
      "manage_expenses",
      "view_reports",
      "export_finance",
      "manage_roles",
      "manage_settings",
      "view_logs",
      "manage_vendors",
    ],
  },
  {
    id: 2,
    name: "Customer",
    color: "#059669",
    icon: "person",
    desc: "Standard buyer — shop, order, review products",
    users: 2841,
    system: true,
    perms: [],
  },
  {
    id: 3,
    name: "Vendor",
    color: "#7C3AED",
    icon: "storefront",
    desc: "Seller account — can list and manage own products",
    users: 14,
    system: false,
    perms: [
      "view_products",
      "manage_products",
      "view_orders",
      "view_customers",
      "view_revenue",
    ],
  },
  {
    id: 4,
    name: "Support",
    color: "#0ea5e9",
    icon: "support_agent",
    desc: "Customer support staff — handle tickets and orders",
    users: 5,
    system: false,
    perms: [
      "view_products",
      "view_orders",
      "manage_orders",
      "view_customers",
      "manage_customers",
      "message_customers",
    ],
  },
];

function formatPerm(perm) {
  return perm.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [activeRole, setActiveRole] = useState(INITIAL_ROLES[2]);
  const [showForm, setShowForm] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", desc: "" });
  const [saved, setSaved] = useState(false);

  function togglePerm(perm) {
    if (activeRole.system && activeRole.id === 1) return; // Protect admin role
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== activeRole.id) return r;
        const has = r.perms.includes(perm);
        const updated = {
          ...r,
          perms: has ? r.perms.filter((p) => p !== perm) : [...r.perms, perm],
        };
        setActiveRole(updated);
        return updated;
      }),
    );
  }

  async function savePerms() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    // In production: PATCH /api/admin/roles/:id
  }

  const allPerms = PERMISSIONS.flatMap((g) => g.items);

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
            Roles & Permissions
          </h1>
          <p className="text-onyx/45 text-sm mt-0.5">
            {roles.length} roles · control what each role can access
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-primary text-sm gap-2 h-10"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Create Role
        </button>
      </div>

      {/* New role form */}
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
              manage_accounts
            </span>
            New Role
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Role Name</label>
              <input
                value={newRole.name}
                onChange={(e) =>
                  setNewRole((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Content Manager"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <input
                value={newRole.desc}
                onChange={(e) =>
                  setNewRole((p) => ({ ...p, desc: e.target.value }))
                }
                placeholder="Brief description of this role"
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
              Create Role
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

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Role list */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-onyx/35 uppercase tracking-[0.1em] px-1 mb-3">
            Select a Role
          </p>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role)}
              className="w-full text-left rounded-2xl p-4 transition-all duration-150"
              style={{
                background: activeRole?.id === role.id ? "#003F47" : "#fff",
                border: `1.5px solid ${activeRole?.id === role.id ? "#003F47" : "#EDE3D2"}`,
                boxShadow:
                  activeRole?.id === role.id
                    ? "0 4px 16px rgba(0,63,71,0.25)"
                    : "0 2px 8px rgba(10,23,29,0.05)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      activeRole?.id === role.id
                        ? "rgba(255,189,118,0.2)"
                        : `${role.color}12`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{
                      color:
                        activeRole?.id === role.id ? "#FFBD76" : role.color,
                    }}
                  >
                    {role.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`font-bold text-sm ${activeRole?.id === role.id ? "text-white" : "text-onyx"}`}
                    >
                      {role.name}
                    </p>
                    {role.system && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide"
                        style={{
                          background:
                            activeRole?.id === role.id
                              ? "rgba(255,255,255,0.15)"
                              : "#F5EBD8",
                          color:
                            activeRole?.id === role.id ? "#FFF6E9" : "#9AAAB5",
                        }}
                      >
                        System
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 ${activeRole?.id === role.id ? "text-white/50" : "text-onyx/35"}`}
                  >
                    {role.users.toLocaleString()} user
                    {role.users !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Permissions panel */}
        <div
          className="lg:col-span-3 bg-white rounded-2xl overflow-hidden"
          style={{
            border: "1px solid #EDE3D2",
            boxShadow: "0 2px 12px rgba(10,23,29,0.06)",
          }}
        >
          {activeRole ? (
            <>
              {/* Role header */}
              <div
                className="px-6 py-5 border-b flex items-center gap-4"
                style={{ borderColor: "#EDE3D2", background: "#FAF4EC" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${activeRole.color}14`,
                    border: `1px solid ${activeRole.color}22`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ color: activeRole.color }}
                  >
                    {activeRole.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2
                      className="font-black text-onyx text-lg"
                      style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                    >
                      {activeRole.name}
                    </h2>
                    {activeRole.system && (
                      <span
                        className="badge badge-neutral"
                        style={{ fontSize: "10px" }}
                      >
                        System Role
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-onyx/50 mt-0.5">
                    {activeRole.desc}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className="text-2xl font-black text-onyx tabular-nums"
                    style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                  >
                    {activeRole.perms.length}/{allPerms.length}
                  </p>
                  <p className="text-[11px] text-onyx/35">permissions</p>
                </div>
              </div>

              {/* Admin lock notice */}
              {activeRole.system && activeRole.id === 1 && (
                <div
                  className="mx-6 mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: "rgba(0,63,71,0.06)",
                    border: "1px solid rgba(0,63,71,0.15)",
                  }}
                >
                  <span className="material-symbols-outlined text-oceanic text-[18px] material-symbols-filled">
                    lock
                  </span>
                  <p className="text-onyx/65">
                    Admin role has all permissions by default and cannot be
                    restricted.
                  </p>
                </div>
              )}

              {/* Permission groups */}
              <div className="p-6 space-y-6">
                {PERMISSIONS.map((group) => (
                  <div key={group.group}>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-[11px] font-bold text-onyx/35 uppercase tracking-[0.1em]">
                        {group.group}
                      </p>
                      <div className="flex-1 h-px bg-wheat-dark" />
                      <p className="text-[11px] text-onyx/25">
                        {
                          group.items.filter((p) =>
                            activeRole.perms.includes(p),
                          ).length
                        }
                        /{group.items.length}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.items.map((perm) => {
                        const enabled = activeRole.perms.includes(perm);
                        const locked = activeRole.system && activeRole.id === 1;
                        return (
                          <div
                            key={perm}
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-150"
                            style={{
                              background: enabled
                                ? "rgba(0,63,71,0.05)"
                                : "#FAF4EC",
                              border: `1px solid ${enabled ? "rgba(0,63,71,0.15)" : "#EDE3D2"}`,
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{
                                  background: enabled
                                    ? "rgba(0,63,71,0.10)"
                                    : "#F5EBD8",
                                }}
                              >
                                <span
                                  className="material-symbols-outlined text-[14px]"
                                  style={{
                                    color: enabled ? "#003F47" : "#9AAAB5",
                                  }}
                                >
                                  {enabled ? "check" : "close"}
                                </span>
                              </div>
                              <span
                                className="text-sm font-medium"
                                style={{
                                  color: enabled ? "#0A171D" : "#9AAAB5",
                                }}
                              >
                                {formatPerm(perm)}
                              </span>
                            </div>
                            {/* Toggle */}
                            <button
                              type="button"
                              onClick={() => togglePerm(perm)}
                              disabled={locked}
                              className="relative w-10 h-5 rounded-full transition-all duration-200 shrink-0"
                              style={{
                                background: enabled ? "#003F47" : "#E2D5C0",
                                opacity: locked ? 0.5 : 1,
                                cursor: locked ? "not-allowed" : "pointer",
                                boxShadow: enabled
                                  ? "0 2px 8px rgba(0,63,71,0.3)"
                                  : "",
                              }}
                            >
                              <span
                                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
                                style={{
                                  transform: enabled
                                    ? "translateX(20px)"
                                    : "translateX(0)",
                                }}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save footer */}
              {!activeRole.system || activeRole.id !== 1 ? (
                <div
                  className="px-6 py-4 border-t flex items-center justify-between"
                  style={{ borderColor: "#EDE3D2", background: "#FAF4EC" }}
                >
                  <p className="text-xs text-onyx/40">
                    Changes take effect immediately for all users with this
                    role.
                  </p>
                  <div className="flex items-center gap-3">
                    {saved && (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold animate-scale-in">
                        <span className="material-symbols-outlined text-[15px] material-symbols-filled">
                          check_circle
                        </span>
                        Saved!
                      </span>
                    )}
                    <button
                      onClick={savePerms}
                      className="btn-primary text-sm h-9 px-5 gap-2"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        save
                      </span>
                      Save Permissions
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <span className="material-symbols-outlined text-5xl text-onyx/12 block mb-2">
                  manage_accounts
                </span>
                <p className="text-onyx/35 font-semibold">
                  Select a role to edit permissions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
