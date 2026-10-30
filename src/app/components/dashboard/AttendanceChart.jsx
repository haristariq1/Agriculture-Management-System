import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { selectAttendanceTrend } from "../../redux/selectors";
export default function AttendanceChart() {
  const { days, present, absent } = useSelector(selectAttendanceTrend);
  return (
    <section className="dash-card chart-card">
      <div className="dash-head">
        <div>
          <span className="eyebrow">LAST 7 DAYS</span>
          <h3>Attendance trend</h3>
        </div>
      </div>
      <Bar
        data={{
          labels: days.map((d) =>
            new Date(`${d}T12:00:00`).toLocaleDateString("en", {
              weekday: "short",
            }),
          ),
          datasets: [
            {
              label: "Present",
              data: present,
              backgroundColor: "#4ea679",
              borderRadius: 5,
            },
            {
              label: "Absent",
              data: absent,
              backgroundColor: "#eaa36e",
              borderRadius: 5,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
        }}
      />
    </section>
  );
}
