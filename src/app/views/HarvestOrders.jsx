import React from "react";
import CrudModule from "../components/CrudModule";
import HarvestSummary from "../components/harvest/HarvestSummary";
import OrdersTrendChart from "../components/harvest/OrdersTrendChart";
export default function HarvestOrders() {
  return (
    <>
      <div className="page-title">
        <span className="eyebrow">OPERATIONS</span>
        <h1>Harvest & Orders</h1>
        <p>Understand crop stock, sales and customer demand.</p>
      </div>
      <HarvestSummary />
      <OrdersTrendChart />
      <CrudModule module="orders" />
    </>
  );
}
