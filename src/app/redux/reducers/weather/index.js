const initial = { status: "idle", data: null, lastUpdated: null, error: null };
export const weatherReducer = (state = initial, action) => {
  switch (action.type) {
    case "weather/fetch_request":
      return { ...state, status: "loading", error: null };
    case "weather/fetch_success":
      return {
        ...state,
        status: "succeeded",
        data: action.payload,
        lastUpdated: new Date().toISOString(),
      };
    case "weather/fetch_failure":
      return { ...state, status: "failed", error: action.payload };
    default:
      return state;
  }
};
