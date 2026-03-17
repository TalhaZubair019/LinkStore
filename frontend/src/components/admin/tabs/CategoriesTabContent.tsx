"use client";

import React from "react";
import CategoriesTable from "@/components/admin/tables/CategoriesTable";

interface CategoriesTabContentProps {
  categories: any[];
  products: any[];
  onAdd: () => void;
  onEdit: (cat: any) => void;
  onDelete: (cat: any) => void;
}

const CategoriesTabContent: React.FC<CategoriesTabContentProps> = ({
  categories,
  products,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const categoriesWithCounts = categories.map((cat) => {
    const itemCount = products.filter(
      (p) => p.category === cat.name || p.category === cat.slug,
    ).length;
    return { ...cat, itemCount };
  });

  return (
    <CategoriesTable
      categories={categoriesWithCounts}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default CategoriesTabContent;
