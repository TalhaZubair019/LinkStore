"use client";

import React, { Dispatch, SetStateAction } from "react";
import OrdersTable from "@/components/admin/tables/OrdersTable";
import { Order, UserData } from "@/app/admin/types";

interface OrdersTabContentProps {
  allOrders: Order[];
  handleStatusChange: (orderId: string, newStatus: string) => void;
  requestCancelOrder: (order: Order) => void;
  setSelectedOrder: Dispatch<SetStateAction<Order | null>>;
  orderPage: number;
  setOrderPage: Dispatch<SetStateAction<number>>;
  users: UserData[];
  updatingOrderId: string | null;
  hideEmail?: boolean;
}

const OrdersTabContent: React.FC<OrdersTabContentProps> = ({
  allOrders,
  handleStatusChange,
  requestCancelOrder,
  setSelectedOrder,
  orderPage,
  setOrderPage,
  users,
  updatingOrderId,
  hideEmail = false,
}) => {
  return (
    <OrdersTable
      allOrders={allOrders}
      handleStatusChange={handleStatusChange}
      requestCancelOrder={requestCancelOrder}
      setSelectedOrder={setSelectedOrder}
      orderPage={orderPage}
      setOrderPage={setOrderPage}
      users={users}
      updatingOrderId={updatingOrderId}
      hideEmail={hideEmail}
    />
  );
};

export default OrdersTabContent;
