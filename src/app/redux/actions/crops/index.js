import * as api from '../../api/crops';
import {REQUEST,SUCCESS,FAILURE,CROP_REQUEST as T} from '../utilities';
export const GETCROPS=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.GET_CROP_REQUEST));
 try{const response=await api.getcrops();if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.GET_CROP_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.GET_CROP_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const ADDCROP=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.ADD_CROP_REQUEST));
 try{const response=await api.addcrop(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.ADD_CROP_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.ADD_CROP_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const UPDATECROP=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.UPDATE_CROP_REQUEST));
 try{const response=await api.updatecrop(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.UPDATE_CROP_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.UPDATE_CROP_FAILURE,error.message));failure?.(error.message);throw error;}
};
export const REMOVECROP=(data,moveToNext,failure)=>async(dispatch,getState)=>{
 dispatch(REQUEST(T.REMOVE_CROP_REQUEST));
 try{const response=await api.removecrop(data,getState().user.user?.role);if(!response.data.succeeded)throw Error(response.data.message);
 dispatch(SUCCESS(T.REMOVE_CROP_SUCCESS,response.data.data));moveToNext?.(response.data.data);return response.data.data;
 }catch(error){dispatch(FAILURE(T.REMOVE_CROP_FAILURE,error.message));failure?.(error.message);throw error;}
};
