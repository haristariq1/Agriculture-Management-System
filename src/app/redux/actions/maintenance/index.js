import {GETEXPENSES} from '../expenses';
import {GETEQUIPMENT} from '../equipment';
import * as api from '../../api/maintenance';
import {REQUEST,SUCCESS,FAILURE,MAINTENANCE_REQUEST as T} from '../utilities';
export const GETMAINTENANCE=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.GET_MAINTENANCE_REQUEST));
 try{const response=await api.getmaintenance();if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.GET_MAINTENANCE_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.GET_MAINTENANCE_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const ADDSERVICE=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.ADD_MAINTENANCE_REQUEST));
 try{const response=await api.addservice(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.ADD_MAINTENANCE_SUCCESS,response.data.data));await dispatch(GETEXPENSES());await dispatch(GETEQUIPMENT());moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.ADD_MAINTENANCE_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const UPDATESERVICE=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.UPDATE_MAINTENANCE_REQUEST));
 try{const response=await api.updateservice(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.UPDATE_MAINTENANCE_SUCCESS,response.data.data));await dispatch(GETEXPENSES());await dispatch(GETEQUIPMENT());moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.UPDATE_MAINTENANCE_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const REMOVESERVICE=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.REMOVE_MAINTENANCE_REQUEST));
 try{const response=await api.removeservice(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.REMOVE_MAINTENANCE_SUCCESS,response.data.data));await dispatch(GETEXPENSES());await dispatch(GETEQUIPMENT());moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.REMOVE_MAINTENANCE_FAILURE,error.message));failure?.(error.message);throw error;}
};
