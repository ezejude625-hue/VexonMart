// ============================================================
// UTILITIES — src/lib/utils.js
// ============================================================
// Shared helper functions used across frontend and backend.
// ============================================================

/* ─── cn() ───────────────────────────────────────────────── */
// Combine Tailwind class names, filtering out falsy values.
// cn('base', isActive && 'active', className)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/* ─── formatCurrency() ───────────────────────────────────── */
// Format a number as a USD currency string.
// formatCurrency(1999.5) → "$1,999.50"
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style:                 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/* ─── formatDate() ───────────────────────────────────────── */
// Format a date string or Date object into readable form.
// formatDate('2024-01-15') → "Jan 15, 2024"
export function formatDate(date, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

/* ─── slugify() ──────────────────────────────────────────── */
// Convert a string to a URL-safe slug.
// slugify("Hello World!") → "hello-world"
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* ─── truncate() ─────────────────────────────────────────── */
// Truncate a string with ellipsis.
// truncate("Hello World", 8) → "Hello..."
export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 3)}...`
}

/* ─── capitalize() ───────────────────────────────────────── */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/* ─── generateOrderNumber() ──────────────────────────────── */
// Generate a unique order number.
// Format: VXM-YYYYMMDD-XXXX
export function generateOrderNumber() {
  const d      = new Date()
  const date   = [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('')
  const suffix = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `VXM-${date}-${suffix}`
}

/* ─── buildPagination() ──────────────────────────────────── */
// Build pagination metadata for API responses.
export function buildPagination(total, page, limit) {
  const total_pages = Math.ceil(total / limit)
  return {
    page, limit, total, total_pages,
    has_next: page < total_pages,
    has_prev: page > 1,
  }
}

/* ─── isValidEmail() ─────────────────────────────────────── */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/* ─── isStrongPassword() ─────────────────────────────────── */
// At least 8 chars, one uppercase, one lowercase, one digit.
export function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

/* ─── applyCoupon() ──────────────────────────────────────── */
// Calculate discount and final price from a coupon.
// Returns { discount, finalPrice }
export function applyCoupon(subtotal, discountType, discountValue, maxDiscount) {
  let discount = 0

  if (discountType === 'percentage') {
    discount = (subtotal * discountValue) / 100
    if (maxDiscount) discount = Math.min(discount, maxDiscount)
  } else {
    discount = Math.min(discountValue, subtotal)
  }

  return {
    discount:   Math.round(discount * 100) / 100,
    finalPrice: Math.max(0, subtotal - discount),
  }
}

/* ─── getEffectivePrice() ────────────────────────────────── */
// Return sale price if it's lower, otherwise regular price.
export function getEffectivePrice(price, salePrice) {
  return salePrice && salePrice < price ? salePrice : price
}

/* ─── getDiscountPercent() ───────────────────────────────── */
export function getDiscountPercent(price, salePrice) {
  if (salePrice >= price) return 0
  return Math.round(((price - salePrice) / price) * 100)
}
