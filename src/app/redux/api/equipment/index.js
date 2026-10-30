import { storageApi, KEYS, mutate } from "../index";
export function getequipment() {
  return storageApi.get(KEYS.equipment);
}
export function addequipment(item, role) {
  return mutate("equipment", "add", item, role);
}
export function updateequipment(item, role) {
  return mutate("equipment", "update", item, role);
}
export function removeequipment(item, role) {
  return mutate("equipment", "remove", item, role);
}
