import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../reducers";
import { persistMiddleware } from "../middleware/persistMiddleware";
import { activityLogger } from "../middleware/activityLogger";
let session = null,
  theme = "light";
try {
  session = JSON.parse(localStorage.getItem("agri_session"));
  theme = localStorage.getItem("agri_theme") || "light";
} catch {}
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    user: {
      user: session,
      allUsers: [],
      loginLoading: false,
      loginError: null,
    },
    ui: { theme, toast: null, sidebarOpen: false },
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(
      persistMiddleware,
      activityLogger,
    ),
  devTools: true,
});
