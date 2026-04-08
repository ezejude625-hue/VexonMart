// Admin Customer Detail — src/app/admin/customers/[id]/page.js
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const C = {
  id: 1,
  name: "Amara Osei",
  email: "amara@example.com",
  phone: "+234 801 234 5678",
  status: "active",
  joined: "2023-11-01",
  last_login: "2024-03-01",
  orders: 12,
  spent: 1842.5,
  avg: 153.54,
  address: "14 Broad Street, Lagos Island, Lagos, Nigeria",
  orders_list: [
    {
      id: "VXM-20240301-A3K9",
      date: "2024-03-01",
      total: 329.31,
      status: "delivered",
      items: 2,
    },
    {
      id: "VXM-20240210-B7F2",
      date: "2024-02-10",
      total: 49.0,
      status: "delivered",
      items: 1,
    },
    {
      id: "VXM-20240115-C1M4",
      date: "2024-01-15",
      total: 189.99,
      status: "delivered",
      items: 1,
    },
    {
      id: "VXM-20231215-D9X1",
      date: "2023-12-15",
      total: 279.99,
      status: "refunded",
      items: 1,
    },
  ],
};
const STATUS_BADGE = {
  delivered: "badge-success",
  processing: "badge-info",
  shipped: "badge-warning",
  pending: "badge-neutral",
  refunded: "badge-error",
};

export default function AdminCustomerDetailPage({ params }) {
  return (
    <div className="space-y-5 max-w-[1100px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-onyx/50 hover:text-onyx hover:bg-wheat-dark transition-all"
            style={{ border: "1.5px solid #E2D5C0" }}
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
          </Link>
          <h1
            className="text-2xl font-black text-onyx"
            style={{
              fontFamily: '"Roboto Slab",sans-serif',
              letterSpacing: "-0.025em",
            }}
          >
            Customer Profile
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm h-10 gap-2">
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Email
          </button>
          <button className="btn-danger text-sm h-10 gap-2">
            <span className="material-symbols-outlined text-[16px]">block</span>
            Suspend
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="space-y-4">
          <div
            className="bg-white rounded-2xl p-6 text-center"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg,#003F47,#005566)",
                color: "#FFBD76",
              }}
            >
              {C.name.charAt(0)}
            </div>
            <p
              className="font-bold text-onyx text-lg"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              {C.name}
            </p>
            <p className="text-sm text-onyx/45 mt-0.5">{C.email}</p>
            <div className="flex justify-center gap-2 mt-3">
              <span
                className={`badge ${C.status === "active" ? "badge-success" : "badge-error"} capitalize`}
              >
                {C.status}
              </span>
              <span className="badge badge-info">
                <span className="material-symbols-outlined text-[11px] material-symbols-filled">
                  verified
                </span>
                Verified
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                { l: "Orders", v: C.orders },
                { l: "Spent", v: formatCurrency(C.spent) },
                { l: "Avg", v: formatCurrency(C.avg) },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl p-2 text-center"
                  style={{ background: "#F5EBD8" }}
                >
                  <p className="font-black text-onyx text-sm">{s.v}</p>
                  <p className="text-[10px] text-onyx/40 font-semibold">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-5 space-y-2.5"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <p
              className="font-bold text-onyx text-sm mb-1"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              Contact Info
            </p>
            {[
              { i: "mail", v: C.email },
              { i: "phone", v: C.phone },
              { i: "location_on", v: C.address },
            ].map(({ i, v }) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-onyx/55"
              >
                <span className="material-symbols-outlined text-oceanic text-[15px] mt-0.5 shrink-0">
                  {i}
                </span>
                {v}
              </div>
            ))}
          </div>

          <div
            className="bg-white rounded-2xl p-5 space-y-2"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <p
              className="font-bold text-onyx text-sm mb-1"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              Account
            </p>
            {[
              { l: "Joined", v: formatDate(C.joined) },
              { l: "Last Login", v: formatDate(C.last_login) },
              { l: "Avg Order", v: formatCurrency(C.avg) },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-onyx/45">{l}</span>
                <span className="font-semibold text-onyx">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders history */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                i: "receipt_long",
                l: "Total Orders",
                v: C.orders,
                c: "#003F47",
              },
              {
                i: "payments",
                l: "Total Spent",
                v: formatCurrency(C.spent),
                c: "#E8A355",
              },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-white rounded-2xl p-5"
                style={{
                  border: "1px solid #EDE3D2",
                  boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${s.c}12` }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ color: s.c, fontVariationSettings: "'FILL' 1" }}
                  >
                    {s.i}
                  </span>
                </div>
                <p
                  className="text-2xl font-black text-onyx tabular-nums"
                  style={{ fontFamily: '"Roboto Slab",sans-serif' }}
                >
                  {s.v}
                </p>
                <p className="text-[11px] text-onyx/40 font-semibold uppercase tracking-[0.06em] mt-0.5">
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <div
              className="px-5 py-4 border-b font-bold text-onyx flex items-center gap-2"
              style={{
                borderColor: "#EDE3D2",
                fontFamily: '"Roboto Slab",sans-serif',
              }}
            >
              <span className="material-symbols-outlined text-oceanic text-[17px]">
                history
              </span>
              Order History
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "#FAF4EC",
                    borderBottom: "1px solid #EDE3D2",
                  }}
                >
                  {["Order ID", "Date", "Items", "Total", "Status", ""].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.06em] ${i === 5 ? "text-right" : "text-left"}`}
                        style={{ color: "#6B7D8A" }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#F2EAE0" }}>
                {C.orders_list.map((o) => (
                  <tr
                    key={o.id}
                    className="transition-colors duration-150"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#FAF4EC")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "")
                    }
                  >
                    <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-oceanic">
                      {o.id.slice(-8)}
                    </td>
                    <td className="px-5 py-3.5 text-onyx/45">
                      {formatDate(o.date, { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 text-onyx/55">{o.items}</td>
                    <td className="px-5 py-3.5 font-bold text-onyx tabular-nums">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`badge capitalize ${STATUS_BADGE[o.status]}`}
                        style={{ fontSize: "11px" }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-xs font-bold text-oceanic hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="bg-white rounded-2xl p-5"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 10px rgba(10,23,29,0.05)",
            }}
          >
            <h2
              className="font-bold text-onyx text-sm mb-3 flex items-center gap-2"
              style={{ fontFamily: '"Roboto Slab",sans-serif' }}
            >
              <span className="material-symbols-outlined text-oceanic text-[16px]">
                sticky_note_2
              </span>
              Internal Notes
            </h2>
            <textarea
              rows={3}
              className="input-field resize-none py-3"
              style={{ height: "auto" }}
              placeholder="Add internal note about this customer…"
            />
            <button className="btn-secondary text-sm h-10 gap-2 mt-3">
              <span className="material-symbols-outlined text-[16px]">
                save
              </span>
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
