import * as api from '../../api/equipment';
import {REQUEST,SUCCESS,FAILURE,EQUIPMENT_REQUEST as T} from '../utilities';
export const GETEQUIPMENT=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.GET_EQUIPMENT_REQUEST));
 try{const response=await api.getequipment();if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.GET_EQUIPMENT_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.GET_EQUIPMENT_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const ADDEQUIPMENT=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.ADD_EQUIPMENT_REQUEST));
 try{const response=await api.addequipment(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.ADD_EQUIPMENT_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.ADD_EQUIPMENT_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const UPDATEEQUIPMENT=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.UPDATE_EQUIPMENT_REQUEST));
 try{const response=await api.updateequipment(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.UPDATE_EQUIPMENT_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.UPDATE_EQUIPMENT_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const REMOVEEQUIPMENT=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.REMOVE_EQUIPMENT_REQUEST));
 try{const response=await api.removeequipment(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.REMOVE_EQUIPMENT_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.REMOVE_EQUIPMENT_FAILURE,error.message));failure?.(error.message);throw error;}
};
