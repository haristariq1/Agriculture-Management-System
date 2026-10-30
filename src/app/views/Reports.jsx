import React from "react";
import ReportBuilder from "../components/reports/ReportBuilder";
import ActivityLog from "../components/reports/ActivityLog";
export default function Reports() {
  return (
    <>
      <div className="page-title">
        <span className="eyebrow">INSIGHTS & ACCOUNTABILITY</span>
        <h1>Reports & Activity</h1>
        <p>Review monthly performance and every recorded change.</p>
      </div>
      <ReportBuilder />
      <ActivityLog />
    </>
  );
}
