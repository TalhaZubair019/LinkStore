import React, { useState } from "react";
import { X, Tag, Loader2 } from "lucide-react";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: Category | null;
  onSaved: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
  isAdminView?: boolean;
}

const CategoryModal = ({
  isOpen,
  onClose,
  editingCategory,
  onSaved,
  showToast,
  isAdminView = true,
}: CategoryModalProps) => {
  const [name, setName] = useState(editingCategory?.name || "");
  const [image, setImage] = useState(editingCategory?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setName(editingCategory?.name || "");
    setImage(editingCategory?.image || "");
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const previewSlug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      const apiPrefix = isAdminView ? "/api/admin" : "/api/vendor";
      const url = editingCategory
        ? `${apiPrefix}/categories/${editingCategory._id}`
        : `${apiPrefix}/categories`;

      const res = await fetch(url, {
        method: editingCategory ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(
          editingCategory ? "Category updated." : "Category created.",
          "success",
        );
        onSaved();
        onClose();
      } else {
        showToast(data.message || "Failed to save category.", "error");
      }
    } catch {
      showToast("Error saving category.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500 border border-slate-200 dark:border-white/5 transition-all">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-purple-600 rounded-full" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
                Category Name <span className="text-purple-500">*</span>
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ENTER NAME..."
                className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all font-black uppercase text-xs tracking-widest"
              />
              {name.trim() && (
                <div className="flex items-center gap-2 pl-1 mt-1 opacity-60">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Slug:
                  </span>
                  <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400 lowercase">
                    /{previewSlug}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="HTTPS://SOURCE.DOMAIN/ASSET.PNG"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all font-black uppercase text-xs tracking-widest"
              />

              <div className="mt-4 flex justify-center">
                <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative bg-slate-50 dark:bg-white/5 flex items-center justify-center group/preview hover:border-purple-500/50 transition-all">
                  {image ? (
                    <Image
                      src={image}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform duration-700 group-hover/preview:scale-110"
                      unoptimized
                    />
                  ) : (
                    <Tag
                      className="w-8 h-8 text-slate-200 dark:text-slate-800 opacity-50"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 text-center transition-all flex items-center justify-center border border-transparent dark:border-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Commit Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
