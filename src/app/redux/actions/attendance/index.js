import * as api from "../../api/attendance";
import {
  REQUEST,
  SUCCESS,
  FAILURE,
  ATTENDANCE_REQUEST as T,
} from "../utilities";
export const GETATTENDANCE =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.GET_ATTENDANCE_REQUEST));
    try {
      const response = await api.getattendance();
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.GET_ATTENDANCE_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.GET_ATTENDANCE_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const MARKATTENDANCE =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.ADD_ATTENDANCE_REQUEST));
    try {
      const response = await api.markattendance(
        data,
        getState().user.user?.role,
      );
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.ADD_ATTENDANCE_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.ADD_ATTENDANCE_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const UPDATEATTENDANCE =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.UPDATE_ATTENDANCE_REQUEST));
    try {
      const response = await api.updateattendance(
        data,
        getState().user.user?.role,
      );
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.UPDATE_ATTENDANCE_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.UPDATE_ATTENDANCE_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const REMOVEATTENDANCE =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.REMOVE_ATTENDANCE_REQUEST));
    try {
      const response = await api.removeattendance(
        data,
        getState().user.user?.role,
      );
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.REMOVE_ATTENDANCE_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.REMOVE_ATTENDANCE_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
