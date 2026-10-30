import React from "react";
export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="search"
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
