import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { selectHarvestSalesTrend } from "../../redux/selectors";
import { dateText } from "../../utils/formatters";
export default function HarvestTrendChart() {
  const trend = useSelector(selectHarvestSalesTrend);
  return <section className="dash-card chart-card mb-4">
    <div className="dash-head"><div><span className="eyebrow">TIME SERIES</span><h3>Harvest and sales over time</h3></div></div>
    {trend.dates.length ? <Bar
      data={{ labels: trend.dates.map(dateText), datasets: [
        { label: "Harvested kg", data: trend.harvest, backgroundColor: "#b6dcc7", borderRadius: 5 },
        { label: "Sold kg", data: trend.sales, backgroundColor: "#287d5f", borderRadius: 5 },
      ] }}
      options={{ maintainAspectRatio: false, responsive: true, scales: { y: { beginAtZero: true } } }}
    /> : <p className="text-muted">No harvest or sale dates yet.</p>}
  </section>;
}
