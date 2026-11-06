import React from "react";
import { useSelector } from "react-redux";
import WeatherCard from "../components/dashboard/WeatherCard";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import CropHealthList from "../components/dashboard/CropHealthList";
import CuttingSchedule from "../components/dashboard/CuttingSchedule";
import WorkforceCard from "../components/dashboard/WorkforceCard";
import EquipmentStatusCard from "../components/dashboard/EquipmentStatusCard";
import HarvestChart from "../components/dashboard/HarvestChart";
import CropHealthChart from "../components/dashboard/CropHealthChart";
import AttendanceChart from "../components/dashboard/AttendanceChart";
import StatCard from "../components/common/StatCard";
import {
  selectDashboard,
  selectStock,
  selectAlerts,
  selectDueCrops,
  selectServiceDue,
  selectEquipmentStatusCount,
  selectWorkersPresentToday,
  selectWorkersAbsentToday,
  selectWagesPayable,
  selectHealthDistribution,
} from "../redux/selectors";
import { money, localDate } from "../utils/formatters";
export default function Dashboard() {
  const stats = useSelector(selectDashboard),
    stock = useSelector(selectStock),
    alerts = useSelector(selectAlerts),
    due = useSelector(selectDueCrops),
    service = useSelector(selectServiceDue),
    equipment = useSelector(selectEquipmentStatusCount),
    present = useSelector(selectWorkersPresentToday),
    absent = useSelector(selectWorkersAbsentToday),
    wages = useSelector(
      selectWagesPayable(localDate().slice(0, 7)),
    ),
    weather = useSelector((s) => s.weather);
  const current = weather.data?.current,
    forecast = weather.data?.daily;
  const health = useSelector(selectHealthDistribution);
  return (
    <>
      <div className="dashboard-hero">
        <div>
          <span className="hero-kicker">
            <i className="bi bi-circle-fill" /> FARM OVERVIEW
          </span>
          <h1>
            Good day, farmer <span>🌿</span>
          </h1>
          <p>Here's what's happening across your farm today.</p>
        </div>
        <div className="hero-date">
          <i className="bi bi-calendar3" />
          {new Date().toLocaleDateString("en-PK", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="kpi-grid">
        <StatCard
          icon="bi-basket2"
          label="Total Harvest"
          value={`${stats.harvest.toLocaleString()} kg`}
          foot="Across all fields"
        />
        <StatCard
          icon="bi-bag-check"
          label="Quantity Sold"
          value={`${stats.sold.toLocaleString()} kg`}
          foot={`${stats.orders} active orders`}
          tone="blue"
        />
        <StatCard
          icon="bi-box-seam"
          label="Available Stock"
          value={`${stats.remaining.toLocaleString()} kg`}
          foot="Ready for sale"
          tone="amber"
        />
        <StatCard
          icon="bi-wallet2"
          label="Total Expenses"
          value={money(stats.expenses)}
          foot="Recorded spending"
          tone="purple"
        />
      </div>
      <div className="dashboard-grid">
        <WeatherCard weather={weather} current={current} forecast={forecast} />
        <AlertsPanel alerts={alerts} />
        <CropHealthList stock={stock} />
        <CuttingSchedule due={due} />
        <WorkforceCard
          stats={stats}
          present={present}
          absent={absent}
          wages={wages}
        />
        <EquipmentStatusCard equipment={equipment} service={service} />
        <HarvestChart stock={stock} />
        <CropHealthChart health={health} />
        <AttendanceChart />
      </div>
    </>
  );
}
