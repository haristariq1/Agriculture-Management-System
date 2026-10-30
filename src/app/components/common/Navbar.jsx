import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../redux/actions/users";
import { TOGGLESIDEBAR, TOGGLETHEME } from "../../redux/actions/ui";
import { selectAlerts } from "../../redux/selectors";
import { WEATHER } from "../../../config";
export default function Navbar() {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    user = useSelector((s) => s.user.user),
    theme = useSelector((s) => s.ui.theme),
    alerts = useSelector(selectAlerts);
  return (
    <header className="topbar">
      <button
        className="mobile-toggle"
        onClick={() => dispatch(TOGGLESIDEBAR())}
        aria-label="Toggle navigation"
      >
        <i className="bi bi-list" />
      </button>
      <div className="topbar-location">
        <i className="bi bi-geo-alt-fill" /> {WEATHER.city}, Pakistan{" "}
        <span>•</span>{" "}
        {new Date().toLocaleDateString("en-PK", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </div>
      <div className="topbar-actions">
        <button title="Toggle theme" onClick={() => dispatch(TOGGLETHEME())}>
          <i className={`bi bi-${theme === "dark" ? "sun" : "moon"}`} />
        </button>
        <button
          title={`${alerts.length} alerts, view reports`}
          onClick={() => navigate("/reports")}
        >
          <i className="bi bi-bell" />
          {alerts.length > 0 && <span className="bell-dot" />}
        </button>
        <div className="user-chip">
          <span>{user.username[0].toUpperCase()}</span>
          {user.role}
        </div>
        <button
          title="Logout"
          onClick={async () => {
            await dispatch(LOGOUT());
            navigate("/login");
          }}
        >
          <i className="bi bi-box-arrow-right" />
        </button>
      </div>
    </header>
  );
}
