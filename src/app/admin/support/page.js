"use client";
// ============================================================
// ADMIN SUPPORT — src/app/admin/support/page.js
// ============================================================

import { useState } from "react";
import { formatDate } from "@/lib/utils";

const TICKETS = [
  {
    id: "TKT-001",
    subject: "Order not received after 2 weeks",
    user: "Amara Osei",
    email: "amara@example.com",
    status: "open",
    priority: "urgent",
    cat: "Delivery",
    date: "2024-03-01",
    msgs: [
      {
        from: "Amara Osei",
        body: "I ordered Sony headphones 2 weeks ago but have not received them. Order VXM-20240301-A3K9.",
        date: "2024-03-01",
        staff: false,
      },
      {
        from: "Support Team",
        body: "Hi Amara, we apologize for the delay. We've escalated this to our logistics team and will provide an update within 24 hours.",
        date: "2024-03-02",
        staff: true,
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Received wrong product in package",
    user: "Lucas Ferreira",
    email: "lucas@example.com",
    status: "in_progress",
    priority: "high",
    cat: "Products",
    date: "2024-02-29",
    msgs: [
      {
        from: "Lucas Ferreira",
        body: "I ordered a yoga mat but received a desk lamp instead. Please advise on how to return and get the correct item.",
        date: "2024-02-29",
        staff: false,
      },
      {
        from: "Support Team",
        body: "Hi Lucas, we're sorry for the mix-up. A prepaid return label has been emailed to you. The correct item will ship same day we receive your return.",
        date: "2024-03-01",
        staff: true,
      },
    ],
  },
  {
    id: "TKT-003",
    subject: "Payment deducted but no confirmation",
    user: "James Carter",
    email: "james@example.com",
    status: "open",
    priority: "urgent",
    cat: "Payment",
    date: "2024-02-28",
    msgs: [
      {
        from: "James Carter",
        body: "My card was charged $629.97 but I never received an order confirmation email and nothing appears in my dashboard.",
        date: "2024-02-28",
        staff: false,
      },
    ],
  },
  {
    id: "TKT-004",
    subject: "How do I apply a coupon code?",
    user: "Priya Mehta",
    email: "priya@example.com",
    status: "resolved",
    priority: "low",
    cat: "General",
    date: "2024-02-27",
    msgs: [
      {
        from: "Priya Mehta",
        body: "I have a coupon code WELCOME10 but cannot figure out where to enter it during checkout.",
        date: "2024-02-27",
        staff: false,
      },
      {
        from: "Support Team",
        body: "Hi Priya! You can enter your coupon code in the cart page, just below the order summary on the right side. Hope that helps!",
        date: "2024-02-27",
        staff: true,
      },
    ],
  },
  {
    id: "TKT-005",
    subject: "Request for product refund",
    user: "Sofia Novak",
    email: "sofia@example.com",
    status: "in_progress",
    priority: "high",
    cat: "Refunds",
    date: "2024-02-26",
    msgs: [
      {
        from: "Sofia Novak",
        body: "I'd like to request a refund for my recent order. The product quality did not match the description on the listing.",
        date: "2024-02-26",
        staff: false,
      },
      {
        from: "Support Team",
        body: "Hi Sofia, we understand and apologize for this experience. A full refund has been initiated. Please allow 3–5 business days for it to appear on your statement.",
        date: "2024-02-27",
        staff: true,
      },
    ],
  },
];

const STATUS_STYLES = {
  open: { badge: "badge-error", dot: "#ef4444", label: "Open" },
  in_progress: { badge: "badge-warning", dot: "#f59e0b", label: "In Progress" },
  resolved: { badge: "badge-success", dot: "#22c55e", label: "Resolved" },
  closed: { badge: "badge-neutral", dot: "#9ca3af", label: "Closed" },
};

const PRIORITY_COLOR = {
  urgent: "#ef4444",
  high: "#f59e0b",
  medium: "#0ea5e9",
  low: "#9ca3af",
};

const FILTER_TABS = ["all", "open", "in_progress", "resolved", "closed"];

export default function AdminSupportPage() {
  const [statusF, setStatusF] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(TICKETS[0]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [tickets, setTickets] = useState(TICKETS);

  const filtered = tickets.filter(
    (t) =>
      (statusF === "all" || t.status === statusF) &&
      (!search ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())),
  );

  const openCount = tickets.filter((t) => t.status === "open").length;
  const urgentCount = tickets.filter(
    (t) =>
      t.priority === "urgent" &&
      t.status !== "resolved" &&
      t.status !== "closed",
  ).length;

  async function handleSend(e) {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? {
              ...t,
              msgs: [
                ...t.msgs,
                {
                  from: "Support Team",
                  body: reply,
                  date: new Date().toISOString().slice(0, 10),
                  staff: true,
                },
              ],
              status: "in_progress",
            }
          : t,
      ),
    );
    setSelected((prev) =>
      prev
        ? {
            ...prev,
            msgs: [
              ...prev.msgs,
              {
                from: "Support Team",
                body: reply,
                date: new Date().toISOString().slice(0, 10),
                staff: true,
              },
            ],
            status: "in_progress",
          }
        : prev,
    );
    setSending(false);
    setReply("");
  }

  function changeStatus(ticketId, newStatus) {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)),
    );
    if (selected?.id === ticketId)
      setSelected((prev) => (prev ? { ...prev, status: newStatus } : prev));
  }

  return (
    <div className="space-y-5 max-w-[1400px]">
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
            Support Tickets
          </h1>
          <p className="text-sm mt-0.5">
            <span className="text-red-500 font-semibold">{openCount} open</span>
            <span className="text-onyx/30 mx-1.5">·</span>
            <span className="text-amber-500 font-semibold">
              {urgentCount} urgent
            </span>
          </p>
        </div>
        <button className="btn-primary text-sm gap-2 h-10">
          <span className="material-symbols-outlined text-[16px]">
            download
          </span>
          Export
        </button>
      </div>

      {/* Filter bar */}
      <div
        className="bg-white rounded-2xl p-4 flex flex-wrap gap-3"
        style={{
          border: "1px solid #EDE3D2",
          boxShadow: "0 2px 8px rgba(10,23,29,0.05)",
        }}
      >
        <div className="flex flex-wrap gap-1.5">
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setStatusF(t)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-150"
              style={{
                background: statusF === t ? "#003F47" : "#F5EBD8",
                color: statusF === t ? "#FFF6E9" : "#6B7D8A",
                boxShadow: statusF === t ? "0 2px 8px rgba(0,63,71,0.25)" : "",
              }}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[160px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-onyx/30 text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="w-full h-9 pl-9 pr-4 rounded-xl text-sm outline-none"
            style={{ background: "#F5EBD8", border: "1.5px solid transparent" }}
            onFocus={(e) => {
              e.target.style.borderColor = "#003F47";
              e.target.style.boxShadow = "0 0 0 3px rgba(0,63,71,0.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "transparent";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-5">
        {/* Ticket list */}
        <div
          className={`flex flex-col gap-2 ${selected ? "hidden lg:flex lg:w-96 shrink-0" : "flex-1"}`}
        >
          {filtered.length === 0 ? (
            <div
              className="bg-white rounded-2xl py-16 text-center"
              style={{ border: "1px solid #EDE3D2" }}
            >
              <span className="material-symbols-outlined text-5xl text-onyx/12 block mb-2">
                support_agent
              </span>
              <p className="text-onyx/35 font-semibold">No tickets found</p>
            </div>
          ) : (
            filtered.map((t) => {
              const s = STATUS_STYLES[t.status];
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="w-full text-left bg-white rounded-2xl p-4 transition-all duration-150"
                  style={{
                    border: `1.5px solid ${selected?.id === t.id ? "#003F47" : "#EDE3D2"}`,
                    boxShadow:
                      selected?.id === t.id
                        ? "0 4px 16px rgba(0,63,71,0.15)"
                        : "0 2px 8px rgba(10,23,29,0.05)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Priority dot */}
                    <div
                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ background: PRIORITY_COLOR[t.priority] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-onyx text-sm leading-snug line-clamp-2">
                          {t.subject}
                        </p>
                        <span
                          className={`badge shrink-0 ${s.badge}`}
                          style={{ fontSize: "10px" }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-onyx/45 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">
                            person
                          </span>
                          {t.user}
                        </span>
                        <span className="text-[11px] font-mono text-onyx/30">
                          {t.id}
                        </span>
                        <span
                          className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md capitalize"
                          style={{
                            background: `${PRIORITY_COLOR[t.priority]}12`,
                            color: PRIORITY_COLOR[t.priority],
                          }}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-onyx/35 mt-1">
                        {formatDate(t.date, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Ticket detail */}
        {selected && (
          <div
            className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col"
            style={{
              border: "1px solid #EDE3D2",
              boxShadow: "0 2px 16px rgba(10,23,29,0.08)",
            }}
          >
            {/* Thread header */}
            <div
              className="px-5 py-4 border-b flex items-center gap-3"
              style={{ borderColor: "#EDE3D2", background: "#FAF4EC" }}
            >
              <button
                onClick={() => setSelected(null)}
                className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl text-onyx/50 hover:bg-wheat-dark transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-onyx text-sm truncate">
                  {selected.subject}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[11px] text-onyx/45">
                    {selected.id}
                  </span>
                  <span className="text-[11px] text-onyx/45">·</span>
                  <span className="text-[11px] text-onyx/45">
                    {selected.user}
                  </span>
                  <span className="text-[11px] text-onyx/45">·</span>
                  <span
                    className="text-[11px] font-semibold capitalize"
                    style={{ color: PRIORITY_COLOR[selected.priority] }}
                  >
                    {selected.priority} priority
                  </span>
                </div>
              </div>
              {/* Status selector */}
              <select
                value={selected.status}
                onChange={(e) => changeStatus(selected.id, e.target.value)}
                className="h-8 px-2.5 rounded-xl text-xs font-semibold outline-none border cursor-pointer"
                style={{
                  background: "#fff",
                  borderColor: "#E2D5C0",
                  color: "#3D5060",
                }}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Close</option>
              </select>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0"
              style={{ maxHeight: "400px" }}
            >
              {selected.msgs.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.staff ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black"
                    style={{
                      background: msg.staff ? "#003F47" : "#F5EBD8",
                      color: msg.staff ? "#FFBD76" : "#3D5060",
                    }}
                  >
                    {msg.staff ? (
                      <span className="material-symbols-outlined text-[16px]">
                        support_agent
                      </span>
                    ) : (
                      selected.user.charAt(0)
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] flex flex-col gap-1 ${msg.staff ? "items-end" : ""}`}
                  >
                    <div
                      className="px-4 py-3 text-sm leading-relaxed"
                      style={{
                        background: msg.staff ? "#003F47" : "#F5EBD8",
                        color: msg.staff ? "#FFF6E9" : "#0A171D",
                        borderRadius: msg.staff
                          ? "20px 6px 20px 20px"
                          : "6px 20px 20px 20px",
                        boxShadow: msg.staff
                          ? "0 2px 12px rgba(0,63,71,0.25)"
                          : "0 2px 8px rgba(10,23,29,0.07)",
                      }}
                    >
                      {msg.body}
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] text-onyx/35">
                        {msg.staff ? "Support Team" : selected.user}
                      </span>
                      <span className="text-[10px] text-onyx/25">
                        {formatDate(msg.date, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <div
              className="border-t p-4"
              style={{ borderColor: "#EDE3D2", background: "#FAF4EC" }}
            >
              <form onSubmit={handleSend} className="space-y-3">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                  placeholder="Type your reply to the customer…"
                  className="input-field resize-none py-3 text-sm"
                  style={{ height: "auto" }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {["attach_file", "emoji_emotions", "link"].map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-onyx/30 hover:text-oceanic hover:bg-oceanic/10 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {icon}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="btn-primary text-sm h-9 px-4 gap-1.5"
                  >
                    {sending ? (
                      <>
                        <span className="material-symbols-outlined text-[15px] animate-spin-smooth">
                          progress_activity
                        </span>
                        Sending…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[15px]">
                          send
                        </span>
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
