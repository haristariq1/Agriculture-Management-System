import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HIDETOAST } from "../../redux/actions/ui";
export default function Toast() {
  const dispatch = useDispatch(),
    toast = useSelector((s) => s.ui.toast);
  if (!toast) return null;
  return (
    <div className={`app-toast alert alert-${toast.variant}`} role="alert">
      {toast.message}
      <button
        className="btn-close ms-3"
        onClick={() => dispatch(HIDETOAST())}
        aria-label="Dismiss"
      />
    </div>
  );
}
