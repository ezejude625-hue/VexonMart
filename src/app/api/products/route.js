// ============================================================
// GET  /api/products — list & search products
// POST /api/products — create product (vendor / admin)
// ============================================================
import { NextResponse } from "next/server";
import { prisma, paginate, buildPagination, serialize } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const filter = searchParams.get("filter") || "";
  const sort = searchParams.get("sort") || "newest";

  try {
    // Build the where clause dynamically
    const where = { status: "active" };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { shortDesc: { contains: q, mode: "insensitive" } },
        { tags: { has: q.toLowerCase() } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (filter === "sale") {
      where.salePrice = { not: null };
    }
    if (filter === "new") {
      where.createdAt = {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };
    }
    if (filter === "popular") {
      where.totalSales = { gt: 10 };
    }

    // Build orderBy
    const orderByMap = {
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
      rating: { avgRating: "desc" },
      popular: { totalSales: "desc" },
      newest: { createdAt: "desc" },
    };
    const orderBy = orderByMap[sort] || { createdAt: "desc" };

    const { data, total } = await paginate(
      prisma.product,
      {
        where,
        orderBy,
        include: {
          category: { select: { name: true, slug: true } },
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
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  const user = await requireAuth(req, ["admin", "vendor"]);
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

    // Append timestamp to slug to guarantee uniqueness
    const slug = `${slugify(name)}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        sellerId: user.userId,
        categoryId: category_id || null,
        name,
        slug,
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
      {
        success: true,
        message: "Product created",
        data: serialize({ id: product.id, slug: product.slug }),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/products]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
