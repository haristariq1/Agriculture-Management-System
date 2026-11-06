import * as api from "../../api/workers";
import { REQUEST, SUCCESS, FAILURE, WORKER_REQUEST as T } from "../utilities";
export const GETWORKERS =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.GET_WORKER_REQUEST));
    try {
      const response = await api.getworkers();
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.GET_WORKER_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.GET_WORKER_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const ADDWORKER =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.ADD_WORKER_REQUEST));
    try {
      const response = await api.addworker(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.ADD_WORKER_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.ADD_WORKER_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const UPDATEWORKER =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.UPDATE_WORKER_REQUEST));
    try {
      const response = await api.updateworker(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.UPDATE_WORKER_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.UPDATE_WORKER_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const REMOVEWORKER =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.REMOVE_WORKER_REQUEST));
    try {
      const response = await api.removeworker(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.REMOVE_WORKER_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.REMOVE_WORKER_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
