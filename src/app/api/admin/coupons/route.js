// ============================================================
// GET   /api/admin/coupons — list all coupons (admin)
// POST  /api/admin/coupons — create coupon (admin)
// PATCH /api/admin/coupons — toggle active status (admin)
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

    const { data, total } = await paginate(
      prisma.coupon,
      { orderBy: { createdAt: "desc" } },
      page,
      limit,
    );

    return NextResponse.json({
      success: true,
      data: serialize(data),
      pagination: buildPagination(total, page, limit),
    });
  } catch (err) {
    console.error("[GET /api/admin/coupons]", err);
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
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount = 0,
      max_discount,
      usage_limit,
      starts_at,
      expires_at,
    } = body;

    if (!code || !discount_type || !discount_value)
      return NextResponse.json(
        {
          success: false,
          message: "code, discount_type, and discount_value are required",
        },
        { status: 400 },
      );

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description || null,
        discountType: discount_type,
        discountValue: discount_value,
        minOrderAmount: min_order_amount,
        maxDiscount: max_discount || null,
        usageLimit: usage_limit || null,
        startsAt: starts_at ? new Date(starts_at) : null,
        expiresAt: expires_at ? new Date(expires_at) : null,
        isActive: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Coupon created", data: serialize(coupon) },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/admin/coupons]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  const user = await requireAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;

  try {
    const { id, is_active } = await req.json();
    if (!id)
      return NextResponse.json(
        { success: false, message: "id is required" },
        { status: 400 },
      );

    const coupon = await prisma.coupon.update({
      where: { id },
      data: { isActive: is_active },
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${coupon.isActive ? "activated" : "paused"}`,
      data: serialize(coupon),
    });
  } catch (err) {
    console.error("[PATCH /api/admin/coupons]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
