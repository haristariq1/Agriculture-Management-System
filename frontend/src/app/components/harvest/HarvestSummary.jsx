import React from "react";
import { useSelector } from "react-redux";
import { selectStock, selectDashboard } from "../../redux/selectors";
import StockProgressBar from "./StockProgressBar";
import HarvestChart from "./HarvestChart";
export default function HarvestSummary() {
  const stock = useSelector(selectStock),
    stats = useSelector(selectDashboard),
    harvest = stats.harvest,
    sold = stats.sold;
  return (
    <>
      <div className="report-grid mb-4">
        <div>
          <small>HARVESTED</small>
          <strong>{harvest.toLocaleString()} kg</strong>
        </div>
        <div>
          <small>SOLD</small>
          <strong>{sold.toLocaleString()} kg</strong>
        </div>
        <div>
          <small>REMAINING</small>
          <strong>{(harvest - sold).toLocaleString()} kg</strong>
        </div>
      </div>
      <div className="dashboard-grid mb-4">
        <HarvestChart stock={stock} />
        <section className="dash-card">
          <div className="dash-head">
            <div>
              <span className="eyebrow">STOCK POSITION</span>
              <h3>Available by crop</h3>
            </div>
          </div>
          {stock.map((c) => (
            <StockProgressBar key={c.id} crop={c} />
          ))}
        </section>
      </div>
    </>
  );
}
