import { UI_ACTION as T } from "../../actions/utilities";
export const uiReducer = (
  state = { theme: "light", toast: null, sidebarOpen: false },
  action,
) => {
  switch (action.type) {
    case T.TOGGLE_THEME:
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case T.SHOW_TOAST:
      return { ...state, toast: action.payload };
    case T.HIDE_TOAST:
      return { ...state, toast: null };
    case T.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
};
