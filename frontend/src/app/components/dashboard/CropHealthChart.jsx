import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
export default function CropHealthChart({ health }) {
  return (
    <section className="dash-card chart-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">DISTRIBUTION</span>
          <h3>Health mix</h3>
        </div>
      </div>
      <div className="donut-wrap">
        <Doughnut
          data={{
            labels: ["Healthy", "Needs Attention", "Critical"],
            datasets: [
              {
                data: [health.healthy, health.attention, health.critical],
                backgroundColor: ["#2e9d72", "#e7b354", "#df6a58"],
                borderWidth: 0,
              },
            ],
          }}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    </section>
  );
}
