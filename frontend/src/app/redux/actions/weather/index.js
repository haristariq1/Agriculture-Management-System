import { getWeather } from "../../api/weather";
import { REQUEST, SUCCESS, FAILURE, WEATHER_REQUEST as T } from "../utilities";
export const FETCHWEATHER = () => async (dispatch) => {
  dispatch(REQUEST(T.FETCH_REQUEST));
  try {
    const r = await getWeather();
    dispatch(SUCCESS(T.FETCH_SUCCESS, r.data));
  } catch (e) {
    dispatch(FAILURE(T.FETCH_FAILURE, e.message));
  }
};
