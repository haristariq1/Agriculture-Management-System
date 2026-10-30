import { WEATHER_REQUEST as T } from "../../actions/utilities";
const initial = { status: "idle", data: null, lastUpdated: null, error: null };
export const weatherReducer = (state = initial, action) => {
  switch (action.type) {
    case T.FETCH_REQUEST:
      return { ...state, status: "loading", error: null };
    case T.FETCH_SUCCESS:
      return {
        ...state,
        status: "succeeded",
        data: action.payload,
        lastUpdated: new Date().toISOString(),
      };
    case T.FETCH_FAILURE:
      return { ...state, status: "failed", error: action.payload };
    default:
      return state;
  }
};
