export const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === "user/login_success" || action.type === "user/logout_success") {
    try { const user = store.getState().user.user; if (user?.token) localStorage.setItem("agri_session", JSON.stringify(user)); else localStorage.removeItem("agri_session"); } catch {}
  }
  if (action.type === "ui/toggle_theme") {
    try {
      localStorage.setItem("agri_theme", store.getState().ui.theme);
    } catch {}
  }
  return result;
};
