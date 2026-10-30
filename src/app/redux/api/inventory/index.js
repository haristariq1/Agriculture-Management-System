import {storageApi,KEYS,mutate,readList,writeList,bad,ok,uid} from "../index";
export function getinventory(){return storageApi.get(KEYS.inventory);}
export function additem(item,role){return mutate("inventory","add",item,role);}
export function updateitem(item,role){return mutate("inventory","update",item,role);}
export function removeitem(item,role){return mutate("inventory","remove",item,role);}
export function addusage(data,role){if(!role)return Promise.resolve(bad('Please sign in'));const list=readList(KEYS.inventory),item=list.find(x=>x.id===data.id),quantity=Number(data.quantity);if(!item||!data.date||!Number.isFinite(quantity)||quantity<=0||quantity>Number(item.qty))return Promise.resolve(bad('Usage date and positive quantity within available stock are required'));const updated={...item,qty:Number(item.qty)-quantity,usageHistory:[...(item.usageHistory||[]),{id:uid(),date:data.date,quantity,note:data.note||'',user:data.user||''}]};return Promise.resolve(writeList(KEYS.inventory,list.map(x=>x.id===item.id?updated:x))?ok(updated,'Usage recorded'):bad('Storage is full or unavailable'))}
