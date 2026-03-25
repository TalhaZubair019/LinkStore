"use client";

import React from "react";
import WarehousesTable from "@/components/(admin)/admin/tables/WarehousesTable";

interface WarehousesTabContentProps {
  warehouseData: any[];
  onRefresh: () => void;
  showToast: (message: string, type?: "success" | "error") => void;
  onCreate: () => void;
  onEdit: (wh: any) => void;
  onDelete: (wh: any) => void;
}

const WarehousesTabContent: React.FC<WarehousesTabContentProps> = ({
  warehouseData,
  onRefresh,
  showToast,
  onCreate,
  onEdit,
  onDelete,
}) => {
  return (
    <WarehousesTable
      warehouseData={warehouseData}
      onRefresh={onRefresh}
      showToast={showToast}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default WarehousesTabContent;
