import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
export default function HarvestChart({ stock }) {
  return (
    <section className="dash-card chart-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">ANALYTICS</span>
          <h3>Harvest vs sales</h3>
        </div>
      </div>
      <Bar
        data={{
          labels: stock.map((c) => c.name),
          datasets: [
            {
              label: "Harvest kg",
              data: stock.map((c) => c.harvestQty),
              backgroundColor: "#b6dcc7",
              borderRadius: 6,
            },
            {
              label: "Sold kg",
              data: stock.map((c) => c.sold),
              backgroundColor: "#287d5f",
              borderRadius: 6,
            },
          ],
        }}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </section>
  );
}
