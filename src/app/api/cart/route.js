// ============================================================
// GET    /api/cart — fetch user's cart with product details
// POST   /api/cart — add a product to cart
// PUT    /api/cart — update quantity of a cart item
// DELETE /api/cart — remove a product from cart
// ============================================================
import { NextResponse } from "next/server";
import { prisma, serialize } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// ── GET ───────────────────────────────────────────────────────
export async function GET(req) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    // Find or create cart for this user
    let cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                salePrice: true,
                thumbnailUrl: true,
                productType: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    // First time — create an empty cart
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.userId },
        include: { items: true },
      });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product_id: item.product.id,
      name: item.product.name,
      price: parseFloat(item.product.salePrice || item.product.price),
      sale_price: item.product.salePrice
        ? parseFloat(item.product.salePrice)
        : null,
      thumbnail_url: item.product.thumbnailUrl,
      product_type: item.product.productType,
      stock: item.product.stock,
    }));

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const item_count = items.reduce((s, i) => s + i.quantity, 0);

    return NextResponse.json({
      success: true,
      data: { items, subtotal, item_count },
    });
  } catch (err) {
    console.error("[GET /api/cart]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// ── POST ──────────────────────────────────────────────────────
export async function POST(req) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    const { product_id, quantity = 1 } = await req.json();

    if (!product_id)
      return NextResponse.json(
        { success: false, message: "product_id is required" },
        { status: 400 },
      );

    // Ensure cart exists (upsert = create if not found)
    const cart = await prisma.cart.upsert({
      where: { userId: user.userId },
      create: { userId: user.userId },
      update: {},
    });

    // Upsert the cart item — if it already exists, increment quantity
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId: product_id },
      },
      create: {
        cartId: cart.id,
        productId: product_id,
        quantity,
      },
      update: {
        // Increment existing quantity instead of replacing it
        quantity: { increment: quantity },
      },
    });

    return NextResponse.json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.error("[POST /api/cart]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// ── PUT ───────────────────────────────────────────────────────
export async function PUT(req) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    const { product_id, quantity } = await req.json();

    if (!product_id || quantity < 1)
      return NextResponse.json(
        { success: false, message: "Valid product_id and quantity required" },
        { status: 400 },
      );

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
    });
    if (!cart)
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 },
      );

    await prisma.cartItem.updateMany({
      where: { cartId: cart.id, productId: product_id },
      data: { quantity },
    });

    return NextResponse.json({ success: true, message: "Cart updated" });
  } catch (err) {
    console.error("[PUT /api/cart]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
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

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
    });
    if (!cart)
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 },
      );

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId: product_id },
    });

    return NextResponse.json({ success: true, message: "Item removed" });
  } catch (err) {
    console.error("[DELETE /api/cart]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
