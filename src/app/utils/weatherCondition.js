export function weatherCondition(code) {
  const value = Number(code);
  if (value === 0) return { label: "Clear sky", icon: "bi-sun" };
  if ([1, 2].includes(value)) return { label: "Partly cloudy", icon: "bi-cloud-sun" };
  if (value === 3) return { label: "Overcast", icon: "bi-cloud" };
  if ([45, 48].includes(value)) return { label: "Foggy", icon: "bi-cloud-fog" };
  if (value >= 51 && value <= 67) return { label: "Rain", icon: "bi-cloud-rain" };
  if (value >= 71 && value <= 86) return { label: "Snow", icon: "bi-cloud-snow" };
  if (value >= 95) return { label: "Thunderstorm", icon: "bi-cloud-lightning-rain" };
  return { label: "Mixed conditions", icon: "bi-cloud-sun" };
}
