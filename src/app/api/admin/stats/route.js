// ============================================================
// GET /api/admin/stats — dashboard KPI data
// ============================================================
import { NextResponse } from "next/server";
import { prisma, serialize } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const user = await requireAuth(req, ["admin", "support"]);
  if (user instanceof NextResponse) return user;

  try {
    const now = new Date();
    const thirtyDays = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sixtyDays = new Date(now - 60 * 24 * 60 * 60 * 1000);

    // Run all queries in parallel for speed
    const [revenueData, lastMonthData, customerCount, productCount] =
      await Promise.all([
        // Revenue + order count for the last 30 days
        prisma.order.aggregate({
          where: {
            paymentStatus: "paid",
            createdAt: { gte: thirtyDays },
          },
          _sum: { totalAmount: true },
          _count: { id: true },
        }),

        // Revenue for the 30 days before that (for % change calc)
        prisma.order.aggregate({
          where: {
            paymentStatus: "paid",
            createdAt: { gte: sixtyDays, lt: thirtyDays },
          },
          _sum: { totalAmount: true },
        }),

        // Total active customer accounts
        prisma.user.count({
          where: { role: "customer", isActive: true },
        }),

        // Total active products listed
        prisma.product.count({
          where: { status: "active" },
        }),
      ]);

    const thisRevenue = parseFloat(revenueData._sum.totalAmount || 0);
    const lastRevenue = parseFloat(lastMonthData._sum.totalAmount || 0);

    const revenueChange =
      lastRevenue > 0
        ? Math.round(((thisRevenue - lastRevenue) / lastRevenue) * 100)
        : 100; // If no data last month, treat it as 100% growth

    return NextResponse.json({
      success: true,
      data: {
        total_revenue: thisRevenue,
        revenue_change: revenueChange,
        total_orders: revenueData._count.id,
        total_customers: customerCount,
        total_products: productCount,
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
