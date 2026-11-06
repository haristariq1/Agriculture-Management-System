import React from "react";
export default function ConfirmModal({ record, onCancel, onConfirm }) {
  if (!record) return null;
  return (
    <div className="modal-layer">
      <div className="modal-card confirm-card">
        <div className="danger-icon">
          <i className="bi bi-trash3" />
        </div>
        <h3>Delete this record?</h3>
        <p>
          This change is saved to your browser and recorded in the activity log.
        </p>
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-light" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete record
          </button>
        </div>
      </div>
    </div>
  );
}
