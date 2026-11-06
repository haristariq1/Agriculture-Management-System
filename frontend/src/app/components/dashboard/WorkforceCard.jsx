import React from "react";
import { Link } from "react-router-dom";
import { money } from "../../utils/formatters";
export default function WorkforceCard({ stats, present, absent, wages }) {
  return (
    <section className="dash-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">YOUR TEAM</span>
          <h3>Workforce today</h3>
        </div>
        <Link to="/workers">
          Manage team <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
      <div className="metric-row">
        <div>
          <strong>{stats.workers}</strong>
          <span>Total workers</span>
        </div>
        <div>
          <strong>{present}</strong>
          <span>Present</span>
        </div>
        <div>
          <strong>{absent}</strong>
          <span>Absent</span>
        </div>
      </div>
      <div className="wage-strip">
        Wages payable this month{" "}
        <strong>{money(wages.reduce((n, w) => n + w.unpaidWage, 0))}</strong>
      </div>
      <Link className="btn btn-sm btn-brand mt-3" to="/workers#attendance-register">
        Mark attendance
      </Link>
    </section>
  );
}
