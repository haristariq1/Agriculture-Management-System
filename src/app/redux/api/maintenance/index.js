import {storageApi,KEYS,mutate} from "../index";
export function getmaintenance(){return storageApi.get(KEYS.maintenance);}
export function addservice(item,role){return mutate("maintenance","add",item,role);}
export function updateservice(item,role){return mutate("maintenance","update",item,role);}
export function removeservice(item,role){return mutate("maintenance","remove",item,role);}