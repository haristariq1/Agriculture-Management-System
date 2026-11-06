import React from "react";
import { Link } from "react-router-dom";
import ServiceDuePanel from "./ServiceDuePanel";
export default function EquipmentStatusCard({ equipment, service }) {
  return (
    <section className="dash-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">FLEET STATUS</span>
          <h3>Equipment</h3>
        </div>
        <Link to="/equipment">
          Manage fleet <i className="bi bi-arrow-up-right" />
        </Link>
      </div>
      <div className="metric-row">
        <div>
          <strong>{equipment.Active}</strong>
          <span>Active</span>
        </div>
        <div>
          <strong>{equipment["Under Repair"]}</strong>
          <span>Under repair</span>
        </div>
        <div>
          <strong>{equipment.Idle}</strong>
          <span>Idle</span>
        </div>
      </div>
      <ServiceDuePanel services={service} />
    </section>
  );
}
