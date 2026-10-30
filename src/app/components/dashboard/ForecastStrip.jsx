import React from "react";
export default function ForecastStrip({ forecast }) {
  return (
    <div className="forecast">
      {forecast?.time?.map((day, i) => (
        <div key={day}>
          <small>
            {new Date(`${day}T12:00:00`).toLocaleDateString("en", {
              weekday: "short",
            })}
          </small>
          <i className="bi bi-cloud-sun" />
          <strong>{Math.round(forecast.temperature_2m_max[i])}°</strong>
        </div>
      ))}
    </div>
  );
}
