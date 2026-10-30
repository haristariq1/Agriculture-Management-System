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
import { selectProfitByCrop } from "../../redux/selectors";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
export default function ProfitLossChart() {
  const rows = useSelector(selectProfitByCrop);
  return (
    <section className="dash-card chart-card mb-4">
      <div className="dash-head">
        <div>
          <span className="eyebrow">FINANCIAL ANALYTICS</span>
          <h3>Revenue vs expenses by crop</h3>
        </div>
      </div>
      <Bar
        data={{
          labels: rows.map((r) => r.crop),
          datasets: [
            {
              label: "Revenue PKR",
              data: rows.map((r) => r.revenue),
              backgroundColor: "#3b9c72",
              borderRadius: 5,
            },
            {
              label: "Expenses PKR",
              data: rows.map((r) => r.expense),
              backgroundColor: "#e2a564",
              borderRadius: 5,
            },
          ],
        }}
        options={{ maintainAspectRatio: false, responsive: true }}
      />
    </section>
  );
}
