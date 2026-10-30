import * as api from '../../api/users';
import {REQUEST,SUCCESS,FAILURE} from '../utilities';
export const LOGIN=(username,password)=>async dispatch=>{dispatch(REQUEST('user/login_request'));try{const r=await api.login(username,password);if(!r.data.succeeded)throw Error(r.data.message);dispatch(SUCCESS('user/login_success',r.data.data));return r.data.data}catch(e){dispatch(FAILURE('user/login_failure',e.message));throw e}};
export const LOGOUT=()=>async dispatch=>{dispatch(REQUEST('user/logout_request'));await api.logout();dispatch(SUCCESS('user/logout_success',null))};
export const GETALLUSERS=()=>async dispatch=>{dispatch(REQUEST('user/getall_request'));const r=await api.getAllUsers();dispatch(SUCCESS('user/getall_success',r.data.data))};
export const GETUSER=username=>async dispatch=>{dispatch(REQUEST('user/get_request'));const r=await api.getUser(username);dispatch(SUCCESS('user/get_success',r.data.data))};
export const CREATEUSER=()=>async dispatch=>{dispatch(FAILURE('user/create_failure','Demo users are fixed'))};
export const UPDATEUSER=CREATEUSER;
export const REMOVEUSER=CREATEUSER;
