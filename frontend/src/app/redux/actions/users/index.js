import * as api from "../../api/users";
import { REQUEST, SUCCESS, FAILURE, USER_REQUEST as T } from "../utilities";
const run =
  (request, success, failureType, call, moveToNext, failure) =>
  async (dispatch) => {
    dispatch(REQUEST(request));
    try {
      const response = await call();
      if (!response.data.succeeded) throw Error(response.data.message);
      dispatch(SUCCESS(success, response.data.data));
      moveToNext?.(response.data.data);
      return response.data.data;
    } catch (error) {
      dispatch(FAILURE(failureType, error.message));
      failure?.(error.message);
      throw error;
    }
  };
export const LOGIN = (username, password, moveToNext, failure) =>
  run(
    T.LOGIN_REQUEST,
    T.LOGIN_SUCCESS,
    T.LOGIN_FAILURE,
    () => api.login(username, password),
    moveToNext,
    failure,
  );
export const REGISTER = (data, moveToNext, failure) =>
  run(T.SIGNUP_REQUEST, T.SIGNUP_SUCCESS, T.SIGNUP_FAILURE, () => api.register(data), moveToNext, failure);
export const LOGOUT = (moveToNext, failure) =>
  run(
    T.LOGOUT_REQUEST,
    T.LOGOUT_SUCCESS,
    T.LOGOUT_FAILURE,
    api.logout,
    moveToNext,
    failure,
  );
export const GETALLUSERS = (moveToNext, failure) =>
  run(
    T.GET_ALL_USERS_REQUEST,
    T.GET_ALL_USERS_SUCCESS,
    T.GET_ALL_USERS_FAILURE,
    api.getAllUsers,
    moveToNext,
    failure,
  );
export const GETUSER = (id, moveToNext, failure) =>
  run(
    T.GET_USER_REQUEST,
    T.GET_USER_SUCCESS,
    T.GET_USER_FAILURE,
    () => api.getUser(id),
    moveToNext,
    failure,
  );
export const CREATEUSER = (data, moveToNext, failure) => (dispatch, getState) =>
  run(
    T.CREATE_REQUEST,
    T.CREATE_SUCCESS,
    T.CREATE_FAILURE,
    () => api.create(data, getState().user.user?.role),
    moveToNext,
    failure,
  )(dispatch);
export const UPDATEUSER = (data, moveToNext, failure) => (dispatch, getState) =>
  run(
    T.UPDATE_USER_REQUEST,
    T.UPDATE_USER_SUCCESS,
    T.UPDATE_USER_FAILURE,
    () => api.updateUser(data, getState().user.user?.role),
    moveToNext,
    failure,
  )(dispatch);
export const REMOVEUSER = (id, moveToNext, failure) => (dispatch, getState) =>
  run(
    T.REMOVE_USER_REQUEST,
    T.REMOVE_USER_SUCCESS,
    T.REMOVE_USER_FAILURE,
    () => api.removeUser(id, getState().user.user?.role),
    moveToNext,
    failure,
  )(dispatch);
