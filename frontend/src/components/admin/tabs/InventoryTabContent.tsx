"use client";

import React from "react";
import InventoryTable from "@/components/admin/tables/InventoryTable";

interface InventoryTabContentProps {
  products: any[];
  onAdjustStock: (product: any) => void;
}

const InventoryTabContent: React.FC<InventoryTabContentProps> = ({
  products,
  onAdjustStock,
}) => {
  return (
    <InventoryTable
      products={products}
      onAdjustStock={onAdjustStock}
    />
  );
};

export default InventoryTabContent;
