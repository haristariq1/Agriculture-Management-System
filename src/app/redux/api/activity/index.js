import {KEYS,ok,readList,writeList} from '../index';
export const getActivity=()=>Promise.resolve(ok(readList(KEYS.activity)));
export const logActivity=item=>Promise.resolve(writeList(KEYS.activity,[item,...readList(KEYS.activity)])?ok(item):{data:{succeeded:false,message:'Storage unavailable'}});
