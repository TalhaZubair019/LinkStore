import React from "react";
import Image from "next/image";
import { Plus, Tag, Edit, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string | null;
  itemCount?: number;
}

interface CategoriesTableProps {
  categories: Category[];
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoriesTable = ({
  categories,
  onAdd,
  onEdit,
  onDelete,
}: CategoriesTableProps) => {
  const [filterType, setFilterType] = React.useState<"used" | "all">("used");

  const filteredCategories = React.useMemo(() => {
    if (filterType === "all") return categories;
    return categories.filter((cat) => (cat.itemCount || 0) > 0);
  }, [categories, filterType]);

  return (
    <div
      key="categories"
      className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl animate-in fade-in duration-700 group/table"
    >
      <div className="p-5 lg:p-8 border-b border-slate-100 dark:border-white/5 space-y-6 relative overflow-hidden transition-colors">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] dark:shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                Category Management
              </h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">
                Manage your product categories
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5 transition-all">
              <button
                onClick={() => setFilterType("used")}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterType === "used"
                    ? "bg-white dark:bg-white/10 text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-slate-200 dark:ring-white/10"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                Store Categories
              </button>
              <button
                onClick={() => setFilterType("all")}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterType === "all"
                    ? "bg-white dark:bg-white/10 text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-slate-200 dark:ring-white/10"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                All Categories
              </button>
            </div>

            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] active:scale-95 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/5 shrink-0"
            >
              <Plus size={16} strokeWidth={3} /> Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5 overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="px-6 py-20 text-center flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-600 opacity-40">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
              <Tag size={24} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              No Categories Found
            </p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="p-5 lg:p-8 space-y-5 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-all group/card relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover/card:scale-125 transition-transform duration-700">
                <Tag size={64} strokeWidth={1} />
              </div>

              <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-4xl border border-slate-200 dark:border-white/10 overflow-hidden relative bg-slate-100 dark:bg-white/5 shrink-0 flex items-center justify-center shadow-inner group-hover/card:scale-105 transition-all duration-500">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Tag className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                    <h4 className="font-black text-[14px] sm:text-[16px] text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate">
                      {cat.name}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-tighter uppercase truncate pl-3.5">
                      /{cat.slug}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[9px] font-black uppercase tracking-[0.2em] w-fit ml-3">
                      {cat.itemCount || 0} ITEMS
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 relative z-10">
                <button
                  onClick={() => onEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/20 transition-all active:scale-95"
                >
                  <Edit size={16} strokeWidth={2.5} /> Edit
                </button>
                <button
                  onClick={() => onDelete(cat)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/20 transition-all active:scale-95"
                >
                  <Trash2 size={16} strokeWidth={2.5} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-white/2 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5">
                Category
              </th>
              <th className="px-8 py-5 border-b border-slate-100 dark:border-white/5">
                Slug
              </th>
              <th className="px-8 py-5 border-b border-slate-100 dark:border-white/5">
                Total Items
              </th>
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 opacity-20 grayscale">
                    <Tag size={48} strokeWidth={1} />
                    <p className="text-[11px] font-black uppercase tracking-[0.4em]">
                      No Categories Found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all group/row"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.25rem] border border-slate-200 dark:border-white/5 overflow-hidden relative bg-slate-100 dark:bg-white/5 shrink-0 flex items-center justify-center group-hover/row:scale-105 transition-transform duration-700 shadow-inner">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Tag
                            size={24}
                            strokeWidth={1.5}
                            className="text-slate-400 dark:text-slate-700"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                          <span className="font-black text-[15px] text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1 ml-3.5">
                          UID: {cat._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-mono font-black bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/5 uppercase tracking-tighter shadow-xs">
                      /{cat.slug}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[16px] font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                          {cat.itemCount || 0}
                        </span>
                        <div className="h-1.5 w-16 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-purple-600 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.4)]"
                            style={{
                              width: `${Math.min(100, (cat.itemCount || 0) * 10)}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest">
                        Total Items
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-30 group-hover/row:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => onEdit(cat)}
                        className="p-3.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 shadow-sm active:scale-95 group/edit"
                        title="Edit Category"
                      >
                        <Edit
                          size={20}
                          strokeWidth={2.5}
                          className="group-hover/edit:rotate-12 transition-transform"
                        />
                      </button>
                      <button
                        onClick={() => onDelete(cat)}
                        className="p-3.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 shadow-sm active:scale-95 group/purge"
                        title="Delete Category"
                      >
                        <Trash2
                          size={20}
                          strokeWidth={2.5}
                          className="group-hover/purge:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTable;
