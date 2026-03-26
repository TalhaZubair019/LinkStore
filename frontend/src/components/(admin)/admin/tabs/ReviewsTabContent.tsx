"use client";

import React from "react";
import AdminReviewList from "@/components/(admin)/admin/tables/AdminReviewList";

interface ReviewsTabContentProps {
  onReviewDeleted?: () => void;
  reviews: any[];
  products?: any[];
  users?: any[];
  isStoreReview?: boolean;
  reviewPage: number;
  setReviewPage: (page: number) => void;
  itemsPerPage: number;
  searchTerm: string;
  isAdminView?: boolean;
}

const ReviewsTabContent: React.FC<ReviewsTabContentProps> = ({
  onReviewDeleted = () => {},
  reviews,
  products = [],
  users = [],
  isStoreReview = false,
  reviewPage,
  setReviewPage,
  itemsPerPage,
  searchTerm,
  isAdminView = false,
}) => {
  return (
    <AdminReviewList
      onReviewDeleted={onReviewDeleted}
      reviews={reviews}
      products={products}
      users={users}
      isStoreReview={isStoreReview}
      page={reviewPage}
      setPage={setReviewPage}
      itemsPerPage={itemsPerPage}
      searchTerm={searchTerm}
      isAdminView={isAdminView}
    />
  );
};

export default ReviewsTabContent;
