import {getActivity} from '../../api/activity';
import {REQUEST,SUCCESS,FAILURE} from '../utilities';
export const GETACTIVITY=()=>async dispatch=>{dispatch(REQUEST('activity/get_request'));try{const r=await getActivity();dispatch(SUCCESS('activity/get_success',r.data.data))}catch(e){dispatch(FAILURE('activity/get_failure',e.message))}};
export const LOGACTIVITY=item=>({type:'activity/log_success',payload:item});
export const CLEARACTIVITY=()=>({type:'activity/clear_success'});
