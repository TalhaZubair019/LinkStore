"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Upload, Sparkles, Loader2, Save } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    oldPrice: "",
    image: "",
    badges: [] as string[],
    category: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setProductForm((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleGenerateDescription = async () => {
    if (!productForm.title) {
      alert("Please enter a product title first.");
      return;
    }

    setIsGenerating(true);
    try {
      let imageData = "";
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        await new Promise((resolve) => (reader.onload = resolve));
        imageData = reader.result as string;
      } else if (productForm.image && !productForm.image.startsWith("blob:")) {
        imageData = productForm.image;
      }

      const res = await fetch("/api/admin/ai-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: productForm.title,
          category: productForm.category || "",
          image: imageData,
        }),
      });

      const data = await res.json();
      if (data.description) {
        setProductForm((prev) => ({ ...prev, description: data.description }));
      } else if (data.error) {
        alert(data.error);
      }
    } catch {
      alert("Could not generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = productForm.image.trim();

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      if (!imageUrl) {
        alert("Please provide a product image (upload a file or enter a URL).");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: productForm.title,
        description: productForm.description,
        price: `$${parseFloat(productForm.price).toFixed(2)}`,
        oldPrice: productForm.oldPrice
          ? `$${parseFloat(productForm.oldPrice).toFixed(2)}`
          : null,
        image: imageUrl,
        badges: productForm.badges,
        printText: "",
        category: productForm.category || null,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/dashboard?tab=products");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to save product: ${errData.message ?? res.statusText}`);
      }
    } catch (error: any) {
      alert(`Error saving product: ${error?.message ?? "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <PageHeader title="Add New Product" breadcrumb="Add Product" />

      <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-8 pb-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g., Premium Cotton T-Shirt"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-200">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40 transition-all text-slate-800 dark:text-slate-100"
                >
                  <option value="" disabled>
                    Select a Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || !productForm.title}
                    className="text-xs flex items-center gap-1.5 bg-linear-to-r from-purple-600 to-violet-600 dark:from-purple-500 dark:to-violet-500 text-white px-3 py-1.5 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-40 shadow-sm shadow-purple-200 dark:shadow-none"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={11} className="animate-spin" />{" "}
                        Writing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={11} /> AI Generate
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter a product description or click AI Generate to create one from the title and category..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40 resize-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40 text-slate-800 dark:text-slate-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Old Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={productForm.oldPrice}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          oldPrice: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40 text-slate-800 dark:text-slate-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-200">
                  Product Badges{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    (Select all that apply)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm((prev) => ({ ...prev, badges: [] }))
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                      productForm.badges.length === 0
                        ? "bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900 shadow-md shadow-slate-100 dark:shadow-none"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    None
                  </button>
                  {[
                    "New",
                    "Sale",
                    "Hot",
                    "Best Seller",
                    "Limited",
                    "Trending",
                  ].map((badge) => {
                    const isSelected = productForm.badges.includes(badge);
                    return (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => {
                          setProductForm((prev) => {
                            const newBadges = isSelected
                              ? prev.badges.filter((b) => b !== badge)
                              : [...prev.badges, badge];
                            return { ...prev, badges: newBadges };
                          });
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                          isSelected
                            ? "bg-purple-600 dark:bg-purple-500 border-purple-600 dark:border-purple-500 text-white shadow-md shadow-purple-100 dark:shadow-none"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-200 dark:hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {badge}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-200">
                  Product Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-all group mb-4"
                >
                  {productForm.image ? (
                    <Image
                      src={productForm.image}
                      alt="Preview"
                      fill
                      className="object-contain p-3"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 group-hover:text-purple-500 transition-colors">
                      <Upload size={32} strokeWidth={1.5} />
                      <span className="text-xs font-medium">
                        Click to upload
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-purple-600 dark:hover:bg-purple-500 transition-colors flex items-center justify-center gap-2 mb-3 border border-transparent dark:border-slate-700"
                >
                  <Upload size={15} /> Choose File
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-slate-900 px-2 text-xs text-slate-400 dark:text-slate-500 transition-colors">
                      or paste URL
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  value={imageFile ? "" : productForm.image}
                  onChange={(e) => {
                    setImageFile(null);
                    setProductForm((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }));
                  }}
                  placeholder="https://example.com/image.png"
                  className="w-full mt-3 px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-linear-to-r from-purple-600 to-violet-600 dark:from-purple-500 dark:to-violet-500 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity shadow-lg shadow-purple-200 dark:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Product
                    </>
                  )}
                </button>
                <Link
                  href="/admin/dashboard?tab=products"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-center transition-colors text-slate-700 dark:text-slate-200 text-sm flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>
              <div className="bg-linear-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50 p-5">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2 uppercase tracking-wide">
                  ✦ Tips
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                  <li>• Use a square image for best results</li>
                  <li>• Add a badge like "New" or "Sale" to highlight deals</li>
                  <li>• Type a title first to use AI description generation</li>
                  <li>• Set an old price to show a discount</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
