"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Check, ChevronRight, Instagram } from "lucide-react";

import MobileNav from "@/components/oma/MobileNav";
import ProductCard from "@/components/oma/ProductCard";
import ProductModal from "@/components/oma/ProductModal";
import CategoryCard from "@/components/oma/CategoryCard";
import SkeletonCard from "@/components/oma/SkeletonCard";
import FAB from "@/components/oma/FAB";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  badge: string | null;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2347079430805";
const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "https://www.instagram.com/preo.rderwithoma?utm_source=qr&igsh=em1rb3lsY2QxaGI4";

const categories = ["all", "handbags", "shoes", "accessories", "new_arrivals"] as const;
type Category = (typeof categories)[number];

const categoryLabels: Record<string, string> = {
  all: "All",
  handbags: "Handbags",
  shoes: "Shoes",
  accessories: "Accessories",
  new_arrivals: "New Arrivals",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const getCategoryCount = (cat: string) =>
    cat === "all" ? products.length : products.filter((p) => p.category === cat).length;

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const whyItems = [
    {
      title: "Authentic Products",
      desc: "Every item is genuine and quality-verified before dispatch. We never compromise on authenticity.",
    },
    {
      title: "Trusted Service",
      desc: "Dependable sourcing tailored perfectly for students and working women across Nigeria.",
    },
    {
      title: "Direct Importation",
      desc: "We source straight from China — no middlemen, which means better prices for you.",
    },
    {
      title: "Personalized Assistance",
      desc: "We help you find exactly what you're looking for, fitting any budget and style preference.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 bg-cream/85 backdrop-blur-xl border-b border-champagne/50">
        <a href="#" className="font-serif text-xl sm:text-2xl font-medium tracking-[0.08em] text-deep-brown">
          Preorder <span className="text-gold italic">With Oma</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#categories" className="text-[0.72rem] tracking-[0.18em] uppercase text-mid-brown hover:text-gold transition-colors">
            Collections
          </a>
          <a href="#products" className="text-[0.72rem] tracking-[0.18em] uppercase text-mid-brown hover:text-gold transition-colors">
            Featured
          </a>
          <a href="#why" className="text-[0.72rem] tracking-[0.18em] uppercase text-mid-brown hover:text-gold transition-colors">
            About
          </a>
          <a href="#contact" className="text-[0.72rem] tracking-[0.18em] uppercase text-mid-brown hover:text-gold transition-colors">
            Contact
          </a>
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.15em] uppercase text-mid-brown hover:text-gold transition-colors"
          >
            <Phone size={13} />
            +234 707 943 0805
          </a>
        </div>

        {/* Mobile nav */}
        <MobileNav />
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden pt-20 lg:pt-0">
        {/* Left: Text */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 lg:pl-24 lg:pr-8 py-16 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[0.65rem] sm:text-[0.68rem] tracking-[0.3em] uppercase text-gold mb-6 flex items-center gap-3">
              <span className="block w-8 h-px bg-gold" />
              Luxury Preorder Service
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-serif text-[2.4rem] sm:text-5xl lg:text-[4.2rem] font-light leading-[1.15] text-deep-brown mb-5"
          >
            Luxury Handbags,
            <br />
            Shoes &amp; <em className="text-gold italic">Accessories</em>
            <br />
            Delivered To You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-sm font-light text-warm-gray tracking-wide leading-relaxed max-w-[380px] mb-8"
          >
            Authentic pieces carefully sourced from China, curated with an eye for
            elegance and quality you can trust. Perfect for students and working
            professionals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#products"
              className="inline-block bg-deep-brown text-champagne py-3.5 px-8 text-[0.7rem] tracking-[0.2em] uppercase border border-deep-brown hover:bg-gold hover:border-gold hover:text-deep-brown transition-all duration-300"
            >
              Shop Collection
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-mid-brown py-3.5 px-6 text-[0.7rem] tracking-[0.18em] uppercase border border-champagne hover:border-gold hover:text-gold transition-all duration-300"
            >
              <MessageCircle size={14} />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Right: Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative min-h-[50vh] lg:min-h-screen overflow-hidden"
        >
          {/* Background gradient fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843] via-[#8B5E1A] to-[#2C1A0E]" />

          {/* Hero image */}
          <img
            src="/hero-image.jpg"
            alt="Luxury fashion collection"
            className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-70"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#2C1A0E]/30 lg:bg-gradient-to-r lg:from-[#2C1A0E]/20 lg:via-transparent lg:to-transparent" />

          {/* Decorative circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 lg:w-96 lg:h-96 rounded-full border border-champagne/20" />
          </div>

          {/* Badge */}
          <div className="absolute bottom-8 left-4 lg:bottom-12 lg:left-[-1.5rem] bg-warm-white border border-champagne p-5 shadow-[0_20px_50px_rgba(44,26,14,0.15)] z-10">
            <p className="text-[0.6rem] tracking-[0.25em] uppercase text-warm-gray mb-0.5">
              Authentic &amp; Sourced
            </p>
            <p className="font-serif text-xl font-medium text-deep-brown">Direct Import</p>
          </div>
        </motion.div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-24">
        <p className="text-[0.62rem] tracking-[0.35em] uppercase text-gold mb-3">
          Browse By Category
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-deep-brown mb-10">
          Our <em className="text-gold italic">Collections</em>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories
            .filter((c) => c !== "all")
            .map((cat, i) => (
              <CategoryCard
                key={cat}
                category={cat}
                count={getCategoryCount(cat)}
                isSelected={selectedCategory === cat}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? "all" : cat)
                }
                index={i}
              />
            ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-24 bg-warm-white">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-[0.62rem] tracking-[0.35em] uppercase text-gold mb-3">
              Handpicked For You
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-deep-brown">
              Featured <em className="text-gold italic">Products</em>
            </h2>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[0.65rem] tracking-[0.15em] uppercase border transition-all duration-300
                  ${
                    selectedCategory === cat
                      ? "bg-deep-brown text-champagne border-deep-brown"
                      : "border-champagne text-mid-brown hover:border-gold hover:text-gold"
                  }
                `}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-gray text-sm">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openProductModal(product)}
                index={i}
              />
            ))}
          </div>
        )}

        {selectedCategory !== "all" && (
          <div className="text-center mt-10">
            <button
              onClick={() => setSelectedCategory("all")}
              className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.18em] uppercase text-mid-brown border border-champagne px-6 py-3 hover:border-gold hover:text-gold transition-all duration-300"
            >
              View All Products
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </section>

      {/* ── WHY SECTION ── */}
      <section id="why" className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-deep-brown text-cream p-10 sm:p-14 lg:p-24 flex flex-col justify-center">
          <p className="text-[0.62rem] tracking-[0.35em] uppercase text-gold mb-3">
            Our Promise
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-cream mb-10">
            Why Preorder
            <br />
            <em className="text-gold italic">With Oma?</em>
          </h2>
          <ul className="space-y-6">
            {whyItems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <span className="w-6 h-6 shrink-0 border border-gold flex items-center justify-center text-gold text-[0.65rem] mt-0.5">
                  <Check size={12} />
                </span>
                <div className="text-sm font-light text-cream/85 leading-relaxed">
                  <strong className="text-cream font-medium">{item.title}</strong>
                  <br />
                  {item.desc}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-[#3D2210] to-[#1A0F08] min-h-[200px] lg:min-h-0 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(196,150,42,0.15)_0%,transparent_65%)]" />
          <div className="relative z-10 flex flex-col items-center gap-4 py-16">
            <div className="w-24 h-24 rounded-full border-2 border-gold/30 flex items-center justify-center">
              <SparklesIcon />
            </div>
            <p className="text-champagne/60 text-[0.62rem] tracking-[0.3em] uppercase">
              Curated with Care
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-24 bg-gradient-to-br from-cream to-[#F0E8D8] text-center"
      >
        <p className="text-[0.62rem] tracking-[0.35em] uppercase text-gold mb-3">
          Get In Touch
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-deep-brown mb-4">
          Place Your <em className="text-gold italic">Preorder</em>
        </h2>
        <p className="text-sm text-warm-gray font-light tracking-wide mb-10 max-w-md mx-auto">
          Reach out via any of the channels below and let&apos;s get you looking your best.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-deep-brown text-champagne py-3.5 px-7 text-[0.7rem] tracking-[0.18em] uppercase border border-deep-brown hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-300"
          >
            <MessageCircle size={15} />
            WhatsApp Us
          </a>
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-champagne text-mid-brown py-3.5 px-7 text-[0.7rem] tracking-[0.18em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
          >
            <Instagram size={15} />
            Instagram
          </a>
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="inline-flex items-center gap-2 border border-champagne text-mid-brown py-3.5 px-7 text-[0.7rem] tracking-[0.18em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
          >
            <Phone size={15} />
            Call Us
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-deep-brown text-cream/50 text-center py-8 px-6 text-[0.65rem] tracking-[0.15em] uppercase mt-auto">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-gold">Preorder With Oma</span> &mdash; All Rights
          Reserved
        </p>
      </footer>

      {/* ── PRODUCT MODAL ── */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* ── FLOATING ACTION BUTTON ── */}
      <FAB />
    </div>
  );
}

/* ── Inline SVG Icons ── */
function SparklesIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-gold">
      <path d="M20 4L22.5 15.5L34 18L22.5 20.5L20 32L17.5 20.5L6 18L17.5 15.5L20 4Z" fill="currentColor" />
      <path d="M8 4L9.25 9.5L14 10.75L9.25 12L8 17.5L6.75 12L1 10.75L6.75 9.5L8 4Z" fill="currentColor" opacity="0.5" />
      <path d="M32 24L33.25 29.5L38 30.75L33.25 32L32 37.5L30.75 32L25 30.75L30.75 29.5L32 24Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
