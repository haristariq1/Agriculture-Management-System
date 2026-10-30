import { storageApi, KEYS, mutate } from "../index";
export function gettasks() {
  return storageApi.get(KEYS.tasks);
}
export function addtask(item, role) {
  return mutate("tasks", "add", item, role);
}
export function updatetask(item, role) {
  return mutate("tasks", "update", item, role);
}
export function removetask(item, role) {
  return mutate("tasks", "remove", item, role);
}
