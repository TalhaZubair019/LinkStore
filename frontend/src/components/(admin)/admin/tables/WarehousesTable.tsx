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
  Layers,
  AlertCircle,
  PackageX,
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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-full ring-1 ring-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.1)] backdrop-blur-md text-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
        Out of Stock
      </span>
    );
  if (stock <= 5)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 font-black text-[10px] uppercase tracking-widest rounded-full ring-1 ring-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.1)] backdrop-blur-md text-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
        Low Stock
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-500 font-black text-[10px] uppercase tracking-widest rounded-full ring-1 ring-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)] backdrop-blur-md text-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
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
    <div className="w-full space-y-3">
      {warehouse.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 dark:text-slate-500 gap-4">
          <div className="relative group/empty">
            <div className="absolute inset-0 bg-purple-600 rounded-full blur-2xl opacity-20 group-hover/empty:opacity-40 transition-opacity animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 relative z-10">
              <PackageSearch size={32} className="text-purple-500" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-base font-black uppercase tracking-widest text-slate-200">
              Empty System Registry
            </p>
            <p className="text-[10px] font-medium text-slate-500 tracking-wider">
              NO ITEMS DETECTED IN THIS FACILITY
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {warehouse.items.map((item, idx) => {
            const statusColor =
              item.stock === 0 ? "rose" : item.stock <= 5 ? "amber" : "emerald";

            const colorMap = {
              rose: "bg-rose-500 shadow-rose-500/50",
              amber: "bg-amber-500 shadow-amber-500/50",
              emerald: "bg-emerald-500 shadow-emerald-500/50",
            };

            return (
              <div
                key={idx}
                className="group/item relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 gap-4 hover:bg-white/4 transition-all duration-500 first:rounded-t-3xl last:rounded-b-3xl overflow-hidden border-x border-transparent hover:border-white/5 active:scale-[0.99]"
              >
                {/* Neon Status Line */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-0.5 ${colorMap[statusColor]} shadow-[0_0_15px] opacity-0 group-hover/item:opacity-100 transition-all duration-500`}
                />
                <div
                  className={`absolute left-0 top-0 bottom-0 w-px ${colorMap[statusColor]} opacity-20`}
                />

                {/* Left Info Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight tracking-tight group-hover/item:text-purple-400 transition-colors truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>

                {/* Right Metrics Section */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                  {/* Stock Units Module - Compact Pill */}
                  <div className="text-center min-w-[52px] py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md shadow-lg group-hover/item:bg-white/10 transition-all duration-300">
                    <span className="block text-sm font-black text-white leading-tight">
                      {item.stock}
                    </span>
                    <span className="text-[7px] font-black uppercase tracking-tighter text-slate-500 opacity-60 -mt-0.5 block">
                      Units
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 min-w-[110px] sm:min-w-[120px] flex justify-end transform scale-90 origin-right">
                    {getStockBadge(item.stock)}
                  </div>
                </div>

                {/* Subtle Glow Trail */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-600/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="group/card bg-white dark:bg-[#0d0f14] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-700 overflow-hidden relative">
      {/* Ambient Corner Glows - Creates Depth */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/15 rounded-full blur-[100px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

      <div className="hidden md:flex min-h-[360px] relative z-10">
        {/* Sidebar Panel - Deep Dark System Controls */}
        <div className="w-72 lg:w-80 xl:w-96 shrink-0 flex flex-col p-8 border-r border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-white/2 backdrop-blur-xl relative overflow-hidden transition-all duration-500">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px]" />

          <div className="relative z-10">
            {/* Header Section */}
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-xl opacity-20 group-hover/card:opacity-60 transition-all duration-700" />
                  <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-md opacity-20 group-hover/card:opacity-40 transition-all duration-500" />
                  <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-2xl relative z-10 group-hover/card:scale-105 transition-transform duration-500">
                    <Boxes
                      size={26}
                      className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                </div>
                {/* Action Controls - Glass Pills */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                  <button
                    onClick={() => onEdit(warehouse)}
                    className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-xl transition-all active:scale-90"
                    title="Edit System Details"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(warehouse)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-white/5 rounded-xl transition-all active:scale-90"
                    title="Terminate Warehouse"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="font-black text-slate-900 dark:text-white text-xl leading-tight truncate tracking-tighter">
                  {warehouse.warehouseName}
                </h3>
                <div className="flex items-center gap-2 mt-2 group/loc">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <MapPin size={10} className="text-purple-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate opacity-70 group-hover/loc:opacity-100 transition-opacity">
                    {warehouse.location}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(warehouse.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-purple-500 hover:text-purple-400 transition-all hover:scale-110 active:scale-90"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Advanced Stats Modules - Futuristic System Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                {
                  label: "Units",
                  value: warehouse.totalItemsInWarehouse,
                  color: "text-purple-500",
                  glow: "shadow-purple-500/20",
                  bg: "bg-purple-500/[0.03] border-purple-500/20",
                  icon: <Boxes size={12} />,
                },
                {
                  label: "Low",
                  value: lowStock,
                  color: "text-amber-500",
                  glow: "shadow-amber-500/20",
                  bg: "bg-amber-500/[0.03] border-amber-500/20",
                  icon: <AlertCircle size={12} />,
                },
                {
                  label: "Out",
                  value: outOfStock,
                  color: "text-rose-500",
                  glow: "shadow-rose-500/20",
                  bg: "bg-rose-500/[0.03] border-rose-500/20",
                  icon: <PackageX size={12} />,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${s.bg} rounded-3xl p-3 text-center border relative overflow-hidden group/stat hover:scale-105 transition-all duration-500 cursor-default shadow-lg ${s.glow}`}
                >
                  <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                  <p className={`text-xl font-black ${s.color} drop-shadow-sm`}>
                    {s.value}
                  </p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 opacity-60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Neon Capacity - Progressive System Bar */}
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
                <div className="mb-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <BarChart3
                      size={12}
                      className="text-purple-500 animate-pulse"
                    />{" "}
                    Usage Capacity
                  </span>
                  <span
                    className={
                      fillPct > 100 ? "text-rose-500" : "text-purple-500"
                    }
                  >
                    {displayFillPct}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden shadow-inner flex relative p-0.5 border border-white/5">
                  <div className="absolute inset-0 bg-white/5 opacity-20" />
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(139,92,246,0.4)] relative z-10 ${
                      fillPct > 100
                        ? "bg-rose-600 shadow-rose-500/50"
                        : "bg-linear-to-r from-purple-600 via-indigo-500 to-cyan-500"
                    }`}
                    style={{ width: `${displayFillPct}%` }}
                  >
                    <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-md opacity-50 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* System Alert - Core Status Pulse */}
              {(lowStock > 0 || outOfStock > 0) && (
                <div className="flex items-center gap-3 text-[10px] text-amber-400 bg-amber-500/5 border border-amber-500/20 rounded-2xl px-4 py-3 backdrop-blur-md shadow-lg shadow-amber-900/10 transition-all hover:border-amber-500/40">
                  <div className="shrink-0 relative">
                    <div className="absolute inset-0 bg-amber-500 rounded-full blur-md opacity-40 animate-pulse" />
                    <AlertTriangle
                      size={16}
                      className="relative z-10 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                    />
                  </div>
                  <span className="font-black uppercase tracking-wider leading-none text-amber-500/80">
                    {outOfStock > 0 &&
                      `${outOfStock} Empty Bay${outOfStock > 1 ? "s" : ""}`}
                    {outOfStock > 0 && lowStock > 0 && " · "}
                    {lowStock > 0 && `${lowStock} Low Units`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onAssign(warehouse)}
            className="mt-8 group/btn relative w-full flex items-center justify-center gap-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-purple-900/40 border border-white/20"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-500"
            />{" "}
            Add Product Module
          </button>
        </div>

        {/* Database Content - Futuristic Terminal Dashboard */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white/1">
          <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-purple-600/5 to-transparent pointer-events-none" />

          <div className="px-8 py-7 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/10 dark:bg-white/1 backdrop-blur-xl relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                Inventory Database
                <span className="ml-3 inline-block w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner group/sku">
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase opacity-60">
                System Registry:
              </span>
              <span className="text-xs font-black text-purple-400 tracking-widest group-hover/sku:text-white transition-colors">
                {warehouse.items.length} Items Listed
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-auto max-h-[520px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent scrollbar-h-1 p-2">
            <ProductTable />
          </div>
        </div>
      </div>

      {/* Mobile view - Standard Card layout */}
      <div className="md:hidden relative z-10">
        <div className="p-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Boxes size={22} className="text-purple-500" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-slate-900 dark:text-white text-base truncate tracking-tight">
                  {warehouse.warehouseName}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 opacity-70">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {warehouse.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(warehouse)}
                className="p-2.5 text-slate-400 hover:text-blue-500 bg-slate-50 dark:bg-white/3 rounded-xl"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => onDelete(warehouse)}
                className="p-2.5 text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-white/3 rounded-xl"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              {
                label: "Units",
                value: warehouse.totalItemsInWarehouse,
                color: "text-purple-500",
                bg: "bg-purple-500/10 border-purple-500/20",
              },
              {
                label: "Low Stock",
                value: lowStock,
                color: "text-amber-500",
                bg: "bg-amber-500/10 border-amber-500/20",
              },
              {
                label: "Out",
                value: outOfStock,
                color: "text-rose-500",
                bg: "bg-rose-500/10 border-rose-500/20",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} rounded-2xl p-3 text-center border backdrop-blur-sm`}
              >
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-black text-slate-500/60 uppercase tracking-widest mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-slate-400 flex items-center gap-2">
                  <BarChart3 size={12} className="text-purple-500" /> Capacity
                </span>
                <span className="text-purple-500 font-black">
                  {displayFillPct}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${fillPct > 100 ? "bg-rose-500 shadow-rose-500/50" : "bg-linear-to-r from-purple-500 to-indigo-400 shadow-[0_0_8px_rgba(139,92,246,0.5)]"}`}
                  style={{ width: `${displayFillPct}%` }}
                />
              </div>
            </div>

            {(lowStock > 0 || outOfStock > 0) && (
              <div className="flex items-center gap-2 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <AlertTriangle size={14} className="shrink-0" />
                <span className="font-black uppercase tracking-tight">
                  {outOfStock > 0 && `${outOfStock} Empty`}
                  {outOfStock > 0 && lowStock > 0 && " · "}
                  {lowStock > 0 && `${lowStock} Low`}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 flex items-center justify-between bg-slate-50/30 dark:bg-white/1">
          <button
            onClick={() => onAssign(warehouse)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest"
          >
            <Plus size={16} /> Add Products
          </button>
          <button
            onClick={() => setMobileExpanded((v) => !v)}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors px-4 py-3"
          >
            {mobileExpanded ? "Collapse" : "Open List"} (
            {warehouse.items.length})
            <ChevronDown
              size={14}
              className={`transition-transform duration-500 ${mobileExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {mobileExpanded && (
          <div className="border-t border-slate-100 dark:border-white/5 overflow-x-auto bg-slate-50/10 dark:bg-white/1">
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
  const totalOut = warehouseData.reduce(
    (s, w) => s + w.items.filter((i) => i.stock === 0).length,
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Warehouses",
            value: warehouseData.length,
            color: "text-purple-500",
            glow: "from-purple-600 to-indigo-600",
            icon: <Boxes size={18} />,
          },
          {
            label: "Total Units",
            value: totalUnits,
            color: "text-blue-500",
            glow: "from-blue-600 to-cyan-600",
            icon: <Package size={18} />,
          },
          {
            label: "Products",
            value: totalProducts,
            color: "text-emerald-500",
            glow: "from-emerald-600 to-teal-600",
            icon: <Layers size={18} />,
          },
          {
            label: "Low Stock",
            value: totalLow,
            color: "text-amber-500",
            glow: "from-amber-600 to-orange-600",
            icon: <AlertTriangle size={18} />,
          },
          {
            label: "Out of Stock",
            value: totalOut,
            color: "text-rose-500",
            glow: "from-rose-600 to-red-600",
            icon: <AlertCircle size={18} />,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="relative group cursor-pointer w-full h-full"
          >
            {/* Dynamic Glow Aura */}
            <div
              className={`absolute -inset-1 bg-linear-to-br ${s.glow} rounded-2xl opacity-0 blur-xl group-hover:opacity-10 transition-all duration-1000`}
            />

            <div className="relative h-full p-5 rounded-2xl bg-white dark:bg-[#11141b] border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between group-hover:-translate-y-1 group-hover:shadow-2xl">
              {/* Soft Ambient Glows */}
              <div
                className={`absolute -top-12 -right-12 w-24 h-24 ${s.color.replace(
                  "text",
                  "bg",
                )}/10 rounded-full blur-2xl group-hover:opacity-40 duration-700`}
              />

              <div className="flex items-center justify-between relative z-10 w-full gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <span
                    className={`text-2xl font-black ${s.color} tracking-tight leading-none truncate`}
                  >
                    {s.value}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none truncate">
                    {s.label}
                  </span>
                </div>

                <div className="relative shrink-0">
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${s.glow} rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity`}
                  />
                  <div
                    className={`w-10 h-10 rounded-xl bg-linear-to-br ${s.glow} flex items-center justify-center backdrop-blur-xl text-white border border-white/20 shadow-lg relative z-10 shrink-0 ring-1 ring-white/10`}
                  >
                    {s.icon}
                  </div>
                </div>
              </div>
            </div>
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
          isAdminView={false}
        />
      )}
    </div>
  );
}
