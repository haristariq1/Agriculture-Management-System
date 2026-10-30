import { getActivity } from "../../api/activity";
import { REQUEST, SUCCESS, FAILURE, ACTIVITY_REQUEST as T } from "../utilities";
export const GETACTIVITY = () => async (dispatch) => {
  dispatch(REQUEST(T.GET_REQUEST));
  try {
    const response = await getActivity();
    if (!response.data.succeeded) throw Error(response.data.message);
    dispatch(SUCCESS(T.GET_SUCCESS, response.data.data));
    return response.data.data;
  } catch (error) {
    dispatch(FAILURE(T.GET_FAILURE, error.message));
    throw error;
  }
};
export const LOGACTIVITY = (item) => SUCCESS(T.LOG_SUCCESS, item);
export const CLEARACTIVITY = () => (dispatch, getState) => {
  dispatch(REQUEST(T.CLEAR_REQUEST));
  if (getState().user.user?.role !== "Admin") {
    const message = "Admin permission required";
    dispatch(FAILURE(T.CLEAR_FAILURE, message));
    throw Error(message);
  }
  dispatch(SUCCESS(T.CLEAR_SUCCESS, []));
};
