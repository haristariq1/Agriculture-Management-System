import React from "react";
import RecordTable from "../common/RecordTable";
export default function MaintenanceLog(props) {
  const totals = Object.entries(props.visible.reduce((result, service) => {
    result[service.equipmentId] = (result[service.equipmentId] || 0) + Number(service.cost || 0);
    return result;
  }, {}));
  return <>
    {totals.length > 0 && <div className="d-flex flex-wrap gap-2 mb-3">
      {totals.map(([id, cost]) => <span key={id} className="badge text-bg-light border p-2">
        {props.labels[id] || "Equipment"}: Rs {cost.toLocaleString("en-PK")} service cost
      </span>)}
    </div>}
    <RecordTable {...props} />
  </>;
}
