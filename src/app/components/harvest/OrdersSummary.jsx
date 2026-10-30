import React from "react";
import { useSelector } from "react-redux";
import { selectOrdersSummary } from "../../redux/selectors";
export default function OrdersSummary() {
  const orders = useSelector(selectOrdersSummary);
  return (
    <div className="report-grid mb-4">
      <div>
        <small>ORDERS RECEIVED</small>
        <strong>{orders.total}</strong>
      </div>
      <div>
        <small>PENDING ORDERS</small>
        <strong>{orders.pending}</strong>
      </div>
      <div>
        <small>DELIVERED ORDERS</small>
        <strong>{orders.delivered}</strong>
      </div>
    </div>
  );
}
