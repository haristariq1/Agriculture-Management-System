import React from "react";
export default function ImageUpload({ value, onChange, onRemove }) {
  return (
    <>
      <input
        type="file"
        accept="image/jpeg,image/png"
        className="form-control"
        onChange={onChange}
      />
      {value && (
        <div className="d-flex align-items-center gap-2 mt-2">
          <img
            className="image-preview"
            src={value}
            alt="Buyer photo preview"
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      )}
    </>
  );
}
