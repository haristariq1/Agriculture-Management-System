import {storageApi,KEYS,mutate} from "../index";
export function getattendance(){return storageApi.get(KEYS.attendance);}
export function markattendance(item,role){return mutate("attendance","add",item,role);}
export function updateattendance(item,role){return mutate("attendance","update",item,role);}
export function removeattendance(item,role){return mutate("attendance","remove",item,role);}