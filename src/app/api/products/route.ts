import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
