import React from "react";
import Image from "next/image";
import {
  X,
  ClipboardList,
  Users,
  MapPin,
  Package,
  CreditCard,
} from "lucide-react";
import { Order } from "@/app/(admin)/admin/types";
import StatusBadge from "../ui/StatusBadge";

interface OrderModalProps {
  selectedOrder: Order | null;
  onClose: () => void;
}

const OrderModal = ({ selectedOrder, onClose }: OrderModalProps) => {
  if (!selectedOrder) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <ClipboardList size={22} />
            </div>
            <div>
              <h3 className="font-black text-lg dark:text-white">
                Order #{selectedOrder.id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {new Date(selectedOrder.date).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg dark:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-8">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700">
            <div>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase mb-1">
                Status
              </p>
              <StatusBadge status={selectedOrder.status} />
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase mb-1">
                Total Amount
              </p>
              <p className="text-2xl font-bold dark:text-white">
                ${Number(selectedOrder.total).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase dark:text-gray-200">
                <Users size={16} className="text-purple-500" /> Customer Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="text-slate-500 dark:text-gray-400">
                    Name
                  </span>
                  {selectedOrder.customer?.name ? (
                    <span className="font-medium dark:text-gray-200">
                      {selectedOrder.customer.name}
                    </span>
                  ) : (
                    <span className="text-red-600 italic">Deleted Account</span>
                  )}
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="text-slate-500 dark:text-gray-400">
                    Email
                  </span>
                  <span className="font-medium dark:text-gray-200">
                    {selectedOrder.customer?.email || "—"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase dark:text-gray-200">
                <CreditCard size={16} className="text-purple-500" /> Financial
                Split
              </h4>
              <div className="space-y-3 text-sm bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border dark:border-gray-700">
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="text-slate-500 dark:text-gray-400">
                    Total Revenue
                  </span>
                  <span className="font-bold dark:text-gray-100">
                    ${Number(selectedOrder.total).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                  <span className="text-slate-500 dark:text-gray-400">
                    Vendor Payout (90%)
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    $
                    {(selectedOrder.vendorPayout ??
                      (Number(selectedOrder.total) * 0.9)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">
                    Platform Fee (10%)
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    $
                    {(selectedOrder.platformFee ??
                      (Number(selectedOrder.total) * 0.1)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase dark:text-gray-200">
                <MapPin size={16} className="text-purple-500" /> Shipping Info
              </h4>
              <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-xl text-sm text-slate-600 dark:text-gray-300 leading-relaxed border dark:border-gray-700">
                {selectedOrder.customer?.address ? (
                  <>
                    {selectedOrder.customer.address}
                    <br />
                    {selectedOrder.customer.city},{" "}
                    {selectedOrder.customer.country}
                  </>
                ) : (
                  <span className="italic text-slate-400 dark:text-gray-500">
                    No shipping address provided
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <h4 className="flex items-center gap-2 font-bold mb-4 text-sm uppercase dark:text-gray-200">
              <Package size={16} className="text-purple-500" /> Order Items (
              {selectedOrder.items.length})
            </h4>
            <div className="space-y-6">
              {Object.entries(
                selectedOrder.items.reduce(
                  (acc, item) => {
                    const vendor = item.vendorStoreName || "Internal";
                    if (!acc[vendor]) acc[vendor] = [];
                    acc[vendor].push(item);
                    return acc;
                  },
                  {} as Record<string, typeof selectedOrder.items>,
                ),
              ).map(([vendor, items], vIdx) => (
                <VendorSection
                  key={vIdx}
                  vendor={vendor}
                  items={items}
                  selectedOrder={selectedOrder}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VendorSection = ({
  vendor,
  items,
  selectedOrder,
}: {
  vendor: string;
  items: any[];
  selectedOrder: any;
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const displayItems = expanded ? items : items.slice(0, 5);
  const hiddenCount = items.length - 5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Vendor: {vendor}
          </span>
        </div>
        {(() => {
          const vendorId = items[0]?.vendorId;
          const vStatus = selectedOrder.vendorStatuses?.find(
            (vs: any) => vs.vendorId === vendorId,
          )?.status;
          if (!vStatus) return null;

          return (
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                vStatus === "Pending"
                  ? "bg-amber-50 text-amber-600 border-amber-100"
                  : vStatus === "Processing"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : vStatus === "Accepted"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : vStatus === "Shipped"
                        ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                        : vStatus === "Arrived in Country"
                          ? "bg-violet-50 text-violet-600 border-violet-100"
                          : vStatus === "Arrived in City"
                            ? "bg-pink-50 text-pink-600 border-pink-100"
                            : vStatus === "Out for Delivery"
                              ? "bg-orange-50 text-orange-600 border-orange-100"
                              : vStatus === "Delivered"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-red-50 text-red-600 border-red-100"
              }`}
            >
              {vStatus}
            </span>
          );
        })()}
      </div>
      <div className="border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-gray-800 text-slate-500 dark:text-gray-400 font-bold">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {displayItems.map((item, idx) => (
              <tr key={idx} className="dark:bg-gray-900">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-md relative overflow-hidden shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <span className="font-medium dark:text-gray-200">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-slate-600 dark:text-gray-400">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-gray-400">
                  ${Number(item.price).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-bold dark:text-gray-200">
                  ${Number(item.totalPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full py-2.5 bg-slate-50 dark:bg-gray-800 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-t dark:border-gray-700"
          >
            View {hiddenCount} more items
          </button>
        )}
        {expanded && items.length > 5 && (
          <button
            onClick={() => setExpanded(false)}
            className="w-full py-2.5 bg-slate-50 dark:bg-gray-800 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors border-t dark:border-gray-700"
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
