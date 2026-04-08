// ============================================================
// STORE LAYOUT — src/app/(store)/layout.js
// ============================================================
// Wraps all public storefront pages with Navbar + Footer.
// ============================================================

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Page ─────────────────────────────────────────────────────

export const metadata = {
  title: "VexonMart — Shop Smarter. Live Better.",
  description:
    "Discover premium products across every category. Electronics, fashion, digital goods and more — fast delivery, world-class service.",
};

export default function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 page-enter">{children}</main>
      <Footer />
    </>
  );
}
