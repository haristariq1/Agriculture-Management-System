import React from "react";
import Loader from "../common/Loader";
import HumidityGauge from "./HumidityGauge";
import ForecastStrip from "./ForecastStrip";
import { WEATHER } from "../../../config";
import { weatherCondition } from "../../utils/weatherCondition";
export default function WeatherCard({ weather, current, forecast }) {
  const condition = weatherCondition(current?.weather_code);
  return (
    <section className="dash-card weather-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">FIELD CONDITIONS</span>
          <h3>Live weather</h3>
        </div>
        <span className="live-tag">● LIVE</span>
      </div>
      {weather.status === "loading" && !current ? (
        <Loader message="Loading live weather..." />
      ) : weather.status === "failed" && !current ? (
        <div className="alert alert-warning">
          Weather unavailable: {weather.error}
        </div>
      ) : current ? (
        <>
          <div className="weather-main">
            <i className={`bi ${condition.icon}`} />
            <div>
              <strong>{Math.round(current.temperature_2m)}°</strong>
              <span>{WEATHER.city}, Pakistan</span>
              <small>{condition.label}</small>
            </div>
          </div>
          <div className="weather-metrics">
            <HumidityGauge humidity={current.relative_humidity_2m} />
            <div>
              <i className="bi bi-wind" />
              <strong>{current.wind_speed_10m}</strong>
              <small>Wind km/h</small>
            </div>
            <div>
              <i className="bi bi-cloud-rain" />
              <strong>
                {forecast?.precipitation_probability_max?.[0] || 0}%
              </strong>
              <small>Rain chance</small>
            </div>
          </div>
          <ForecastStrip forecast={forecast} />
          <small className="updated">
            Updated{" "}
            {weather.lastUpdated
              ? new Date(weather.lastUpdated).toLocaleTimeString()
              : "—"}
          </small>
          {weather.status === "failed" && <small className="text-warning">Weather refresh failed; showing the last reading.</small>}
        </>
      ) : null}
    </section>
  );
}
