import * as api from '../../api/expenses';
import {REQUEST,SUCCESS,FAILURE,EXPENSE_REQUEST as T} from '../utilities';
export const GETEXPENSES=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.GET_EXPENSE_REQUEST));
 try{const response=await api.getexpenses();if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.GET_EXPENSE_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.GET_EXPENSE_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const ADDEXPENSE=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.ADD_EXPENSE_REQUEST));
 try{const response=await api.addexpense(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.ADD_EXPENSE_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.ADD_EXPENSE_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const UPDATEEXPENSE=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.UPDATE_EXPENSE_REQUEST));
 try{const response=await api.updateexpense(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.UPDATE_EXPENSE_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.UPDATE_EXPENSE_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const REMOVEEXPENSE=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.REMOVE_EXPENSE_REQUEST));
 try{const response=await api.removeexpense(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.REMOVE_EXPENSE_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.REMOVE_EXPENSE_FAILURE,error.message));failure?.(error.message);throw error;}
};
