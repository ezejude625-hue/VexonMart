// ============================================================
// PRISMA CLIENT — src/lib/prisma.js
// ============================================================
// Singleton Prisma client for PostgreSQL.
// Replaces src/lib/db.js entirely.
// Import { prisma } wherever you need database access.
// ============================================================

import { PrismaClient } from "@prisma/client/edge";

// ── Singleton pattern ─────────────────────────────────────────
// In Next.js dev mode, hot-reload creates new module instances
// on every file change. Without this pattern you'd exhaust the
// PostgreSQL connection pool very quickly.
//
// The trick: attach the client to the global object (which
// persists across hot-reloads) and reuse it if it exists.

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"] // Show SQL in dev terminal
        : ["error"], // Errors only in production
  });

// Only cache on the global in development
// In production each serverless function gets its own instance
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ── paginate() ────────────────────────────────────────────────
// Generic pagination helper — works with any Prisma model.
//
// Usage:
//   const { data, total } = await paginate(
//     prisma.product,           // the model delegate
//     { where: { status: 'active' } },  // findMany options
//     page,
//     limit
//   )
export async function paginate(model, options = {}, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  // Run count and data fetch in parallel for speed
  const [total, data] = await Promise.all([
    model.count({ where: options.where }),
    model.findMany({ ...options, skip, take: limit }),
  ]);

  return { data, total };
}

// ── buildPagination() ─────────────────────────────────────────
// Build the pagination meta object returned in API responses.
export function buildPagination(total, page, limit) {
  const total_pages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    total_pages,
    has_next: page < total_pages,
    has_prev: page > 1,
  };
}

// ── serialize() ───────────────────────────────────────────────
// Prisma returns Decimal and BigInt types that don't serialize
// to JSON cleanly. Run any Prisma result through this function
// before sending it in a NextResponse.
//
// Usage: return NextResponse.json({ data: serialize(product) })
export function serialize(data) {
  return JSON.parse(
    JSON.stringify(data, (_, value) => {
      // Decimal → plain JS number
      if (
        typeof value === "object" &&
        value !== null &&
        value.constructor?.name === "Decimal"
      ) {
        return parseFloat(value.toString());
      }
      // BigInt → number
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    }),
  );
}

export default prisma;
