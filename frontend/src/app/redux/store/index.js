import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../reducers";
import { persistMiddleware } from "../middleware/persistMiddleware";
import { activityLogger } from "../middleware/activityLogger";
let session = null,
  theme = "light";
try {
  session = JSON.parse(localStorage.getItem("agri_session"));
  if (!session?.token) { session = null; localStorage.removeItem("agri_session"); }
  theme = localStorage.getItem("agri_theme") || "light";
} catch {}
const initialState = rootReducer(undefined, { type: "@@INIT" });
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    ...initialState,
    user: { ...initialState.user, user: session },
    ui: { theme, toast: null, sidebarOpen: false },
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(
      persistMiddleware,
      activityLogger,
    ),
  devTools: true,
});
