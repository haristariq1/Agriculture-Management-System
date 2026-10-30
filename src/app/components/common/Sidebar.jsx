import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TOGGLESIDEBAR } from "../../redux/actions/ui";
import { routes } from "../../routes";
export default function Sidebar() {
  const dispatch = useDispatch(),
    user = useSelector((s) => s.user.user),
    open = useSelector((s) => s.ui.sidebarOpen);
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <i className="bi bi-flower1" />
        </div>
        <div>
          <strong>Verdant</strong>
          <small>FARM OPERATIONS</small>
        </div>
      </div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav>
        {routes.map(([path, label, icon]) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            onClick={() => open && dispatch(TOGGLESIDEBAR())}
          >
            <i className={`bi ${icon}`} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="avatar">{user.username[0].toUpperCase()}</div>
        <div>
          <strong>{user.username}</strong>
          <small>{user.role}</small>
        </div>
      </div>
    </aside>
  );
}
