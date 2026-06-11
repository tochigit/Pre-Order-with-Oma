"use client";

import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  badge: string | null;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index: number;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product, onClick, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="cursor-pointer group"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="aspect-[3/4] bg-champagne/30 relative overflow-hidden mb-4 transition-shadow duration-400 group-hover:shadow-[0_25px_60px_rgba(44,26,14,0.2)] group-hover:-translate-y-1">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover product-image-zoom"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const placeholder = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (placeholder) placeholder.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`${product.imageUrl ? "hidden" : "flex"} w-full h-full items-center justify-center bg-gradient-to-br from-champagne to-[#C8A870]`}
        >
          <span className="font-serif text-5xl text-deep-brown/20">
            {product.category === "handbags"
              ? "👜"
              : product.category === "shoes"
                ? "👠"
                : product.category === "accessories"
                  ? "⌚"
                  : "✨"}
          </span>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 bg-deep-brown text-champagne text-[0.58rem] tracking-[0.2em] uppercase px-3 py-1.5 z-10">
            {product.badge}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-deep-brown/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10">
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-champagne border border-champagne px-5 py-2.5 hover:bg-gold hover:border-gold hover:text-deep-brown transition-colors">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <h3 className="font-serif text-lg font-normal text-deep-brown mb-1">
        {product.name}
      </h3>
      <p className="text-sm text-gold font-medium tracking-wide">
        {formatPrice(product.price)}
      </p>
    </motion.div>
  );
}
