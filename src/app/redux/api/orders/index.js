import { storageApi, KEYS, mutate } from "../index";
export function getorders() {
  return storageApi.get(KEYS.orders);
}
export function addorder(item, role) {
  return mutate("orders", "add", item, role);
}
export function updateorder(item, role) {
  return mutate("orders", "update", item, role);
}
export function removeorder(item, role) {
  return mutate("orders", "remove", item, role);
}
