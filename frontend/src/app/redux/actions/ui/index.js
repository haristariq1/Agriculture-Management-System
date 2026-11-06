import { UI_ACTION as T } from "../utilities";
export const TOGGLETHEME = () => ({ type: T.TOGGLE_THEME });
export const SHOWTOAST = (message, variant = "success") => ({
  type: T.SHOW_TOAST,
  payload: { message, variant },
});
export const HIDETOAST = () => ({ type: T.HIDE_TOAST });
export const TOGGLESIDEBAR = () => ({ type: T.TOGGLE_SIDEBAR });
