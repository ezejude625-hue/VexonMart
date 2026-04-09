// ============================================================
// GET  /api/admin/products — list all products (admin)
// POST /api/admin/products — create product (admin)
// ============================================================
import { NextResponse } from "next/server";
import { prisma, paginate, buildPagination, serialize } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req) {
  const user = await requireAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const search = searchParams.get("q") || "";
    const status = searchParams.get("status") || "";

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const { data, total } = await paginate(
      prisma.product,
      {
        where,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          seller: { select: { firstName: true, lastName: true } },
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
    console.error("[GET /api/admin/products]", err);
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
      name,
      price,
      description,
      short_desc,
      category_id,
      product_type = "physical",
      stock = 1,
      sku,
      status = "draft",
      is_featured = false,
      sale_price,
      thumbnail_url,
    } = body;

    if (!name || !price)
      return NextResponse.json(
        { success: false, message: "Name and price are required" },
        { status: 400 },
      );

    const product = await prisma.product.create({
      data: {
        sellerId: user.userId,
        categoryId: category_id || null,
        name,
        slug: `${slugify(name)}-${Date.now()}`,
        description: description || null,
        shortDesc: short_desc || null,
        price,
        salePrice: sale_price || null,
        thumbnailUrl: thumbnail_url || null,
        productType: product_type,
        stock,
        sku: sku || null,
        status,
        isFeatured: is_featured,
      },
    });

    return NextResponse.json(
      { success: true, message: "Product created", data: serialize(product) },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/admin/products]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
