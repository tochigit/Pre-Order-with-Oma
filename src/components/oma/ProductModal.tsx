"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  badge: string | null;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2347079430805";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    handbags: "Handbags",
    shoes: "Shoes",
    accessories: "Accessories",
    new_arrivals: "New Arrivals",
  };
  return labels[cat] || cat;
}

const emptySubscribe = () => () => {};

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  const whatsappMessage = product
    ? encodeURIComponent(
        `Hi Oma! I'd like to preorder the ${product.name} for ${formatPrice(product.price)}.\n\nPlease let me know the next steps. Thank you!`
      )
    : "";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-warm-white border border-champagne shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-cream/80 border border-champagne text-mid-brown hover:text-gold hover:border-gold transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Product Image */}
              <div className="aspect-[4/3] bg-champagne/30 relative overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div
                  className={`${product.imageUrl ? "hidden" : "flex"} w-full h-full items-center justify-center`}
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-champagne/40 flex items-center justify-center">
                      <span className="font-serif text-3xl text-gold">
                        {product.category === "handbags"
                          ? "👜"
                          : product.category === "shoes"
                            ? "👠"
                            : product.category === "accessories"
                              ? "⌚"
                              : "✨"}
                      </span>
                    </div>
                    <p className="text-xs text-warm-gray tracking-widest uppercase">No image yet</p>
                  </div>
                </div>

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-deep-brown text-champagne text-[0.58rem] tracking-[0.2em] uppercase px-3 py-1.5">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 sm:p-8">
                <p className="text-[0.62rem] tracking-[0.25em] uppercase text-gold mb-2">
                  {getCategoryLabel(product.category)}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-deep-brown mb-2">
                  {product.name}
                </h2>
                <p className="text-lg text-gold font-medium tracking-wide mb-4">
                  {formatPrice(product.price)}
                </p>

                {product.description && (
                  <p className="text-sm text-warm-gray font-light leading-relaxed mb-6">
                    {product.description}
                  </p>
                )}

                <div className="ornament-line mb-6">
                  <span className="text-[0.62rem] tracking-[0.25em] uppercase text-gold">Preorder</span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-3.5 px-6 text-xs tracking-[0.18em] uppercase transition-colors font-medium"
                >
                  <MessageCircle size={16} />
                  Preorder on WhatsApp
                </a>

                <p className="text-center text-[0.65rem] text-warm-gray mt-3 tracking-wide">
                  You&apos;ll be redirected to WhatsApp with a pre-written message
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
