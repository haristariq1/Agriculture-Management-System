import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  selectStock,
  selectDashboard,
  selectOrdersSummary,
} from "../../redux/selectors";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
export default function HarvestSummary() {
  const stock = useSelector(selectStock),
    stats = useSelector(selectDashboard),
    orders = useSelector(selectOrdersSummary),
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
        <div>
          <small>ORDERS RECEIVED</small>
          <strong>{stats.orders}</strong>
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
      <div className="dashboard-grid mb-4">
        <section className="dash-card chart-card">
          <div className="dash-head">
            <div>
              <span className="eyebrow">STOCK ANALYTICS</span>
              <h3>Harvest vs sales</h3>
            </div>
          </div>
          <Bar
            data={{
              labels: stock.map((c) => c.name),
              datasets: [
                {
                  label: "Harvest",
                  data: stock.map((c) => c.harvestQty),
                  backgroundColor: "#b6dcc7",
                  borderRadius: 5,
                },
                {
                  label: "Sold",
                  data: stock.map((c) => c.sold),
                  backgroundColor: "#287d5f",
                  borderRadius: 5,
                },
              ],
            }}
            options={{ maintainAspectRatio: false }}
          />
        </section>
        <section className="dash-card">
          <div className="dash-head">
            <div>
              <span className="eyebrow">STOCK POSITION</span>
              <h3>Available by crop</h3>
            </div>
          </div>
          {stock.map((c) => (
            <div className="mb-3" key={c.id}>
              <div className="d-flex justify-content-between small mb-1">
                <strong>{c.name}</strong>
                <span>
                  {c.available} / {c.harvestQty} kg
                </span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${c.harvestQty ? (100 * c.available) / c.harvestQty : 0}%`,
                    background: "#3d9870",
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
