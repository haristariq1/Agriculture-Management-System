import { getActivity } from "../api/activity";
export const activityLogger = (store) => (next) => (action) => {
  const result = next(action);
  if (/^(crops|orders|buyers|tasks|expenses|inventory|workers|attendance|equipment|maintenance|user)\/(add|update|remove|usage|create|update_user|remove_user)_success$/.test(action.type)) {
    getActivity().then((response) => {
      if (response.data.succeeded) store.dispatch({ type: "activity/get_success", payload: response.data.data.map((row) => ({ ...row, recordId: row.entityId })) });
    }).catch(() => {});
  }
  return result;
};
