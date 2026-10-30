import { getWeather } from "../../api/weather";
import { REQUEST, SUCCESS, FAILURE } from "../utilities";
export const FETCHWEATHER = () => async (dispatch) => {
  dispatch(REQUEST("weather/fetch_request"));
  try {
    const r = await getWeather();
    dispatch(SUCCESS("weather/fetch_success", r.data));
  } catch (e) {
    dispatch(FAILURE("weather/fetch_failure", e.message));
  }
};
