import React from "react";
export default function EmptyState({
  title = "No records found",
  description = "Try another search or add the first record.",
}) {
  return (
    <div className="empty-state">
      <i className="bi bi-inboxes" />
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
