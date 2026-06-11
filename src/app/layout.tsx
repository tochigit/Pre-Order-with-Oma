import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Preorder With Oma — Luxury Handbags, Shoes & Accessories",
  description:
    "Authentic luxury handbags, shoes, and accessories carefully sourced from China. Curated with an eye for elegance and quality you can trust. Perfect for students and working professionals.",
  keywords: [
    "luxury handbags",
    "designer shoes",
    "accessories",
    "preorder",
    "Nigeria",
    "import from China",
    "Oma",
  ],
  authors: [{ name: "Preorder With Oma" }],
  openGraph: {
    title: "Preorder With Oma — Luxury Boutique",
    description:
      "Authentic luxury pieces delivered to you. Handbags, shoes & accessories curated for students and working professionals.",
    type: "website",
    siteName: "Preorder With Oma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Preorder With Oma — Luxury Boutique",
    description:
      "Authentic luxury pieces delivered to you. Handbags, shoes & accessories curated for students and working professionals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${jost.variable} antialiased bg-cream text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
