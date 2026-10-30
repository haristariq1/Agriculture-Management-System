import {storageApi,KEYS,mutate} from "../index";
export function getexpenses(){return storageApi.get(KEYS.expenses);}
export function addexpense(item,role){return mutate("expenses","add",item,role);}
export function updateexpense(item,role){return mutate("expenses","update",item,role);}
export function removeexpense(item,role){return mutate("expenses","remove",item,role);}