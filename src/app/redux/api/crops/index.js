import {storageApi,KEYS,mutate} from "../index";
export function getcrops(){return storageApi.get(KEYS.crops);}
export function addcrop(item,role){return mutate("crops","add",item,role);}
export function updatecrop(item,role){return mutate("crops","update",item,role);}
export function removecrop(item,role){return mutate("crops","remove",item,role);}