// ============================================================
// GET    /api/wishlist — get user's wishlist
// POST   /api/wishlist — add product to wishlist
// DELETE /api/wishlist — remove product from wishlist
// ============================================================
import { NextResponse } from "next/server";
import { prisma, serialize } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// ── GET ───────────────────────────────────────────────────────
export async function GET(req) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: user.userId },
      orderBy: { addedAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            salePrice: true,
            thumbnailUrl: true,
            avgRating: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: serialize(items) });
  } catch (err) {
    console.error("[GET /api/wishlist]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// ── POST ──────────────────────────────────────────────────────
export async function POST(req) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    const { product_id } = await req.json();

    if (!product_id)
      return NextResponse.json(
        { success: false, message: "product_id is required" },
        { status: 400 },
      );

    // createMany with skipDuplicates replaces MySQL's INSERT IGNORE
    await prisma.wishlist.upsert({
      where: {
        userId_productId: { userId: user.userId, productId: product_id },
      },
      create: { userId: user.userId, productId: product_id },
      update: {}, // already exists — do nothing
    });

    return NextResponse.json({ success: true, message: "Added to wishlist" });
  } catch (err) {
    console.error("[POST /api/wishlist]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// ── DELETE ────────────────────────────────────────────────────
export async function DELETE(req) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    const product_id = parseInt(
      new URL(req.url).searchParams.get("product_id"),
    );

    if (!product_id)
      return NextResponse.json(
        { success: false, message: "product_id is required" },
        { status: 400 },
      );

    await prisma.wishlist.deleteMany({
      where: { userId: user.userId, productId: product_id },
    });

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (err) {
    console.error("[DELETE /api/wishlist]", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
