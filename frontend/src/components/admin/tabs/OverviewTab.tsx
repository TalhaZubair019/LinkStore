"use client";

import React, { Dispatch, SetStateAction } from "react";
import RevenueStatCard from "@/components/admin/ui/RevenueStatCard";
import OrdersStatCard from "@/components/admin/ui/OrdersStatCard";
import UsersStatCard from "@/components/admin/ui/UsersStatCard";
import RevenueChart from "@/components/admin/charts/RevenueChart";
import TopSellingProducts from "@/components/admin/charts/TopSellingProducts";
import OrderStatusChart from "@/components/admin/charts/OrderStatusChart";
import ReviewRatingChart from "@/components/admin/charts/ReviewRatingChart";
import OrderVelocityChart from "@/components/admin/charts/OrderVelocityChart";
import AverageOrderValueChart from "@/components/admin/charts/AverageOrderValueChart";
import TopReviewedProducts from "@/components/admin/charts/TopReviewedProducts";
import ProductSalesChart from "@/components/admin/charts/ProductSalesChart";
import CategorySalesChart from "@/components/admin/charts/CategorySalesChart";
import CategoryInventoryChart from "@/components/admin/charts/CategoryInventoryChart";
import SentimentChart from "@/components/admin/charts/SentimentChart";
import WarehouseStockChart from "@/components/admin/charts/WarehouseStockChart";
import { DashboardStats } from "@/app/admin/types";

interface OverviewTabProps {
  stats: DashboardStats;
  filteredRevenueData: any[];
  showRevenueDropdown: boolean;
  setShowRevenueDropdown: Dispatch<SetStateAction<boolean>>;
  revenueFilter: "week" | "month" | "current-month" | "custom";
  setRevenueFilter: Dispatch<
    SetStateAction<"week" | "month" | "current-month" | "custom">
  >;
  applyRevenueFilter: (filter: any, start?: string, end?: string) => void;
  customStart: string;
  setCustomStart: Dispatch<SetStateAction<string>>;
  customEnd: string;
  setCustomEnd: Dispatch<SetStateAction<string>>;
  revenueLoading: boolean;
  filteredAovData: any[];
  showAovDropdown: boolean;
  setShowAovDropdown: Dispatch<SetStateAction<boolean>>;
  aovFilter: "week" | "month" | "current-month" | "custom";
  setAovFilter: Dispatch<
    SetStateAction<"week" | "month" | "current-month" | "custom">
  >;
  applyAovFilter: (filter: any, start?: string, end?: string) => void;
  aovCustomStart: string;
  setAovCustomStart: Dispatch<SetStateAction<string>>;
  aovCustomEnd: string;
  setAovCustomEnd: Dispatch<SetStateAction<string>>;
  aovLoading: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  filteredRevenueData,
  showRevenueDropdown,
  setShowRevenueDropdown,
  revenueFilter,
  setRevenueFilter,
  applyRevenueFilter,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  revenueLoading,
  filteredAovData,
  showAovDropdown,
  setShowAovDropdown,
  aovFilter,
  setAovFilter,
  applyAovFilter,
  aovCustomStart,
  setAovCustomStart,
  aovCustomEnd,
  setAovCustomEnd,
  aovLoading,
}) => {
  return (
    <div key="overview" className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueStatCard
          totalRevenue={stats.totalRevenue}
          grossRevenue={stats.grossRevenue ?? 0}
          cancelledRevenue={stats.cancelledRevenue ?? 0}
        />
        <OrdersStatCard
          totalOrders={stats.totalOrders}
          cancelledOrders={stats.cancelledOrders ?? 0}
        />
        <UsersStatCard
          totalUsers={stats.totalUsers}
          totalAdmins={stats.totalAdmins ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart
          filteredRevenueData={filteredRevenueData}
          showRevenueDropdown={showRevenueDropdown}
          setShowRevenueDropdown={setShowRevenueDropdown}
          revenueFilter={revenueFilter}
          setRevenueFilter={setRevenueFilter}
          applyRevenueFilter={applyRevenueFilter}
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
          revenueLoading={revenueLoading}
        />
        <TopSellingProducts stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart stats={stats} />
        <ReviewRatingChart stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderVelocityChart stats={stats} />
        <AverageOrderValueChart
          stats={stats}
          filteredAovData={filteredAovData}
          showAovDropdown={showAovDropdown}
          setShowAovDropdown={setShowAovDropdown}
          aovFilter={aovFilter}
          setAovFilter={setAovFilter}
          applyAovFilter={applyAovFilter}
          aovCustomStart={aovCustomStart}
          setAovCustomStart={setAovCustomStart}
          aovCustomEnd={aovCustomEnd}
          setAovCustomEnd={setAovCustomEnd}
          aovLoading={aovLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopReviewedProducts stats={stats} />
        <ProductSalesChart stats={stats} />
      </div>
      <CategorySalesChart stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentChart stats={stats} />
        <CategoryInventoryChart stats={stats} />
      </div>
      <WarehouseStockChart stats={stats} />
    </div>
  );
};

export default OverviewTab;
