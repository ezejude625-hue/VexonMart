// ============================================================
// GET  /api/orders — list the current user's orders
// POST /api/orders — place a new order
// ============================================================
import { NextResponse } from "next/server";
import { prisma, serialize } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateOrderNumber, applyCoupon } from "@/lib/utils";

// ── GET ───────────────────────────────────────────────────────
export async function GET(req) {
  const user = await requireAuth(req);
  if (user instanceof NextResponse) return user;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: { productName: true, quantity: true, unitPrice: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: serialize(orders) });
  } catch (err) {
    console.error("[GET /api/orders]", err);
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
    const {
      coupon_code,
      address_id,
      payment_method = "stripe",
    } = await req.json();

    // Load the user's cart with product details
    const cart = await prisma.cart.findUnique({
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
                stock: true,
                productType: true,
              },
            },
          },
        },
      },
    });

    if (!cart || !cart.items.length)
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 },
      );

    // Calculate subtotal using effective price (sale price if lower)
    const subtotal = cart.items.reduce((sum, item) => {
      const price = parseFloat(item.product.salePrice || item.product.price);
      return sum + price * item.quantity;
    }, 0);

    // Validate and apply coupon if provided
    let discountAmount = 0;
    let couponId = null;

    if (coupon_code) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: coupon_code.toUpperCase(),
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          AND: [
            {
              OR: [
                { usageLimit: null },
                { usedCount: { lt: prisma.coupon.fields.usageLimit } },
              ],
            },
          ],
        },
      });

      // Simpler coupon lookup without nested Prisma field references
      const validCoupon = await prisma.coupon.findFirst({
        where: {
          code: coupon_code.toUpperCase(),
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      if (
        validCoupon &&
        (validCoupon.usageLimit === null ||
          validCoupon.usedCount < validCoupon.usageLimit) &&
        subtotal >= parseFloat(validCoupon.minOrderAmount || 0)
      ) {
        const { discount } = applyCoupon(
          subtotal,
          validCoupon.discountType,
          parseFloat(validCoupon.discountValue),
          validCoupon.maxDiscount ? parseFloat(validCoupon.maxDiscount) : null,
        );
        discountAmount = discount;
        couponId = validCoupon.id;
      }
    }

    const taxAmount = (subtotal - discountAmount) * 0.075;
    const shippingAmount = subtotal >= 100 ? 0 : 9.99;
    const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;
    const orderNumber = generateOrderNumber();

    // Use a Prisma transaction so all writes succeed or all roll back
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the order record
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.userId,
          couponId,
          addressId: address_id || null,
          subtotal,
          discountAmount,
          taxAmount,
          shippingAmount,
          totalAmount,
          status: "pending",
          paymentStatus: "unpaid",
          paymentMethod: payment_method,
        },
      });

      // 2. Create each line item
      for (const item of cart.items) {
        const unitPrice = parseFloat(
          item.product.salePrice || item.product.price,
        );
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.thumbnailUrl,
            quantity: item.quantity,
            unitPrice,
            totalPrice: unitPrice * item.quantity,
          },
        });

        // 3. Decrement stock for physical products (-1 stock = unlimited/digital)
        if (item.product.stock !== -1) {
          await tx.product.update({
            where: { id: item.product.id },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // 4. Increment coupon usage count
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // 5. Clear the cart items
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: { order_number: order.orderNumber },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
