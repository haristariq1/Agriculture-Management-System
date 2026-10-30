import React from "react";
export default function StatCard({ icon, label, value, foot, tone }) {
  return (
    <div className="kpi-card">
      <div className={`kpi-icon ${tone || ""}`}>
        <i className={`bi ${icon}`} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{foot}</small>
    </div>
  );
}
