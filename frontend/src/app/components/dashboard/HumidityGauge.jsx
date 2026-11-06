import React from "react";
export default function HumidityGauge({ humidity }) {
  const status = humidity < 40 ? "Low" : humidity > 75 ? "High" : "Optimal";
  return (
    <div>
      <i className="bi bi-droplet" />
      <strong>{humidity}%</strong>
      <small>Humidity • {status}</small>
    </div>
  );
}
