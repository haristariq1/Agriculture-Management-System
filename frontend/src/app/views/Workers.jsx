import React from "react";
import CrudModule from "../components/CrudModule";
import WageSummary from "../components/workers/WageSummary";
import AttendanceRegister from "../components/workers/AttendanceRegister";
export default function Workers() {
  return (
    <>
      <div className="page-title">
        <span className="eyebrow">TEAM & LABOUR</span>
        <h1>People behind the harvest</h1>
        <p>Manage your workforce, daily attendance and monthly wages.</p>
      </div>
      <CrudModule module="workers" />
      <div className="mt-4">
        <AttendanceRegister />
      </div>
      <div className="mt-4">
        <CrudModule module="attendance" />
      </div>
      <div className="mt-4">
        <WageSummary />
      </div>
    </>
  );
}
