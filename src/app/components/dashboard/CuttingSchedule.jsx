import React from "react";
import { Link } from "react-router-dom";
export default function CuttingSchedule({ due }) {
  return (
    <section className="dash-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">UPCOMING</span>
          <h3>Cutting schedule</h3>
        </div>
        <Link to="/crops">
          Full schedule <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
      {due.length ? (
        due.map((c) => (
          <div className="schedule-row" key={c.id}>
            <div className="date-tile">
              <strong>{new Date(`${c.cuttingDate}T12:00:00`).getDate()}</strong>
              <small>
                {new Date(`${c.cuttingDate}T12:00:00`).toLocaleDateString(
                  "en",
                  { month: "short" },
                )}
              </small>
            </div>
            <div>
              <strong>{c.name}</strong>
              <small>{c.field}</small>
            </div>
            <span className={c.daysRemaining < 0 ? "text-danger" : ""}>
              {c.daysRemaining < 0
                ? "Overdue"
                : c.daysRemaining === 0
                  ? "Today"
                  : `${c.daysRemaining} days`}
            </span>
          </div>
        ))
      ) : (
        <div className="empty-mini">No crops due in the next 7 days.</div>
      )}
    </section>
  );
}
