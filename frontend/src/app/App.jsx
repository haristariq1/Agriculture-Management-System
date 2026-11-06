import React, { useEffect } from "react";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./redux/actions";
import { GETACTIVITY } from "./redux/actions/activity";
import useWeather from "./hooks/useWeather";

import { HIDETOAST } from "./redux/actions/ui";
import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import Toast from "./components/common/Toast";
import Dashboard from "./views/Dashboard";
import Workers from "./views/Workers";
import Equipment from "./views/Equipment";
import Reports from "./views/Reports";
import Inventory from "./views/Inventory";
import Crops from "./views/Crops";
import HarvestOrders from "./views/HarvestOrders";
import Buyers from "./views/Buyers";
import Tasks from "./views/Tasks";
import Expenses from "./views/Expenses";
import NotFound from "./views/NotFound";
import Login from "./views/Login";
import Signup from "./views/Signup";
function Shell() {
  const dispatch = useDispatch();
  const ui = useSelector((s) => s.ui);
  useWeather();
  useEffect(() => {
    [
      "GETALLUSERS",
      "GETCROPS",
      "GETORDERS",
      "GETBUYERS",
      "GETTASKS",
      "GETEXPENSES",
      "GETINVENTORY",
      "GETWORKERS",
      "GETATTENDANCE",
      "GETEQUIPMENT",
      "GETMAINTENANCE",
    ].forEach((name) => dispatch(actions[name]()).catch(() => {}));
    dispatch(GETACTIVITY());
  }, [dispatch]);
  useEffect(() => {
    if (ui.toast) {
      const id = setTimeout(() => dispatch(HIDETOAST()), 3500);
      return () => clearTimeout(id);
    }
  }, [ui.toast, dispatch]);
  return (
    <div className={`app-shell ${ui.theme === "dark" ? "dark" : ""}`}>
      <Sidebar />
      <main className="main-area">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/harvest-orders" element={<HarvestOrders />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Toast />
    </div>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
