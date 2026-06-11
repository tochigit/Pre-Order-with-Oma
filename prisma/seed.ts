import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing products
  await prisma.product.deleteMany();

  const products = [
    {
      name: "Luxury Tote Bag",
      price: 185000,
      description:
        "Elegant top-handle tote crafted from premium leather with gold-tone hardware. Spacious interior with multiple compartments. Perfect for the office or a weekend getaway.",
      category: "handbags",
      imageUrl: "/products/tote-bag.jpg",
      badge: "Bestseller",
      isPublished: true,
      sortOrder: 1,
    },
    {
      name: "Designer Crossbody",
      price: 120000,
      description:
        "Compact crossbody bag with adjustable strap and signature clasp closure. Features quilted lambskin exterior and a satin-lined interior.",
      category: "handbags",
      imageUrl: "/products/crossbody.jpg",
      badge: "New",
      isPublished: true,
      sortOrder: 2,
    },
    {
      name: "Classic Shoulder Bag",
      price: 95000,
      description:
        "Timeless shoulder bag in smooth calfskin leather. Flap closure with signature turn-lock. Interior slip pocket and card slots.",
      category: "handbags",
      imageUrl: "/products/shoulder-bag.jpg",
      badge: null,
      isPublished: true,
      sortOrder: 3,
    },
    {
      name: "Designer Stilettos",
      price: 65000,
      description:
        "Sleek patent leather stilettos with a 4-inch heel. Cushioned insole for all-day comfort. Available in classic black and nude.",
      category: "shoes",
      imageUrl: "/products/stilettos.jpg",
      badge: "New",
      isPublished: true,
      sortOrder: 4,
    },
    {
      name: "Luxury Sneakers",
      price: 45000,
      description:
        "Premium leather sneakers with chunky sole and signature stripe detail. Breathable mesh lining. The perfect blend of comfort and style.",
      category: "shoes",
      imageUrl: "/products/sneakers.jpg",
      badge: null,
      isPublished: true,
      sortOrder: 5,
    },
    {
      name: "Elegant Block Heels",
      price: 38000,
      description:
        "Sophisticated block-heel pumps in soft suede. 3-inch heel provides height without sacrificing stability. Perfect for work or events.",
      category: "shoes",
      imageUrl: "/products/block-heels.jpg",
      badge: null,
      isPublished: true,
      sortOrder: 6,
    },
    {
      name: "Women's Gold Watch",
      price: 25000,
      description:
        "Stainless steel watch with 18K gold plating. Mother-of-pearl dial with date display. Water resistant to 30 meters.",
      category: "accessories",
      imageUrl: "/products/watch.jpg",
      badge: "Bestseller",
      isPublished: true,
      sortOrder: 7,
    },
    {
      name: "Chic Sunglasses",
      price: 5000,
      description:
        "Oversized cat-eye sunglasses with UV400 protection. Acetate frame with gold temple detail. Includes designer case and cloth.",
      category: "accessories",
      imageUrl: "/products/sunglasses.jpg",
      badge: null,
      isPublished: true,
      sortOrder: 8,
    },
    {
      name: "Silk Scarf",
      price: 12000,
      description:
        "100% pure silk twill scarf with hand-rolled edges. Versatile styling — wear as a headband, neck tie, or bag accessory.",
      category: "accessories",
      imageUrl: "/products/scarf.jpg",
      badge: "Limited",
      isPublished: true,
      sortOrder: 9,
    },
    {
      name: "Mini Evening Clutch",
      price: 55000,
      description:
        "Embellished mini clutch with crystal clasp closure. Detachable chain strap. Fits phone, cards, and lipstick. The perfect evening companion.",
      category: "new_arrivals",
      imageUrl: "/products/clutch.jpg",
      badge: "New",
      isPublished: true,
      sortOrder: 10,
    },
    {
      name: "Platform Espadrilles",
      price: 32000,
      description:
        "Woven jute platform espadrilles with canvas upper. 2.5-inch platform for a flattering lift. Comfortable and chic for warm weather.",
      category: "new_arrivals",
      imageUrl: "/products/espadrilles.jpg",
      badge: "New",
      isPublished: true,
      sortOrder: 11,
    },
    {
      name: "Pearl Statement Necklace",
      price: 18000,
      description:
        "Double-strand freshwater pearl necklace with gold-plated clasp. Timeless elegance that elevates any outfit from simple to stunning.",
      category: "new_arrivals",
      imageUrl: "/products/necklace.jpg",
      badge: "Limited",
      isPublished: true,
      sortOrder: 12,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
