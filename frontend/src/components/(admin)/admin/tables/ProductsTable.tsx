import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Filter,
  FilterX,
  Tag,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface ProductsTableProps {
  allProducts: any[];
  categories: any[];
  setProductDeleteConfirm: (product: any) => void;
  productPage: number;
  setProductPage: React.Dispatch<React.SetStateAction<number>>;
  totalProductPages?: number;
  itemsPerPage?: number;
  isAdminView?: boolean;
}

const ProductsTable = ({
  allProducts,
  categories,
  setProductDeleteConfirm,
  productPage,
  setProductPage,
  totalProductPages,
  itemsPerPage = 10,
  isAdminView = true,
}: ProductsTableProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBadge, setSelectedBadge] = useState<string>("all");
  const ITEMS_PER_PAGE = itemsPerPage;

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      let categoryMatch = false;
      if (selectedCategory === "all") {
        categoryMatch = true;
      } else if (selectedCategory === "uncategorized") {
        categoryMatch = !product.category;
      } else {
        const targetCategory = selectedCategory.toLowerCase();
        const productCategory = product.category?.toLowerCase();

        const catObj = categories?.find(
          (c) =>
            c.name?.toLowerCase() === targetCategory ||
            c.slug?.toLowerCase() === targetCategory,
        );
        categoryMatch =
          productCategory === targetCategory ||
          (catObj &&
            (productCategory === catObj.name?.toLowerCase() ||
              productCategory === catObj.slug?.toLowerCase()));
      }

      let badgeMatch = false;
      const productBadges =
        product.badges || (product.badge ? [product.badge] : []);
      if (selectedBadge === "all") {
        badgeMatch = true;
      } else if (selectedBadge === "none") {
        badgeMatch = productBadges.length === 0;
      } else {
        badgeMatch = productBadges.includes(selectedBadge);
      }

      return categoryMatch && badgeMatch;
    });
  }, [allProducts, selectedCategory, selectedBadge]);

  const uniqueBadges = useMemo(() => {
    const badgesSet = new Set<string>();
    allProducts.forEach((p) => {
      if (p.badges) {
        p.badges.forEach((b: string) => badgesSet.add(b));
      } else if (p.badge) {
        badgesSet.add(p.badge);
      }
    });
    return Array.from(badgesSet);
  }, [allProducts]);

  const totalPages =
    (totalProductPages ??
      Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)) ||
    1;
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * ITEMS_PER_PAGE,
    productPage * ITEMS_PER_PAGE,
  );

  return (
    <div
      key="products"
      className="bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-2xl animate-in fade-in duration-700 group/table"
    >
      <div className="p-5 lg:p-8 border-b border-slate-100 dark:border-white/5 space-y-6 relative overflow-hidden transition-colors">
        {/* Ambient Logic Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.3)] dark:shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-400 dark:text-slate-500">
                Product Management
              </h3>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">
                Manage your store inventory
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isAdminView && (
              <Link
                href={`${isAdminView ? "/admin" : "/vendor"}/products/new`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 dark:bg-white/5 hover:bg-purple-600 dark:hover:bg-purple-500 text-white dark:text-slate-200 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm border border-transparent dark:border-white/10 active:scale-95"
              >
                <Plus size={16} strokeWidth={3} /> Add Product
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-purple-500/20">
              {filteredProducts.length} Showing
            </span>
            <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-slate-200 dark:ring-white/5">
              {allProducts.length} Total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="relative flex-1 min-w-[140px] md:min-w-[200px] group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <Filter size={16} strokeWidth={2.5} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setProductPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500/50 transition-all appearance-none text-slate-700 dark:text-slate-300"
              >
                <option value="all">Total Categories</option>
                {categories?.map((c) => (
                  <option
                    key={c._id || c.name}
                    value={c.name}
                    className="dark:bg-[#1a1c23]"
                  >
                    {c.name}
                  </option>
                ))}
                <option
                  value="uncategorized"
                  className="italic text-slate-500 dark:bg-[#1a1c23]"
                >
                  Unassigned
                </option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[140px] md:min-w-[200px] group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <Tag size={16} strokeWidth={2.5} />
              </div>
              <select
                value={selectedBadge}
                onChange={(e) => {
                  setSelectedBadge(e.target.value);
                  setProductPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500/50 transition-all appearance-none text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Badges</option>
                {uniqueBadges.map((b) => (
                  <option key={b} value={b} className="dark:bg-[#1a1c23]">
                    {b}
                  </option>
                ))}
                <option
                  value="none"
                  className="italic text-slate-500 dark:bg-[#1a1c23]"
                >
                  No Badge
                </option>
              </select>
            </div>
          </div>

          {(selectedCategory !== "all" || selectedBadge !== "all") && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedBadge("all");
                setProductPage(1);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-95 shrink-0 uppercase tracking-widest border border-transparent hover:border-red-500/20"
            >
              <FilterX size={16} strokeWidth={3} />
              Reset
            </button>
          )}
        </div>
      </div>
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5">
        {paginatedProducts?.length === 0 ? (
          <div className="px-6 py-20 text-center flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-600">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
              <Package size={24} className="opacity-50" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              No Products Found
            </p>
          </div>
        ) : (
          paginatedProducts?.map((p) => (
            <div
              key={p.id}
              className="p-5 lg:p-8 space-y-5 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors relative"
            >
              <div className="flex gap-4 sm:gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden relative bg-white dark:bg-slate-900 shrink-0 shadow-inner group/img">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-contain p-2 opacity-80 group-hover/img:opacity-100 transition-opacity"
                      unoptimized
                    />
                  ) : (
                    <Package className="w-full h-full p-6 text-slate-200 dark:text-slate-700" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-black text-[13px] text-slate-900 dark:text-white truncate tracking-tight uppercase">
                      {p.title}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {(p.badges || (p.badge ? [p.badge] : [])).map(
                        (b: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest"
                          >
                            {b}
                          </span>
                        ),
                      )}
                      {!p.badges && !p.badge && (
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">
                          Standard Item
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-purple-600 dark:text-purple-400 tabular-nums">
                        {p.price}
                      </span>
                      {p.oldPrice && (
                        <span className="text-[9px] text-slate-300 dark:text-slate-500 line-through tabular-nums">
                          {p.oldPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!isAdminView && (
                        <>
                          <Link
                            href={`${isAdminView ? "/admin" : "/vendor"}/products/edit/${p.id}?fromPage=${productPage}`}
                            className="p-2.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1a1c23] shadow-sm"
                          >
                            <Edit size={16} strokeWidth={2.5} />
                          </Link>
                          <button
                            onClick={() => setProductDeleteConfirm(p)}
                            className="p-2.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1a1c23] shadow-sm"
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/3 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                    Stock Level
                  </span>
                  <span className="text-[11px] font-black text-slate-800 dark:text-slate-300 tabular-nums">
                    {p.stockQuantity || 0} units available
                  </span>
                </div>
                {!p.stockQuantity || p.stockQuantity === 0 ? (
                  <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                    Out of Stock
                  </span>
                ) : p.stockQuantity <= (p.lowStockThreshold || 5) ? (
                  <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                    Low Stock
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                    In Stock
                  </span>
                )}
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
                Product Info
              </th>
              {isAdminView && (
                <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                  Vendor
                </th>
              )}
              <th className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
                Inventory
              </th>
              <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5">
                Price
              </th>
              {!isAdminView && (
                <th className="px-10 py-5 border-b border-slate-100 dark:border-white/5 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedProducts?.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdminView ? 5 : 4}
                  className="px-10 py-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-600">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/5">
                      <Package size={32} className="opacity-30" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em]">
                      No Products Found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts?.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all group/row"
                >
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden relative bg-white dark:bg-slate-900 shrink-0 shadow-inner group-hover/row:border-purple-300 dark:group-hover/row:border-white/20 transition-all">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-contain p-2 opacity-80 group-hover/row:opacity-100 transition-opacity"
                            unoptimized
                          />
                        ) : (
                          <Package className="w-full h-full p-4 text-slate-200 dark:text-slate-700" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-[13px] text-slate-900 dark:text-slate-100 truncate tracking-tight uppercase group-hover/row:text-purple-600 dark:group-hover/row:text-white transition-colors">
                          {p.title}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {(p.badges || (p.badge ? [p.badge] : []))
                            .slice(0, 2)
                            .map((b: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest"
                              >
                                {b}
                              </span>
                            ))}
                          {!p.badges && !p.badge && (
                            <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">
                              Standard Item
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {isAdminView && (
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                        <span className="text-[11px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest truncate max-w-[150px]">
                          {p.vendorStoreName || "Internal"}
                        </span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className="font-black text-xs text-slate-900 dark:text-white tabular-nums">
                        {p.stockQuantity || 0} in stock
                      </span>
                      {!p.stockQuantity || p.stockQuantity === 0 ? (
                        <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Out of Stock
                        </span>
                      ) : p.stockQuantity <= (p.lowStockThreshold || 5) ? (
                        <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          In Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-[14px] text-slate-900 dark:text-white tabular-nums">
                        {p.price}
                      </span>
                      {p.oldPrice && (
                        <span className="text-[10px] text-slate-300 dark:text-slate-600 line-through tabular-nums">
                          {p.oldPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  {!isAdminView && (
                    <td className="px-10 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-right opacity-40 group-hover/row:opacity-100 transition-opacity">
                        <Link
                          href={`${isAdminView ? "/admin" : "/vendor"}/products/edit/${p.id}?fromPage=${productPage}`}
                          className="p-2.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5 active:scale-95 shadow-sm"
                        >
                          <Edit size={16} strokeWidth={2.5} />
                        </Link>
                        <button
                          onClick={() => setProductDeleteConfirm(p)}
                          className="p-2.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5 active:scale-95 shadow-sm"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 gap-4">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            disabled={productPage === 1}
            onClick={() => setProductPage((p) => p - 1)}
            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
          >
            Previous
          </button>
          <button
            disabled={productPage === totalPages || totalPages === 0}
            onClick={() => setProductPage((p) => p + 1)}
            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
          >
            Next
          </button>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-1 order-1 sm:order-2">
          <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
            Pages
          </span>
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 tabular-nums">
            {productPage}{" "}
            <span className="text-slate-300 dark:text-slate-700 mx-2">/</span>{" "}
            {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
