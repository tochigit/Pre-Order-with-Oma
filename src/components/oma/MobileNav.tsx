"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2347079430805";

const navLinks = [
  { href: "#categories", label: "Collections" },
  { href: "#products", label: "Featured" },
  { href: "#why", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 flex items-center justify-center text-mid-brown hover:text-gold transition-colors"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Slide-out Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-warm-white border-l border-champagne shadow-2xl"
            >
              {/* Close Button */}
              <div className="flex items-center justify-between p-6 border-b border-champagne">
                <span className="font-serif text-lg text-deep-brown">
                  Preorder <span className="text-gold italic">With Oma</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-mid-brown hover:text-gold transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-6">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-3 text-[0.72rem] tracking-[0.18em] uppercase text-mid-brown hover:text-gold transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Phone Number */}
              <div className="px-6 pb-4">
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="flex items-center gap-2 py-3 text-[0.72rem] tracking-[0.18em] uppercase text-mid-brown hover:text-gold transition-colors"
                >
                  <Phone size={14} />
                  +234 707 943 0805
                </a>
              </div>

              {/* WhatsApp CTA */}
              <div className="p-6 border-t border-champagne">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-deep-brown text-champagne py-3 text-[0.7rem] tracking-[0.18em] uppercase hover:bg-gold hover:text-deep-brown transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
