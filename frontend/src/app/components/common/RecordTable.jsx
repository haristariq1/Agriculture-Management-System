import React from "react";
import { formatCnic } from "../../utils/validators";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import { dayDiff } from "../../utils/formatters";
import { APP_SETTINGS } from "../../../config";
export default function RecordTable({
  module,
  fields,
  visible,
  labels,
  canEdit,
  setDetails,
  setForm,
  setConfirm,
}) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            {fields
              .filter((x) => x.type !== "image")
              .map((x) => (
                <th key={x.key}>{x.label}</th>
              ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr key={row.id}>
              {fields
                .filter((x) => x.type !== "image")
                .map((x) => (
                  <td key={x.key}>
                    {module === "buyers" &&
                      x.key === "name" &&
                      (row.photoUrl || row.imageBase64) && (
                        <img
                          className="buyer-thumb me-2"
                          src={row.photoUrl ? `${APP_SETTINGS.IMAGE_BASE}${row.photoUrl}` : row.imageBase64}
                          alt=""
                        />
                      )}
                    {x.key === "status" ? (
                      <StatusBadge status={module === "tasks" && row.status !== "Done" && dayDiff(row.dueDate) < 0 ? "Overdue" : row.status || "—"} />
                    ) : x.key === "cnic" ? (
                      formatCnic(row[x.key])
                    ) : labels[row[x.key]] || row[x.key] || "—"}
                  </td>
                ))}
              <td>
                <div className="d-flex gap-1">
                  {module === "buyers" && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setDetails(row)}
                    >
                      View
                    </button>
                  )}
                  {canEdit && !(module === "expenses" && row.sourceType) && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setForm({ ...row })}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setConfirm(row)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!visible.length && <EmptyState />}
    </div>
  );
}
