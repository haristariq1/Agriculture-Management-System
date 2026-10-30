import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
export default function AttendanceChart() {
  const records = useSelector((s) => s.attendance.records),
    days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
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
              data: days.map(
                (d) =>
                  records.filter((r) => r.date === d && r.status === "Present")
                    .length,
              ),
              backgroundColor: "#4ea679",
              borderRadius: 5,
            },
            {
              label: "Absent",
              data: days.map(
                (d) =>
                  records.filter((r) => r.date === d && r.status === "Absent")
                    .length,
              ),
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
