"use client";

import React, { Dispatch, SetStateAction } from "react";
import ProductsTable from "@/components/admin/tables/ProductsTable";

interface ProductsTabContentProps {
  allProducts: any[];
  categories: any[];
  setProductDeleteConfirm: (product: any) => void;
  productPage: number;
  setProductPage: Dispatch<SetStateAction<number>>;
  isAdminView?: boolean;
}

const ProductsTabContent: React.FC<ProductsTabContentProps> = ({
  allProducts,
  categories,
  setProductDeleteConfirm,
  productPage,
  setProductPage,
  isAdminView = true,
}) => {
  return (
    <ProductsTable
      allProducts={allProducts}
      categories={categories}
      setProductDeleteConfirm={setProductDeleteConfirm}
      productPage={productPage}
      setProductPage={setProductPage}
      isAdminView={isAdminView}
    />
  );
};

export default ProductsTabContent;
