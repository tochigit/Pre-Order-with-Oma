"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  LogOut,
  ShoppingBag,
  Watch,
  Footprints,
  Sparkles,
  Save,
  Image as ImageIcon,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  badge: string | null;
  isPublished: boolean;
  sortOrder: number;
}

interface Stats {
  total: number;
  published: number;
  draft: number;
  byCategory: Record<string, number>;
}

const categoryOptions = [
  { value: "handbags", label: "Handbags", icon: ShoppingBag },
  { value: "shoes", label: "Shoes", icon: Footprints },
  { value: "accessories", label: "Accessories", icon: Watch },
  { value: "new_arrivals", label: "New Arrivals", icon: Sparkles },
];

const badgeOptions = ["Bestseller", "New", "Limited", ""];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

function getCategoryIcon(category: string): React.ReactNode {
  switch (category) {
    case "handbags":
      return <ShoppingBag size={16} className="text-warm-gray/50" />;
    case "shoes":
      return <Footprints size={16} className="text-warm-gray/50" />;
    case "accessories":
      return <Watch size={16} className="text-warm-gray/50" />;
    default:
      return <Sparkles size={16} className="text-warm-gray/50" />;
  }
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [token, setToken] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("handbags");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formPublished, setFormPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      window.location.href = "/admin/login";
      return;
    }
    setToken(storedToken);
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products", {
        headers: { "x-admin-token": token },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      setProducts(data.products);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setFormName("");
    setFormPrice("");
    setFormDescription("");
    setFormCategory("handbags");
    setFormImageUrl("");
    setFormBadge("");
    setFormPublished(false);
    setEditingProduct(null);
    setUploading(false);
    setUploadPreview(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(String(product.price));
    setFormDescription(product.description);
    setFormCategory(product.category);
    setFormImageUrl(product.imageUrl);
    setFormBadge(product.badge || "");
    setFormPublished(product.isPublished);
    setUploadPreview(product.imageUrl || null);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please use JPEG, PNG, WebP, or GIF.");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setUploadPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setFormImageUrl(data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.error || "Upload failed");
        setUploadPreview(null);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed. Please try again.");
      setUploadPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formName || !formPrice) return;
    setSaving(true);

    try {
      const body = {
        name: formName,
        price: parseFloat(formPrice),
        description: formDescription,
        category: formCategory,
        imageUrl: formImageUrl,
        badge: formBadge || null,
        isPublished: formPublished,
        ...(editingProduct ? { id: editingProduct.id } : {}),
      };

      const res = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(
          editingProduct
            ? `"${formName}" updated successfully`
            : `"${formName}" created successfully`
        );
        setShowForm(false);
        resetForm();
        fetchProducts();
      } else {
        toast.error("Failed to save product. Please try again.");
      }
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      if (res.ok) {
        toast.success(`"${product.name}" deleted`);
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Something went wrong");
    } finally {
      setDeleting(null);
    }
  };

  const togglePublished = async (product: Product) => {
    const newStatus = !product.isPublished;
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          id: product.id,
          isPublished: newStatus,
        }),
      });
      if (res.ok) {
        toast.success(
          `"${product.name}" ${newStatus ? "published" : "moved to drafts"}`
        );
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to toggle product:", err);
      toast.error("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Admin Header ── */}
      <header className="bg-deep-brown border-b border-champagne/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-cream/60 hover:text-gold text-xs tracking-wider transition-colors"
            >
              <ArrowLeft size={14} />
              View Site
            </a>
            <div className="w-px h-6 bg-champagne/20" />
            <h1 className="font-serif text-lg text-cream">
              Admin <span className="text-gold italic">Panel</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-cream/60 hover:text-gold text-[0.65rem] tracking-[0.15em] uppercase transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Stats Grid ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Products" value={stats.total} />
            <StatCard label="Published" value={stats.published} color="text-green-600" />
            <StatCard label="Drafts" value={stats.draft} color="text-warm-gray" />
            <StatCard
              label="Categories"
              value={Object.keys(stats.byCategory).filter((k) => stats.byCategory[k] > 0).length}
            />
          </div>
        )}

        {/* ── Action Bar ── */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-deep-brown">
            Products
          </h2>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 bg-deep-brown text-champagne py-2.5 px-5 text-[0.65rem] tracking-[0.15em] uppercase hover:bg-gold hover:text-deep-brown transition-colors"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>

        {/* ── Products Table ── */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 shimmer" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-gray text-sm mb-4">No products yet.</p>
            <button
              onClick={openCreateForm}
              className="text-[0.65rem] tracking-[0.15em] uppercase text-gold hover:underline"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="border border-champagne bg-warm-white overflow-hidden">
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-[1fr_100px_120px_100px_80px_120px] gap-4 px-6 py-3 bg-cream border-b border-champagne text-[0.6rem] tracking-[0.15em] uppercase text-warm-gray">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Badge</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {/* Table Body */}
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-1 lg:grid-cols-[1fr_100px_120px_100px_80px_120px] gap-2 lg:gap-4 px-6 py-4 border-b border-champagne/50 last:border-b-0 items-center hover:bg-cream/50 transition-colors"
              >
                {/* Product Name + Image */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-champagne/30 shrink-0 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = "";
                            parent.appendChild(
                              Object.assign(document.createElement("span"), {
                                innerHTML: getCategoryIcon(product.category)?.toString() || "",
                              })
                            );
                          }
                        }}
                      />
                    ) : (
                      getCategoryIcon(product.category)
                    )}
                  </div>
                  <div>
                    <p className="font-serif text-sm text-deep-brown">{product.name}</p>
                    <p className="text-[0.6rem] text-warm-gray lg:hidden">
                      {formatPrice(product.price)} &middot; {product.category.replaceAll("_", " ")}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <span className="hidden lg:block text-xs text-mid-brown capitalize">
                  {product.category.replaceAll("_", " ")}
                </span>

                {/* Price */}
                <span className="hidden lg:block text-xs text-gold font-medium">
                  {formatPrice(product.price)}
                </span>

                {/* Badge */}
                <span className="hidden lg:block">
                  {product.badge ? (
                    <span className="text-[0.58rem] tracking-wider uppercase bg-deep-brown text-champagne px-2 py-0.5">
                      {product.badge}
                    </span>
                  ) : (
                    <span className="text-[0.58rem] text-warm-gray">&mdash;</span>
                  )}
                </span>

                {/* Status */}
                <span className="hidden lg:block">
                  <button
                    onClick={() => togglePublished(product)}
                    className={`flex items-center gap-1 text-[0.58rem] tracking-wider uppercase transition-colors
                      ${product.isPublished ? "text-green-600" : "text-warm-gray"}
                    `}
                  >
                    {product.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                    {product.isPublished ? "Live" : "Draft"}
                  </button>
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditForm(product)}
                    className="w-8 h-8 flex items-center justify-center text-mid-brown hover:text-gold transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="w-8 h-8 flex items-center justify-center text-mid-brown hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Product Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 z-50 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-w-xl lg:w-full max-h-[90vh] overflow-y-auto bg-warm-white border border-champagne shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Form Header */}
              <div className="flex items-center justify-between p-6 border-b border-champagne">
                <h3 className="font-serif text-xl text-deep-brown">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center text-mid-brown hover:text-gold transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-[0.62rem] tracking-[0.2em] uppercase text-warm-gray mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Luxury Tote Bag"
                    className="w-full border border-champagne bg-cream py-3 px-4 text-sm text-deep-brown placeholder:text-warm-gray/50 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[0.62rem] tracking-[0.2em] uppercase text-warm-gray mb-2">
                    Price (NGN) *
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 185000"
                    className="w-full border border-champagne bg-cream py-3 px-4 text-sm text-deep-brown placeholder:text-warm-gray/50 focus:border-gold focus:outline-none transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[0.62rem] tracking-[0.2em] uppercase text-warm-gray mb-2">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe the product..."
                    rows={3}
                    className="w-full border border-champagne bg-cream py-3 px-4 text-sm text-deep-brown placeholder:text-warm-gray/50 focus:border-gold focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[0.62rem] tracking-[0.2em] uppercase text-warm-gray mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormCategory(cat.value)}
                        className={`flex items-center gap-2 py-2.5 px-4 border text-[0.62rem] tracking-[0.15em] uppercase transition-all
                          ${
                            formCategory === cat.value
                              ? "border-gold bg-gold/5 text-gold"
                              : "border-champagne text-mid-brown hover:border-gold"
                          }
                        `}
                      >
                        <cat.icon size={14} />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Image */}
                <div>
                  <label className="block text-[0.62rem] tracking-[0.2em] uppercase text-warm-gray mb-2">
                    Product Image
                  </label>

                  {/* Upload button */}
                  <div className="flex items-center gap-3 mb-3">
                    <label className={`flex items-center gap-2 cursor-pointer py-2.5 px-4 border text-[0.62rem] tracking-[0.15em] uppercase transition-all
                      ${uploading ? "border-champagne text-warm-gray opacity-50 cursor-wait" : "border-gold text-gold hover:bg-gold/5"}
                    `}>
                      <Upload size={14} />
                      {uploading ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[0.55rem] text-warm-gray">or paste a URL below</span>
                  </div>

                  {/* Image URL input (auto-filled after upload) */}
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      setUploadPreview(e.target.value || null);
                    }}
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full border border-champagne bg-cream py-3 px-4 text-sm text-deep-brown placeholder:text-warm-gray/50 focus:border-gold focus:outline-none transition-colors"
                  />

                  {/* Image preview */}
                  {uploadPreview && (
                    <div className="mt-3 relative">
                      <div className="w-28 h-28 border border-champagne overflow-hidden bg-champagne/10">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormImageUrl("");
                          setUploadPreview(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-deep-brown text-champagne rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {!uploadPreview && (
                    <p className="text-[0.55rem] text-warm-gray mt-1.5">
                      Upload from your device or paste an image URL. Max 5MB.
                    </p>
                  )}
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-[0.62rem] tracking-[0.2em] uppercase text-warm-gray mb-2">
                    Badge (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {badgeOptions.map((b) => (
                      <button
                        key={b || "none"}
                        type="button"
                        onClick={() => setFormBadge(b)}
                        className={`py-2 px-4 border text-[0.6rem] tracking-[0.15em] uppercase transition-all
                          ${
                            formBadge === b
                              ? "border-gold bg-gold/5 text-gold"
                              : "border-champagne text-mid-brown hover:border-gold"
                          }
                        `}
                      >
                        {b || "None"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center justify-between py-3 border-t border-champagne">
                  <div>
                    <p className="text-sm text-deep-brown">Publish immediately</p>
                    <p className="text-[0.6rem] text-warm-gray mt-0.5">
                      Draft products won&apos;t appear on the website
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormPublished(!formPublished)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      formPublished ? "bg-green-500" : "bg-champagne"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        formPublished ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-champagne">
                <button
                  onClick={() => setShowForm(false)}
                  className="py-2.5 px-5 text-[0.65rem] tracking-[0.15em] uppercase text-mid-brown border border-champagne hover:border-gold hover:text-gold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formName || !formPrice}
                  className="flex items-center gap-2 bg-deep-brown text-champagne py-2.5 px-5 text-[0.65rem] tracking-[0.15em] uppercase hover:bg-gold hover:text-deep-brown transition-colors disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  color = "text-deep-brown",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-warm-white border border-champagne p-5">
      <p className="text-[0.6rem] tracking-[0.2em] uppercase text-warm-gray mb-1">
        {label}
      </p>
      <p className={`font-serif text-2xl font-medium ${color}`}>{value}</p>
    </div>
  );
}
