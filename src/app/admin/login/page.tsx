"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-brown flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-2xl text-cream mb-1">
            Preorder <span className="text-gold italic">With Oma</span>
          </h1>
          <p className="text-[0.62rem] tracking-[0.3em] uppercase text-gold">
            Admin Panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[0.62rem] tracking-[0.2em] uppercase text-cream/60 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-cream/5 border border-champagne/30 text-cream pl-10 pr-10 py-3 text-sm placeholder:text-cream/30 focus:border-gold focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-gold transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gold text-deep-brown py-3.5 text-[0.7rem] tracking-[0.18em] uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p className="text-center text-cream/30 text-[0.6rem] tracking-wide mt-8">
          Contact the developer if you need access
        </p>
      </motion.div>
    </div>
  );
}
