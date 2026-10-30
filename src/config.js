export const WEATHER = {
  city: import.meta.env.VITE_WEATHER_CITY || "Lahore",
  latitude: Number(import.meta.env.VITE_WEATHER_LATITUDE || 31.5204),
  longitude: Number(import.meta.env.VITE_WEATHER_LONGITUDE || 74.3587),
  refreshMs: Number(import.meta.env.VITE_WEATHER_REFRESH_MS || 600000),
};
