import { KEYS, readList, writeList, uid } from "../api";
export const activityLogger = (store) => (next) => (action) => {
  const actor = store.getState().user.user?.username || "System";
  const result = next(action);
  const match =
    action.type.match(/^([^/]+)\/(add|update|remove|usage|create)_success$/) ||
    action.type.match(/^user\/(update_user|remove_user)_success$/);
  if (match) {
    const item = {
      id: uid(),
      user: actor,
      action: match[2],
      entity: match[1],
      recordId: action.payload?.id,
      timestamp: new Date().toISOString(),
    };
    writeList(KEYS.activity, [item, ...readList(KEYS.activity)]);
    store.dispatch({ type: "activity/log_success", payload: item });
  }
  return result;
};
