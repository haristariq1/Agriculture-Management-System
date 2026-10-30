import { storageApi, KEYS, mutate } from "../index";
export function getbuyers() {
  return storageApi.get(KEYS.buyers);
}
export function savebuyer(item, role) {
  return mutate("buyers", "add", item, role);
}
export function updatebuyer(item, role) {
  return mutate("buyers", "update", item, role);
}
export function removebuyer(item, role) {
  return mutate("buyers", "remove", item, role);
}
