export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
  vendorId?: string;
  vendorStoreName?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  userId: string;
  items: OrderItem[];
  vendorStoreName?: string;
  customer?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    city?: string;
    province?: string;
    country?: string;
    postcode?: string;
    phone?: string;
  };
  paymentMethod?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  trackingHistory?: { status: string; message: string; timestamp: string }[];
  platformFee?: number;
  vendorPayout?: number;
  vendorStatuses?: { vendorId: string; status: string }[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  cartCount: number;
  wishlistCount: number;
  cart?: any[];
  wishlist?: any[];
  createdAt?: string;
  isAdmin?: boolean;
  adminRole?: "super_admin" | "admin" | null;
  isVendor?: boolean;
  vendorProfile?: {
    storeName: string;
    storeSlug: string;
    storeDescription: string;
    outstandingCommission?: number;
    status: "pending" | "approved" | "rejected" | "suspended" | "";
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  grossRevenue: number;
  cancelledRevenue: number;
  totalPlatformCommission?: number;
  netRevenue?: number;
  totalEarnings?: number;
  outstandingCommission?: number;
  categoryPerformance?: {
    topSeller: { label: string; value: number };
    mostPopular: { label: string; value: number };
    highestValue: { label: string; value: number };
    bestFulfillment: { label: string; value: number };
  };
  recentOrders: Order[];
  users: UserData[];
  topProductsByQuantity: any[];
  topProductsByRevenue: any[];
  products: any[];
  revenueData: any[];
  ratingDistribution: Record<string, number>;
  topReviewedProducts: { name: string; image: string; count: number }[];
  totalReviews: number;
  productSentiment: {
    name: string;
    image: string;
    good: number;
    bad: number;
    neutral: number;
    total: number;
  }[];
  reviews: any[];
  productReviews?: any[];
  storeReviews?: any[];
  categorySalesData: { category: string; value: number }[];
  categoryInventoryData?: { category: string; value: number }[];
  orderVelocityData: { hour: string; count: number }[];
  orderTrendData: { date: string; count: number }[];
  categories: { _id: string; name: string; slug: string; image: string | null }[];
  warehouses?: any[];
  totalVendors?: number;
  pendingVendors?: number;
  statusCounts?: Record<string, number>;
  aovData?: { date: string; revenue: number; aov: number; orderCount: number }[];
}
