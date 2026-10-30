import React from "react";

export default function AlertsPanel({ alerts }) {
  return (
    <section className="dash-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">ACTION CENTER</span>
          <h3>Alerts & attention</h3>
        </div>
        <span className="count-pill">{alerts.length}</span>
      </div>
      <div className="alerts-list">
        {alerts.length ? (
          alerts.slice(0, 6).map((a, i) => (
            <div className={`alert-item ${a.type}`} key={i}>
              <i
                className={`bi bi-${a.type === "danger" ? "exclamation-triangle" : "exclamation-circle"}`}
              />
              <span>{a.text}</span>
            </div>
          ))
        ) : (
          <div className="empty-mini">
            All clear. No urgent alerts right now.
          </div>
        )}
      </div>
    </section>
  );
}
