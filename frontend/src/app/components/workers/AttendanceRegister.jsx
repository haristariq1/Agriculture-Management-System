import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MARKATTENDANCE } from "../../redux/actions/attendance";
import { SHOWTOAST } from "../../redux/actions/ui";
import { localDate } from "../../utils/formatters";
export default function AttendanceRegister() {
  const workers = useSelector((s) => s.workers.workers).filter(
      (w) => w.status === "Active",
    ),
    records = useSelector((s) => s.attendance.records),
    dispatch = useDispatch(),
    [date, setDate] = useState(localDate()),
    [statuses, setStatuses] = useState({});
  const month = date.slice(0, 7);
  const save = async () => {
    let done = 0;
    for (const w of workers) {
      if (records.some((r) => r.workerId === w.id && r.date === date)) continue;
      try {
        await dispatch(
          MARKATTENDANCE({
            workerId: w.id,
            date,
            status: statuses[w.id] || "Present",
            note: "",
          }),
        );
        done++;
      } catch (e) {
        dispatch(SHOWTOAST(e.message, "danger"));
      }
    }
    dispatch(SHOWTOAST(`${done} attendance records saved`));
  };
  return (
    <section id="attendance-register" className="section-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">DAILY REGISTER</span>
          <h2>Mark all workers</h2>
          <p>
            Choose a date and status for each active worker. Existing records
            are preserved.
          </p>
        </div>
        <input
          type="date"
          className="form-control month-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Worker</th>
              <th>Role</th>
              <th>Today</th>
              <th>Present this month</th>
              <th>Absent</th>
              <th>Half-days</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => {
              const existing = records.find(
                  (r) => r.workerId === w.id && r.date === date,
                ),
                monthly = records.filter(
                  (r) => r.workerId === w.id && r.date.startsWith(month),
                );
              return (
                <tr key={w.id}>
                  <td>{w.fullName}</td>
                  <td>{w.role}</td>
                  <td>
                    {existing ? (
                      <span className="badge text-bg-success">
                        {existing.status}
                      </span>
                    ) : (
                      <select
                        className="form-select form-select-sm"
                        value={statuses[w.id] || "Present"}
                        onChange={(e) =>
                          setStatuses({ ...statuses, [w.id]: e.target.value })
                        }
                      >
                        {["Present", "Absent", "Half-day", "Leave"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {monthly.filter((r) => r.status === "Present").length}
                  </td>
                  <td>{monthly.filter((r) => r.status === "Absent").length}</td>
                  <td>
                    {monthly.filter((r) => r.status === "Half-day").length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!workers.length && (
          <div className="empty-state">No active workers to mark.</div>
        )}
      </div>
      <button className="btn btn-brand" onClick={save}>
        Mark attendance for {date}
      </button>
    </section>
  );
}
