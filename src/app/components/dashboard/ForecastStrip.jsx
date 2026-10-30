import React from "react";
import { weatherCondition } from "../../utils/weatherCondition";
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
          <i className={`bi ${weatherCondition(forecast.weather_code?.[i]).icon}`} title={weatherCondition(forecast.weather_code?.[i]).label} />
          <strong>{Math.round(forecast.temperature_2m_max[i])}° / {Math.round(forecast.temperature_2m_min[i])}°</strong>
        </div>
      ))}
    </div>
  );
}
