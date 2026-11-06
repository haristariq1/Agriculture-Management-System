import React from "react";
export default function Loader({ message = "Loading..." }) {
  return (
    <div className="p-4 d-flex align-items-center gap-2">
      <span
        className="spinner-border spinner-border-sm text-success"
        role="status"
      />
      <span>{message}</span>
    </div>
  );
}
