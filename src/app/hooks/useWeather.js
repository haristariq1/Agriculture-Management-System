import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FETCHWEATHER } from "../redux/actions/weather";
import { WEATHER } from "../../config";
export default function useWeather() {
  const dispatch = useDispatch();
  const weather = useSelector((s) => s.weather);
  useEffect(() => {
    dispatch(FETCHWEATHER());
    const id = setInterval(() => dispatch(FETCHWEATHER()), WEATHER.refreshMs);
    return () => clearInterval(id);
  }, [dispatch]);
  return weather;
}
