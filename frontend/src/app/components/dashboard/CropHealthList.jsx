import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
export default function CropHealthList({ stock }) {
  return (
    <section className="dash-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">CROP INTELLIGENCE</span>
          <h3>Crop health</h3>
        </div>
        <Link to="/crops">
          View crops <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
      <div className="crop-list">
        {stock.map((c) => (
          <div key={c.id}>
            <div className="d-flex justify-content-between">
              <strong>{c.name}</strong>
              <StatusBadge
                status={
                  Number(c.healthScore) < 50
                    ? "Critical"
                    : Number(c.healthScore) < 75
                      ? "Needs Attention"
                      : "Healthy"
                }
              />
            </div>
            <small>
              {c.field} · {c.available} kg available
            </small>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${c.healthScore}%`,
                  background:
                    Number(c.healthScore) < 50
                      ? "#df6a58"
                      : Number(c.healthScore) < 75
                        ? "#e6a94b"
                        : "#2e9d72",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
