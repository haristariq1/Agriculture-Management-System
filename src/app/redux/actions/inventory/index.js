import * as api from '../../api/inventory';
import {REQUEST,SUCCESS,FAILURE,INVENTORY_REQUEST as T} from '../utilities';
export const GETINVENTORY=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.GET_INVENTORY_REQUEST));
 try{const response=await api.getinventory();if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.GET_INVENTORY_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.GET_INVENTORY_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const ADDITEM=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.ADD_INVENTORY_REQUEST));
 try{const response=await api.additem(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.ADD_INVENTORY_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.ADD_INVENTORY_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const UPDATEITEM=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.UPDATE_INVENTORY_REQUEST));
 try{const response=await api.updateitem(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.UPDATE_INVENTORY_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.UPDATE_INVENTORY_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const REMOVEITEM=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.REMOVE_INVENTORY_REQUEST));
 try{const response=await api.removeitem(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.REMOVE_INVENTORY_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.REMOVE_INVENTORY_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const ADDUSAGE=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.USAGE_INVENTORY_REQUEST));
 try{const response=await api.addusage(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.USAGE_INVENTORY_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.USAGE_INVENTORY_FAILURE,error.message));failure?.(error.message);throw error;}
};
