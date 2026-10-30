import axios from "axios";
import { WEATHER } from "../../../../config";
export async function getWeather() {
  return axios.get("https://api.open-meteo.com/v1/forecast", {
    params: {
      latitude: WEATHER.latitude,
      longitude: WEATHER.longitude,
      current:
        "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation",
      daily:
        "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto",
      forecast_days: 5,
    },
  });
}
