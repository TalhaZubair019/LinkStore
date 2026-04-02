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
        const uploadRes = await fetch("/api/upload?folder=product", {
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0f14] font-sans transition-colors duration-300">
      <PageHeader
        title="Add New Product"
        breadcrumb="Add Product"
        isDashboard={true}
      />

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-3 space-y-6">
              {/* Basic Info Matrix */}
              <div className="bg-white dark:bg-white/3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-100 dark:border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Identity Matrix
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
                      Product Title <span className="text-purple-500">*</span>
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
                      placeholder="ENTER PRODUCT NAME..."
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all font-black uppercase text-xs tracking-widest"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
                      Category <span className="text-purple-500">*</span>
                    </label>
                    <div className="relative group/select">
                      <select
                        required
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-slate-800 dark:text-slate-100 font-black uppercase text-xs tracking-widest appearance-none"
                      >
                        <option value="" disabled className="dark:bg-[#1a1c23]">
                          SELECT CATEGORY...
                        </option>
                        {categories.map((cat) => (
                          <option
                            key={cat._id}
                            value={cat.name}
                            className="dark:bg-[#1a1c23]"
                          >
                            {cat.name.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-focus-within/select:text-purple-500 transition-colors">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Matrix */}
              <div className="bg-white dark:bg-white/3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-100 dark:border-white/5 p-8 group relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                        Description
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || !productForm.title}
                      className="group/ai relative flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 overflow-hidden shadow-lg shadow-slate-900/10 dark:shadow-white/5"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600 opacity-0 group-hover/ai:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10 flex items-center gap-2">
                        {isGenerating ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />{" "}
                            Writing...
                          </>
                        ) : (
                          <>
                            <Sparkles
                              size={12}
                              className="group-hover/ai:rotate-12 transition-transform"
                            />{" "}
                            AI GENERATE
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
                      Resource Description
                    </label>
                    <textarea
                      rows={6}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="ENTER DETAILED SPECIFICATIONS OR USE AI TO SYNTHESIZE CONTENT..."
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 resize-none text-[11px] font-bold text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all leading-relaxed tracking-wide"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Matrix */}
              <div className="bg-white dark:bg-white/3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-100 dark:border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                      Pricing
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
                        Price ($) <span className="text-emerald-500">*</span>
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
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-800 dark:text-slate-100 transition-all font-black tabular-nums text-lg"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
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
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-slate-400 dark:text-slate-500 transition-all font-black tabular-nums text-lg opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Tags Matrix */}
              <div className="bg-white dark:bg-white/3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-100 dark:border-white/5 p-8 group relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                      Product Badges
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setProductForm((prev) => ({ ...prev, badges: [] }))
                      }
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        productForm.badges.length === 0
                          ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-md shadow-slate-900/10 dark:shadow-white/5 scale-105"
                          : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 dark:text-slate-600 hover:border-slate-200 dark:hover:border-white/20"
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
                          className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                            isSelected
                              ? "bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_#9333ea20] scale-105"
                              : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-400 dark:text-slate-600 hover:border-purple-500/30"
                          }`}
                        >
                          {badge}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Media & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Asset Nexus (Image) */}
              <div className="bg-white dark:bg-white/3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-100 dark:border-white/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent opacity-30" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-4 bg-purple-600 rounded-full shadow-[0_0_8px_#9333ea]" />
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                      Product Image
                    </label>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-square bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group/upload mb-6"
                  >
                    {productForm.image ? (
                      <>
                        <Image
                          src={productForm.image}
                          alt="Preview"
                          fill
                          className="object-contain p-6 hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <Upload className="text-white scale-125 group-hover/upload:animate-bounce" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-slate-300 dark:text-slate-700 group-hover/upload:text-purple-500 transition-all">
                        <div className="w-20 h-20 rounded-3xl bg-white dark:bg-white/5 flex items-center justify-center shadow-inner group-hover/upload:scale-110 group-hover/upload:rotate-6 transition-all border border-slate-100 dark:border-white/5">
                          <Upload size={36} strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                          Click to upload
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-white/5"
                    >
                      <Upload size={16} strokeWidth={2.5} /> CHOOSE FILE
                    </button>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100 dark:border-white/5" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-[#0d0f14] px-4 text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest transition-colors">
                          OR PASTE URL
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
                      placeholder="HTTPS://SOURCE.DOMAIN/ASSET.PNG"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 placeholder:opacity-30 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Nexus (Save/Cancel) */}
              <div className="bg-white dark:bg-white/3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl border border-slate-100 dark:border-white/5 p-8 space-y-4 relative overflow-hidden group">
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full px-4 py-5 bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-[200%_auto] animate-gradient-x text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> SAVING...
                    </>
                  ) : (
                    <>
                      <Save size={18} strokeWidth={2.5} /> Save Product
                    </>
                  )}
                </button>

                <Link
                  href="/admin/dashboard?tab=products"
                  className="w-full px-4 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 text-center transition-all flex items-center justify-center border border-transparent dark:border-white/5"
                >
                  Cancel
                </Link>
              </div>

              {/* Tips Matrix */}
              <div className="bg-linear-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 rounded-3xl border border-purple-500/20 p-8 shadow-inner">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles
                    size={16}
                    className="text-purple-500 animate-pulse"
                  />
                  <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.3em]">
                    ✦ Tips
                  </p>
                </div>
                <ul className="text-[10px] font-black text-slate-500 dark:text-slate-500 space-y-3 leading-relaxed uppercase tracking-widest">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    ASSET ASPECT RATIO: 1:1 RECOMMENDED
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    UTILIZE BADGES FOR PROMINENT FILTERING
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    INJECT TITLE BEFORE AI SYNTHESIS
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    PREVIOUS VALUE OPTIONAL FOR DISCOUNT LOGIC
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
