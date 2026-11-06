import * as api from "../../api/tasks";
import { REQUEST, SUCCESS, FAILURE, TASK_REQUEST as T } from "../utilities";
export const GETTASKS =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.GET_TASK_REQUEST));
    try {
      const response = await api.gettasks();
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.GET_TASK_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.GET_TASK_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const ADDTASK =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.ADD_TASK_REQUEST));
    try {
      const response = await api.addtask(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.ADD_TASK_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.ADD_TASK_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const UPDATETASK =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.UPDATE_TASK_REQUEST));
    try {
      const response = await api.updatetask(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.UPDATE_TASK_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.UPDATE_TASK_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const REMOVETASK =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.REMOVE_TASK_REQUEST));
    try {
      const response = await api.removetask(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.REMOVE_TASK_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.REMOVE_TASK_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
