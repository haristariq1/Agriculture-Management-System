import * as api from '../../api/orders';
import {REQUEST,SUCCESS,FAILURE,ORDER_REQUEST as T} from '../utilities';
export const GETORDERS=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.GET_ORDER_REQUEST));
 try{const response=await api.getorders();if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.GET_ORDER_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.GET_ORDER_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const ADDORDER=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.ADD_ORDER_REQUEST));
 try{const response=await api.addorder(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.ADD_ORDER_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.ADD_ORDER_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const UPDATEORDER=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.UPDATE_ORDER_REQUEST));
 try{const response=await api.updateorder(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.UPDATE_ORDER_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.UPDATE_ORDER_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const REMOVEORDER=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.REMOVE_ORDER_REQUEST));
 try{const response=await api.removeorder(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.REMOVE_ORDER_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.REMOVE_ORDER_FAILURE,error.message));failure?.(error.message);throw error;}
};
