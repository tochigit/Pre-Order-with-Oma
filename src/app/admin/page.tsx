"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/admin/login";
    }
  }, []);

  return (
    <div className="min-h-screen bg-deep-brown flex items-center justify-center">
      <p className="text-cream/50 text-sm">Redirecting...</p>
    </div>
  );
}
