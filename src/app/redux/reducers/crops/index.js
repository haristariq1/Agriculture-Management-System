import {CROP_REQUEST as T} from '../../actions/utilities';
const initial={ crops:[],getLoading:false,getSuccess:false,getFailure:false,getError:null,addLoading:false,addSuccess:false,addFailure:false,addError:null,updateLoading:false,updateSuccess:false,updateFailure:false,updateError:null,removeLoading:false,removeSuccess:false,removeFailure:false,removeError:null,};
export const cropsReducer=(state=initial,action)=>{switch(action.type){
case T.GET_CROP_REQUEST:return {...state,getLoading:true,getSuccess:false,getFailure:false,getError:null};
case T.GET_CROP_SUCCESS:return {...state,getLoading:false,getSuccess:true,crops:action.payload};
case T.GET_CROP_FAILURE:return {...state,getLoading:false,getFailure:true,getError:action.payload};
case T.ADD_CROP_REQUEST:return {...state,addLoading:true,addSuccess:false,addFailure:false,addError:null};
case T.ADD_CROP_SUCCESS:return {...state,addLoading:false,addSuccess:true,crops:[...state.crops,action.payload]};
case T.ADD_CROP_FAILURE:return {...state,addLoading:false,addFailure:true,addError:action.payload};
case T.UPDATE_CROP_REQUEST:return {...state,updateLoading:true,updateSuccess:false,updateFailure:false,updateError:null};
case T.UPDATE_CROP_SUCCESS:return {...state,updateLoading:false,updateSuccess:true,crops:state.crops.map(x=>x.id===action.payload.id?{...x,...action.payload}:x)};
case T.UPDATE_CROP_FAILURE:return {...state,updateLoading:false,updateFailure:true,updateError:action.payload};
case T.REMOVE_CROP_REQUEST:return {...state,removeLoading:true,removeSuccess:false,removeFailure:false,removeError:null};
case T.REMOVE_CROP_SUCCESS:return {...state,removeLoading:false,removeSuccess:true,crops:state.crops.filter(x=>x.id!==action.payload.id)};
case T.REMOVE_CROP_FAILURE:return {...state,removeLoading:false,removeFailure:true,removeError:action.payload};
default:return state}};
