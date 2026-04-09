import { NextResponse } from "next/server";
import { prisma, serialize } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const user = await requireAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;
  try {
    const [gross, expenses] = await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: "paid" },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
    ]);
    const grossRevenue = parseFloat(gross._sum.totalAmount || 0);
    const totalExpenses = parseFloat(expenses._sum.amount || 0);
    return NextResponse.json({
      success: true,
      data: {
        gross_revenue: grossRevenue,
        net_revenue: grossRevenue - totalExpenses,
        total_orders: gross._count.id,
        total_expenses: totalExpenses,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
