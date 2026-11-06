import React from "react";
export default function StatusBadge({ status }) {
  const tone = ["Healthy", "Active", "Done", "Present", "Delivered"].includes(
    status,
  )
    ? "healthy"
    : ["Critical", "Overdue", "Absent"].includes(status)
      ? "critical"
      : "attention";
  return <span className={`health-badge ${tone}`}>{status}</span>;
}
