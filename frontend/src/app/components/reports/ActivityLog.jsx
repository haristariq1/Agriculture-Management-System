import React from "react";
import { useSelector } from "react-redux";
import { exportCsv } from "../../utils/exportCsv";
export default function ActivityLog() {
  const logs = useSelector((s) => s.activity.logs);
  return (
    <section className="section-card mt-4">
      <div className="section-heading">
        <div>
          <span className="eyebrow">AUDIT TRAIL</span>
          <h2>Activity log</h2>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => exportCsv("activity-log.csv", logs)}
        >
          Export CSV
        </button>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>When</th>
              <th>User</th>
              <th>Action</th>
              <th>Module</th>
              <th>Record</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((x) => (
              <tr key={x.id}>
                <td>{new Date(x.timestamp).toLocaleString()}</td>
                <td>{x.user}</td>
                <td className="text-capitalize">{x.action}</td>
                <td className="text-capitalize">{x.entity}</td>
                <td>{x.recordId}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs.length && (
          <div className="empty-state">
            No activity yet. Changes to farm records appear here.
          </div>
        )}
      </div>
    </section>
  );
}
