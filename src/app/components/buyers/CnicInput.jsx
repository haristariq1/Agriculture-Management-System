import React from "react";
import { formatCnic } from "../../utils/validators";
export default function CnicInput({ value, onChange }) {
  return (
    <input
      required
      className="form-control"
      inputMode="numeric"
      maxLength={15}
      placeholder="12345-1234567-1"
      value={value || ""}
      onChange={(e) => onChange(formatCnic(e.target.value))}
    />
  );
}
