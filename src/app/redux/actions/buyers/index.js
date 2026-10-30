import * as api from "../../api/buyers";
import { REQUEST, SUCCESS, FAILURE, BUYER_REQUEST as T } from "../utilities";
export const GETBUYERS =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.GET_BUYER_REQUEST));
    try {
      const response = await api.getbuyers();
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.GET_BUYER_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.GET_BUYER_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const SAVEBUYER =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.ADD_BUYER_REQUEST));
    try {
      const response = await api.savebuyer(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.ADD_BUYER_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.ADD_BUYER_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const UPDATEBUYER =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.UPDATE_BUYER_REQUEST));
    try {
      const response = await api.updatebuyer(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.UPDATE_BUYER_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.UPDATE_BUYER_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const REMOVEBUYER =
  (data, moveToNext, failure) => async (dispatch, getState) => {
    dispatch(REQUEST(T.REMOVE_BUYER_REQUEST));
    try {
      const response = await api.removebuyer(data, getState().user.user?.role);
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(T.REMOVE_BUYER_SUCCESS, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(T.REMOVE_BUYER_FAILURE, error.message));
      failure?.(error.message);
      throw error;
    }
  };
