"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Footprints, Watch, Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const categoryConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  handbags: {
    label: "Handbags",
    icon: <ShoppingBag size={28} />,
  },
  shoes: {
    label: "Shoes",
    icon: <Footprints size={28} />,
  },
  accessories: {
    label: "Accessories",
    icon: <Watch size={28} />,
  },
  new_arrivals: {
    label: "New Arrivals",
    icon: <Sparkles size={28} />,
  },
};

export default function CategoryCard({
  category,
  count,
  isSelected,
  onClick,
  index,
}: CategoryCardProps) {
  const config = categoryConfig[category] || {
    label: category,
    icon: <Sparkles size={28} />,
  };
  const isFeatured = category === "new_arrivals";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      className={`relative cursor-pointer border p-6 sm:p-8 text-center transition-all duration-400 overflow-hidden group
        ${
          isSelected
            ? "border-gold bg-warm-white shadow-[0_20px_50px_rgba(44,26,14,0.1)] -translate-y-1.5"
            : "border-champagne bg-warm-white hover:border-gold hover:shadow-[0_20px_50px_rgba(44,26,14,0.1)] hover:-translate-y-1.5"
        }
      `}
    >
      {/* Gold gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      <div className="relative z-10">
        <span
          className={`inline-flex items-center justify-center w-14 h-14 rounded-full border mb-4 transition-colors
            ${isSelected ? "border-gold text-gold bg-gold/5" : "border-champagne text-mid-brown group-hover:border-gold group-hover:text-gold"}
          `}
        >
          {config.icon}
        </span>
        <p
          className={`text-[0.72rem] tracking-[0.2em] uppercase font-medium transition-colors
            ${isSelected ? "text-gold" : isFeatured ? "text-gold" : "text-mid-brown group-hover:text-gold"}
          `}
        >
          {config.label}
        </p>
        <p className="text-[0.6rem] tracking-wider text-warm-gray mt-1">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>
    </motion.div>
  );
}
