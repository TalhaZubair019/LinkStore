"use client";

import React, { Dispatch, SetStateAction } from "react";
import RevenueStatCard from "@/components/(admin)/admin/ui/RevenueStatCard";
import { Wallet, TrendingUp, BarChart3 } from "lucide-react";
import OrdersStatCard from "@/components/(admin)/admin/ui/OrdersStatCard";
import UsersStatCard from "@/components/(admin)/admin/ui/UsersStatCard";
import RevenueChart from "@/components/(admin)/admin/charts/RevenueChart";
import TopSellingProducts from "@/components/(admin)/admin/charts/TopSellingProducts";
import OrderStatusChart from "@/components/(admin)/admin/charts/OrderStatusChart";
import ReviewRatingChart from "@/components/(admin)/admin/charts/ReviewRatingChart";
import OrderVelocityChart from "@/components/(admin)/admin/charts/OrderVelocityChart";
import AverageOrderValueChart from "@/components/(admin)/admin/charts/AverageOrderValueChart";
import TopReviewedProducts from "@/components/(admin)/admin/charts/TopReviewedProducts";
import ProductSalesChart from "@/components/(admin)/admin/charts/ProductSalesChart";
import CategorySalesChart from "@/components/(admin)/admin/charts/CategorySalesChart";
import SentimentChart from "@/components/(admin)/admin/charts/SentimentChart";
import WarehouseStockChart from "@/components/(admin)/admin/charts/WarehouseStockChart";
import { DashboardStats } from "@/app/(admin)/admin/types";
import VendorsStatCard from "@/components/(admin)/admin/ui/VendorsStatCard";
import AdminsStatCard from "@/components/(admin)/admin/ui/AdminsStatCard";
import FinancialStatCard from "@/components/(admin)/admin/ui/FinancialStatCard";

interface OverviewTabProps {
  stats: DashboardStats;
  filteredRevenueData?: any[];
  showRevenueDropdown?: boolean;
  setShowRevenueDropdown?: Dispatch<SetStateAction<boolean>>;
  revenueFilter?: "week" | "month" | "current-month" | "custom";
  setRevenueFilter?: Dispatch<
    SetStateAction<"week" | "month" | "current-month" | "custom">
  >;
  applyRevenueFilter?: (filter: any, start?: string, end?: string) => void;
  customStart?: string;
  setCustomStart?: Dispatch<SetStateAction<string>>;
  customEnd?: string;
  setCustomEnd?: Dispatch<SetStateAction<string>>;
  revenueLoading?: boolean;
  filteredAovData?: any[];
  showAovDropdown?: boolean;
  setShowAovDropdown?: Dispatch<SetStateAction<boolean>>;
  aovFilter?: "week" | "month" | "current-month" | "custom";
  setAovFilter?: Dispatch<
    SetStateAction<"week" | "month" | "current-month" | "custom">
  >;
  applyAovFilter?: (filter: any, start?: string, end?: string) => void;
  aovCustomStart?: string;
  setAovCustomStart?: Dispatch<SetStateAction<string>>;
  aovCustomEnd?: string;
  setAovCustomEnd?: Dispatch<SetStateAction<string>>;
  aovLoading?: boolean;
  isAdminView?: boolean;
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
  isAdminView = false,
}) => {
  return (
    <div key="overview" className="space-y-6 animate-in fade-in duration-300">
      <div
        className={`grid grid-cols-1 ${isAdminView ? "md:grid-cols-3" : "md:grid-cols-3"} gap-6`}
      >
        {!isAdminView && (
          <RevenueStatCard
            totalRevenue={stats.totalRevenue}
            grossRevenue={stats.grossRevenue ?? 0}
            cancelledRevenue={stats.cancelledRevenue ?? 0}
          />
        )}
        {isAdminView && (
          <FinancialStatCard
            title="Platform Commission"
            amount={stats.totalPlatformCommission ?? 0}
            subtitle="Net Revenue"
            subAmount={stats.totalRevenue}
            type="commission"
            subtitleIcon={<BarChart3 size={16} className="text-emerald-500" />}
          />
        )}
        {!isAdminView && (
          <>
            <FinancialStatCard
              title="Pending Commission"
              amount={stats.outstandingCommission ?? 0}
              subtitle="Paid"
              subAmount={stats.totalCommissionPaid ?? 0}
              type="commission"
              subtitleIcon={<Wallet size={16} className="text-emerald-500" />}
              extraStats={[
                {
                  label: "Revenue",
                  amount: stats.totalRevenue,
                  icon: <TrendingUp size={16} className="text-emerald-500" />,
                },
              ]}
            />
          </>
        )}
        {isAdminView && (
          <UsersStatCard
            totalUsers={stats.totalUsers}
            totalAdmins={stats.totalAdmins ?? 0}
            totalVendors={stats.totalVendors ?? 0}
          />
        )}
        {isAdminView && (
          <VendorsStatCard
            totalVendors={stats.totalVendors || 0}
            pendingVendors={stats.pendingVendors || 0}
          />
        )}
        {isAdminView && (
          <AdminsStatCard
            totalAdmins={stats.totalAdmins || 0}
            users={stats.users || []}
          />
        )}
        {!isAdminView && (
          <OrdersStatCard
            totalOrders={stats.totalOrders}
            cancelledOrders={stats.cancelledOrders ?? 0}
          />
        )}
      </div>

      {!isAdminView && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 min-w-0">
              <RevenueChart
                filteredRevenueData={filteredRevenueData!}
                showRevenueDropdown={showRevenueDropdown!}
                setShowRevenueDropdown={setShowRevenueDropdown!}
                revenueFilter={revenueFilter!}
                setRevenueFilter={setRevenueFilter!}
                applyRevenueFilter={applyRevenueFilter!}
                customStart={customStart!}
                setCustomStart={setCustomStart!}
                customEnd={customEnd!}
                setCustomEnd={setCustomEnd!}
                revenueLoading={revenueLoading!}
              />
            </div>
            <div className="min-w-0">
              <TopSellingProducts stats={stats} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="min-w-0">
              <OrderStatusChart stats={stats} />
            </div>
            <div className="min-w-0">
              <AverageOrderValueChart
                stats={stats}
                filteredAovData={filteredAovData!}
                showAovDropdown={showAovDropdown!}
                setShowAovDropdown={setShowAovDropdown!}
                aovFilter={aovFilter!}
                setAovFilter={setAovFilter!}
                applyAovFilter={applyAovFilter!}
                aovCustomStart={aovCustomStart!}
                setAovCustomStart={setAovCustomStart!}
                aovCustomEnd={aovCustomEnd!}
                setAovCustomEnd={setAovCustomEnd!}
                aovLoading={aovLoading!}
              />
            </div>
          </div>

          <div className="min-w-0">
            <CategorySalesChart stats={stats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="min-w-0">
              <ReviewRatingChart
                title="Product Rating Distribution"
                distribution={
                  stats.productRatingDistribution || stats.ratingDistribution
                }
                color="amber-400"
              />
            </div>
            <div className="min-w-0">
              <ReviewRatingChart
                title="Seller Rating Distribution"
                distribution={stats.sellerRatingDistribution || {}}
                color="purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="min-w-0">
              <ProductSalesChart stats={stats} />
            </div>
            <div className="min-w-0">
              <TopReviewedProducts stats={stats} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="min-w-0">
              <OrderVelocityChart stats={stats} />
            </div>
            <div className="min-w-0">
              <SentimentChart stats={stats} />
            </div>
          </div>

          <div className="min-w-0">
            <WarehouseStockChart stats={stats} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
