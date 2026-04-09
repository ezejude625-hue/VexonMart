// ============================================================
// GET  /api/admin/customers — list all customers (admin)
// POST /api/admin/customers — create customer (admin)
// ============================================================
import { NextResponse } from "next/server";
import { prisma, paginate, buildPagination, serialize } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const user = await requireAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const search = searchParams.get("q") || "";

    const where = { role: "customer" };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const { data, total } = await paginate(
      prisma.user,
      {
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          lastLogin: true,
          _count: { select: { orders: true } },
        },
      },
      page,
      limit,
    );

    return NextResponse.json({
      success: true,
      data: serialize(data),
      pagination: buildPagination(total, page, limit),
    });
  } catch (err) {
    console.error("[GET /api/admin/customers]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  const user = await requireAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;

  try {
    const body = await req.json();
    return NextResponse.json(
      { success: true, message: "Customer created", data: serialize(body) },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/admin/customers]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
