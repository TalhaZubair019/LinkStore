"use client";

import React from "react";
import AdminReviewList from "@/components/admin/tables/AdminReviewList";

interface ReviewsTabContentProps {
  onReviewDeleted: () => void;
  reviews: any[];
  products: any[];
  users: any[];
}

const ReviewsTabContent: React.FC<ReviewsTabContentProps> = ({
  onReviewDeleted,
  reviews,
  products,
  users,
}) => {
  return (
    <AdminReviewList
      onReviewDeleted={onReviewDeleted}
      reviews={reviews}
      products={products}
      users={users}
    />
  );
};

export default ReviewsTabContent;
