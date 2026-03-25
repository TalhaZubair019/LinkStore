import React, { useState } from "react";
import {
  Package,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
  Boxes,
  BarChart3,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";
import WarehouseAssignModal from "../modals/WarehouseAssignModal";

interface WarehouseItem {
  productId: number;
  title: string;
  sku: string;
  stock: number;
}

interface WarehouseData {
  id?: string;
  _id?: string;
  warehouseName: string;
  location: string;
  capacity?: number;
  items: WarehouseItem[];
  totalItemsInWarehouse: number;
}

interface WarehousesTableProps {
  warehouseData: WarehouseData[];
  onRefresh: () => void;
  showToast: (message: string, type: "success" | "error") => void;
  onEdit: (warehouse: WarehouseData) => void;
  onDelete: (warehouse: WarehouseData) => void;
  onCreate: () => void;
}

const getStockBadge = (stock: number) => {
  if (stock === 0)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs rounded-full ring-1 ring-red-500/20 dark:ring-red-800/50">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Out of Stock
      </span>
    );
  if (stock <= 5)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-full ring-1 ring-amber-500/20 dark:ring-amber-800/50">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Low Stock
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-full ring-1 ring-emerald-500/20 dark:ring-emerald-800/50">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      In Stock
    </span>
  );
};

function WarehouseCard({
  warehouse,
  allWarehouses,
  onEdit,
  onDelete,
  onAssign,
}: {
  warehouse: WarehouseData;
  allWarehouses: WarehouseData[];
  onEdit: (w: WarehouseData) => void;
  onDelete: (w: WarehouseData) => void;
  onAssign: (w: WarehouseData) => void;
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const lowStock = warehouse.items.filter(
    (i) => i.stock > 0 && i.stock <= 5,
  ).length;
  const outOfStock = warehouse.items.filter((i) => i.stock === 0).length;
  const fillPct = warehouse.capacity 
    ? Math.round((warehouse.totalItemsInWarehouse / warehouse.capacity) * 100) 
    : 0;
  const displayFillPct = Math.min(fillPct, 100);

  const ProductTable = () => (
    <>
      {warehouse.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 dark:text-slate-500 gap-2">
          <PackageSearch size={28} />
          <p className="text-sm font-medium">No products assigned yet.</p>
        </div>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="px-4 py-2.5">Product</th>
              <th className="px-3 py-2.5">SKU</th>
              <th className="px-3 py-2.5 text-center">Units</th>
              <th className="px-3 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {warehouse.items.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200 max-w-[140px] truncate">
                  {item.title}
                </td>
                <td className="px-3 py-2.5">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded text-xs font-mono border border-slate-200 dark:border-slate-700">
                    {item.sku || `PROD-${item.productId}`}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center font-black text-slate-700 dark:text-slate-200">
                  {item.stock}
                </td>
                <td className="px-3 py-2.5">{getStockBadge(item.stock)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="hidden lg:flex min-h-[260px]">
        <div className="w-64 xl:w-72 shrink-0 flex flex-col justify-between p-5 border-r border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20">
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Boxes
                    size={18}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 dark:text-white text-sm leading-tight truncate">
                    {warehouse.warehouseName}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {warehouse.location}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(warehouse.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-purple-500 dark:text-purple-400 hover:text-purple-700 transition-colors"
                      title="Open in Google Maps"
                    >
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => onEdit(warehouse)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => onDelete(warehouse)}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {[
                {
                  label: "Units",
                  value: warehouse.totalItemsInWarehouse,
                  color: "text-purple-600 dark:text-purple-400",
                  bg: "bg-white dark:bg-slate-800",
                },
                {
                  label: "Low",
                  value: lowStock,
                  color: "text-amber-600 dark:text-amber-400",
                  bg: "bg-amber-50 dark:bg-amber-900/10",
                },
                {
                  label: "Out",
                  value: outOfStock,
                  color: "text-red-600 dark:text-red-400",
                  bg: "bg-red-50 dark:bg-red-900/10",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${s.bg} rounded-lg p-2 text-center border border-slate-100 dark:border-slate-700`}
                >
                  <p className={`text-base font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-1 flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <BarChart3 size={10} /> Usage ({warehouse.totalItemsInWarehouse} / {warehouse.capacity || 0})
              </span>
              <span className="font-black text-slate-600 dark:text-slate-300">
                {displayFillPct}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${fillPct > 100 ? "bg-red-500" : "bg-linear-to-r from-purple-500 to-indigo-400"}`}
                style={{ width: `${displayFillPct}%` }}
              />
            </div>
            {(lowStock > 0 || outOfStock > 0) && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg px-2.5 py-1.5">
                <AlertTriangle size={11} className="shrink-0" />
                <span className="font-medium leading-tight">
                  {outOfStock > 0 && `${outOfStock} out of stock`}
                  {outOfStock > 0 && lowStock > 0 && " · "}
                  {lowStock > 0 && `${lowStock} low`}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => onAssign(warehouse)}
            className="mt-4 w-full flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Plus size={13} /> Add Products
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Products ({warehouse.items.length})
            </span>
          </div>
          <ProductTable />
        </div>
      </div>
      <div className="lg:hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Boxes
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-slate-900 dark:text-white text-sm truncate">
                  {warehouse.warehouseName}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={10} className="text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {warehouse.location}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(warehouse.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-purple-500 dark:text-purple-400"
                  >
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => onEdit(warehouse)}
                className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => onDelete(warehouse)}
                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              {
                label: "Units",
                value: warehouse.totalItemsInWarehouse,
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-slate-50 dark:bg-slate-800/60",
              },
              {
                label: "Low Stock",
                value: lowStock,
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/10",
              },
              {
                label: "Out",
                value: outOfStock,
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-900/10",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} rounded-xl p-2.5 text-center`}
              >
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span className="font-bold text-slate-400 flex items-center gap-1">
              <BarChart3 size={10} /> Usage ({warehouse.totalItemsInWarehouse} / {warehouse.capacity || 0})
            </span>
            <span className="font-black text-slate-600 dark:text-slate-300">
              {displayFillPct}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${fillPct > 100 ? "bg-red-500" : "bg-linear-to-r from-purple-500 to-indigo-400"}`}
              style={{ width: `${displayFillPct}%` }}
            />
          </div>

          {(lowStock > 0 || outOfStock > 0) && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-lg px-3 py-2">
              <AlertTriangle size={12} className="shrink-0" />
              <span className="font-medium">
                {outOfStock > 0 && `${outOfStock} out of stock`}
                {outOfStock > 0 && lowStock > 0 && " · "}
                {lowStock > 0 && `${lowStock} running low`}
              </span>
            </div>
          )}
        </div>

        <div className="px-4 py-3 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <button
            onClick={() => onAssign(warehouse)}
            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Plus size={13} /> Add Products
          </button>
          <button
            onClick={() => setMobileExpanded((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            {mobileExpanded ? "Hide" : "View"} ({warehouse.items.length})
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${mobileExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {mobileExpanded && (
          <div className="border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
            <ProductTable />
          </div>
        )}
      </div>
    </div>
  );
}

export default function WarehousesTable({
  warehouseData,
  onRefresh,
  showToast,
  onEdit,
  onDelete,
  onCreate,
}: WarehousesTableProps) {
  const [assignModalState, setAssignModalState] = useState<{
    isOpen: boolean;
    warehouseName: string;
    location: string;
  } | null>(null);

  const totalUnits = warehouseData.reduce(
    (s, w) => s + w.totalItemsInWarehouse,
    0,
  );
  const totalProducts = warehouseData.reduce((s, w) => s + w.items.length, 0);
  const totalLow = warehouseData.reduce(
    (s, w) => s + w.items.filter((i) => i.stock > 0 && i.stock <= 5).length,
    0,
  );

  if (!warehouseData || warehouseData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-16 text-center">
        <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
          <Boxes size={36} className="text-purple-400 dark:text-purple-500" />
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
          No Warehouses Yet
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">
          Create your first storage location to start tracking inventory across
          your supply chain.
        </p>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all"
        >
          <Plus size={16} /> Create Warehouse
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Warehouses",
            value: warehouseData.length,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
          },
          {
            label: "Total Units",
            value: totalUnits,
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
          },
          {
            label: "Products",
            value: totalProducts,
            color: "text-teal-600 dark:text-teal-400",
            bg: "bg-teal-50 dark:bg-teal-900/20",
          },
          {
            label: "Low Stock Items",
            value: totalLow,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl px-5 py-4 flex flex-col gap-1 border border-white/60 dark:border-white/5 shadow-sm`}
          >
            <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-slate-800 dark:text-white">
          All Warehouses
        </h2>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus size={15} /> Create Warehouse
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5">
        {warehouseData.map((warehouse, index) => (
          <WarehouseCard
            key={warehouse._id || warehouse.id || index}
            warehouse={warehouse}
            allWarehouses={warehouseData}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssign={(w) =>
              setAssignModalState({
                isOpen: true,
                warehouseName: w.warehouseName,
                location: w.location,
              })
            }
          />
        ))}
      </div>

      {assignModalState?.isOpen && (
        <WarehouseAssignModal
          warehouseName={assignModalState.warehouseName}
          location={assignModalState.location}
          onClose={() => setAssignModalState(null)}
          onSuccess={() => {
            setAssignModalState(null);
            onRefresh();
            showToast(
              "Successfully assigned products to warehouse.",
              "success",
            );
          }}
          isAdminView={false} // WarehousesTable is currently only for vendors in the vendor dashboard
        />
      )}
    </div>
  );
}
