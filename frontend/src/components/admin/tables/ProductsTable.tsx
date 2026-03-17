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
}

const ProductsTable = ({
  allProducts,
  categories,
  setProductDeleteConfirm,
  productPage,
  setProductPage,
}: ProductsTableProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBadge, setSelectedBadge] = useState<string>("all");
  const ITEMS_PER_PAGE = 10;

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

  const totalProductPages =
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * ITEMS_PER_PAGE,
    productPage * ITEMS_PER_PAGE,
  );

  return (
    <div
      key="products"
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-300"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Product Management
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your store inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-purple-600 dark:hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm whitespace-nowrap border border-transparent dark:border-slate-700"
            >
              <Plus size={16} /> Add Product
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-purple-100 dark:ring-purple-800/50">
              {filteredProducts.length} Showing
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-700">
              {allProducts.length} Total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[150px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Filter size={16} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setProductPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all appearance-none text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">All Categories</option>
                {categories?.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="uncategorized" className="italic text-slate-500">
                  Uncategorized
                </option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[150px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Tag size={16} />
              </div>
              <select
                value={selectedBadge}
                onChange={(e) => {
                  setSelectedBadge(e.target.value);
                  setProductPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all appearance-none text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">All Badges</option>
                {uniqueBadges.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="none" className="italic text-slate-500">
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shrink-0"
            >
              <FilterX size={16} />
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {paginatedProducts?.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500 italic">
            No products found.
          </div>
        ) : (
          paginatedProducts?.map((p) => (
            <div
              key={p.id}
              className="p-4 space-y-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl border overflow-hidden relative bg-white shrink-0">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : (
                    <Package className="w-full h-full p-4 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {(p.badges || (p.badge ? [p.badge] : [])).join(", ") ||
                        "Standard Item"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-purple-600">
                        {p.price}
                      </span>
                      {p.oldPrice && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                          {p.oldPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/edit/${p.id}?fromPage=${productPage}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setProductDeleteConfirm(p)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-3 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Stock Level
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {p.stockQuantity || 0} units available
                  </span>
                </div>
                {!p.stockQuantity || p.stockQuantity === 0 ? (
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                    Out of Stock
                  </span>
                ) : p.stockQuantity <= (p.lowStockThreshold || 5) ? (
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                    Low Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                    In Stock
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Product Info</th>
              <th className="px-4 py-4">Inventory</th>
              <th className="px-8 py-4">Price</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedProducts?.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-8 py-10 text-center text-slate-500 italic"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts?.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border overflow-hidden relative bg-white shrink-0">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        ) : (
                          <Package className="w-full h-full p-3 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(p.badges || (p.badge ? [p.badge] : [])).join(
                            ", ",
                          ) || "Standard Item"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {p.stockQuantity || 0} in stock
                      </span>
                      {!p.stockQuantity || p.stockQuantity === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                          Out of Stock
                        </span>
                      ) : p.stockQuantity <= (p.lowStockThreshold || 5) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
                          Low Stock
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {p.price}
                      </span>
                      {p.oldPrice && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                          {p.oldPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-right">
                      <Link
                        href={`/admin/products/edit/${p.id}?fromPage=${productPage}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg inline-flex"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setProductDeleteConfirm(p)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <button
          disabled={productPage === 1}
          onClick={() => setProductPage((p) => p - 1)}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs lg:text-sm text-slate-500 font-medium">
          Page {productPage} of {totalProductPages}
        </span>
        <button
          disabled={
            productPage === totalProductPages || totalProductPages === 0
          }
          onClick={() => setProductPage((p) => p + 1)}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsTable;
