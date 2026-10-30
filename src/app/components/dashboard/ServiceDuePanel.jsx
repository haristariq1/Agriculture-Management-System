import React from "react";
export default function ServiceDuePanel({ services }) {
  return (
    <div className="service-list">
      {services.slice(0, 5).map((e) => (
        <div key={e.id}>
          <span>{e.name}</span>
          <strong className={e.daysRemaining < 0 ? "text-danger" : ""}>
            {e.daysRemaining < 0 ? "Overdue" : `${e.daysRemaining}d left`}
          </strong>
        </div>
      ))}
    </div>
  );
}
