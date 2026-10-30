import {storageApi,KEYS,mutate} from "../index";
export function getworkers(){return storageApi.get(KEYS.workers);}
export function addworker(item,role){return mutate("workers","add",item,role);}
export function updateworker(item,role){return mutate("workers","update",item,role);}
export function removeworker(item,role){return mutate("workers","remove",item,role);}