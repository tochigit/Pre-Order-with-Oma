import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Admin password check helper
function isAdminAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("x-admin-token");
  const adminPassword = process.env.ADMIN_PASSWORD || "OmaAdmin2024!";
  return authHeader === adminPassword;
}

// GET all products (including unpublished) for admin
export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await db.product.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const stats = {
      total: products.length,
      published: products.filter((p) => p.isPublished).length,
      draft: products.filter((p) => !p.isPublished).length,
      byCategory: {
        handbags: products.filter((p) => p.category === "handbags").length,
        shoes: products.filter((p) => p.category === "shoes").length,
        accessories: products.filter((p) => p.category === "accessories").length,
        new_arrivals: products.filter((p) => p.category === "new_arrivals").length,
      },
    };
    return NextResponse.json({ products, stats });
  } catch (error) {
    console.error("Failed to fetch admin products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, price, description, category, imageUrl, badge, isPublished, sortOrder } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        price: parseFloat(String(price)),
        description: description || "",
        category: category || "accessories",
        imageUrl: imageUrl || "",
        badge: badge || null,
        isPublished: isPublished ?? false,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, price, description, category, imageUrl, badge, isPublished, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: parseFloat(String(price)) }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(badge !== undefined && { badge: badge || null }),
        ...(isPublished !== undefined && { isPublished }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
