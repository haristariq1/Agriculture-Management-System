import React from "react";
import CrudModule from "../components/CrudModule";
import ProfitLossChart from "../components/expenses/ProfitLossChart";
export default function Expenses() {
  return (
    <>
      <div className="page-title">
        <span className="eyebrow">FINANCE</span>
        <h1>Expenses & Profit/Loss</h1>
        <p>Track spending and compare it with crop revenue.</p>
      </div>
      <ProfitLossChart />
      <CrudModule module="expenses" />
    </>
  );
}
