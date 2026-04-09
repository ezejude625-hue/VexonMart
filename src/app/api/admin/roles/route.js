import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

// Roles are enums in Prisma — not a separate DB table
// Return the enum values as the role list
export async function GET(req) {
  const user = await requireAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;
  return NextResponse.json({
    success: true,
    data: [
      { name: "admin", description: "Full system access" },
      { name: "customer", description: "Standard buyer" },
      { name: "vendor", description: "Seller — manage own products" },
      { name: "support", description: "Support staff — handle tickets" },
    ],
  });
}

export async function POST(req) {
  const user = await requireAuth(req, ["admin"]);
  if (user instanceof NextResponse) return user;
  return NextResponse.json(
    {
      success: false,
      message: "Roles are fixed enums — edit the Prisma schema to add new ones",
    },
    { status: 400 },
  );
}
