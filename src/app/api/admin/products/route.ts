import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  isAuthenticated,
  checkMutationRateLimit,
  getClientIP,
  writeAuditLog,
  auditContext,
} from "@/lib/auth";
import {
  validate,
  productCreateSchema,
  productUpdateSchema,
  productIdSchema,
} from "@/lib/validation";

function gate(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ip = getClientIP(request);
  const rl = checkMutationRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Slow down." },
      { status: 429 }
    );
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authError = gate(request);
  if (authError) return authError;

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

export async function POST(request: NextRequest) {
  const authError = gate(request);
  if (authError) return authError;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validate(productCreateSchema, raw);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const product = await db.product.create({ data: result.data });

    await writeAuditLog({
      action: "product.create",
      targetType: "product",
      targetId: product.id,
      ...auditContext(request),
      meta: { name: product.name, price: product.price, category: product.category },
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

export async function PUT(request: NextRequest) {
  const authError = gate(request);
  if (authError) return authError;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validate(productUpdateSchema, raw);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { id, ...changes } = result.data;

  try {
    const product = await db.product.update({
      where: { id },
      data: changes,
    });

    await writeAuditLog({
      action: "product.update",
      targetType: "product",
      targetId: product.id,
      ...auditContext(request),
      meta: { changedFields: Object.keys(changes) },
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

export async function DELETE(request: NextRequest) {
  const authError = gate(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const result = validate(productIdSchema, {
    id: searchParams.get("id") ?? "",
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const existing = await db.product.findUnique({
      where: { id: result.data.id },
      select: { id: true, name: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.product.delete({ where: { id: result.data.id } });

    await writeAuditLog({
      action: "product.delete",
      targetType: "product",
      targetId: existing.id,
      ...auditContext(request),
      meta: { deletedName: existing.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}