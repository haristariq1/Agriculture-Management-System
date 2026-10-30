import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectProfitByCrop } from "../../redux/selectors";
import { money } from "../../utils/formatters";
import { exportCsv } from "../../utils/exportCsv";
import { exportPdf } from "../../utils/exportPdf";
const sections = ["Harvest", "Sales", "Expenses", "Wages", "Maintenance"];
export default function ReportBuilder() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [enabled, setEnabled] = useState(
    Object.fromEntries(sections.map((x) => [x, true])),
  );
  const crops = useSelector((s) => s.crops.crops),
    orders = useSelector((s) => s.orders.orders),
    buyers = useSelector((s) => s.buyers.buyers),
    expenses = useSelector((s) => s.expenses.expenses),
    maintenance = useSelector((s) => s.maintenance.services),
    profit = useSelector(selectProfitByCrop);
  const cropName = (id) => crops.find((c) => c.id === id)?.name || "General";
  const harvest = crops
    .filter((c) => c.cuttingDate?.startsWith(month))
    .map((c) => ({
      section: "Harvest",
      date: c.cuttingDate,
      crop: c.name,
      quantity: c.harvestQty,
      amount: "",
    }));
  const sales = buyers
    .filter((x) => x.date?.startsWith(month))
    .map((b) => ({
      section: "Sales",
      date: b.date,
      crop: cropName(b.cropId),
      quantity: b.quantity,
      amount: Number(b.quantity) * Number(b.unitPrice || 0),
    }));
  const spending = expenses
    .filter((x) => x.date?.startsWith(month) && x.sourceType !== "wage")
    .map((e) => ({
      section: "Expenses",
      date: e.date,
      crop: cropName(e.cropId),
      quantity: e.category,
      amount: e.amount,
    }));
  const wages = expenses
    .filter((x) => x.date?.startsWith(month) && x.sourceType === "wage")
    .map((e) => ({
      section: "Wages",
      date: e.date,
      crop: e.note,
      quantity: "",
      amount: e.amount,
    }));
  const services = maintenance
    .filter((x) => x.date?.startsWith(month))
    .map((s) => ({
      section: "Maintenance",
      date: s.date,
      crop: s.description,
      quantity: "",
      amount: s.cost,
    }));
  const rows = [
    ...harvest,
    ...sales,
    ...spending,
    ...wages,
    ...services,
  ].filter((x) => enabled[x.section]);
  const summary = {
    harvest: harvest.reduce((n, x) => n + Number(x.quantity), 0),
    sales: sales.reduce((n, x) => n + Number(x.amount), 0),
    expenses: spending.reduce((n, x) => n + Number(x.amount), 0),
    wages: wages.reduce((n, x) => n + Number(x.amount), 0),
    maintenance: services.reduce((n, x) => n + Number(x.amount), 0),
  };
  return (
    <section className="section-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">MONTHLY SUMMARY</span>
          <h2>Performance report</h2>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <input
            type="month"
            className="form-control month-input"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => exportCsv(`report-${month}.csv`, rows)}
          >
            Export CSV
          </button>
          <button className="btn btn-brand" onClick={exportPdf}>
            Print / PDF
          </button>
        </div>
      </div>
      <div className="report-sections">
        {sections.map((name) => (
          <label key={name}>
            <input
              type="checkbox"
              checked={enabled[name]}
              onChange={(e) =>
                setEnabled({ ...enabled, [name]: e.target.checked })
              }
            />{" "}
            {name}
          </label>
        ))}
      </div>
      <div className="report-grid">
        <div>
          <small>HARVEST CUTTING</small>
          <strong>{summary.harvest.toLocaleString()} kg</strong>
        </div>
        <div>
          <small>SALES REVENUE</small>
          <strong>{money(summary.sales)}</strong>
        </div>
        <div>
          <small>EXPENSES</small>
          <strong>{money(summary.expenses + summary.wages)}</strong>
        </div>
        <div>
          <small>NET RESULT</small>
          <strong>
            {money(summary.sales - summary.expenses - summary.wages)}
          </strong>
        </div>
      </div>
      <h4 className="mt-4">Selected records</h4>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Date</th>
              <th>Crop / detail</th>
              <th>Quantity / category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.section}-${i}`}>
                <td>{r.section}</td>
                <td>{r.date}</td>
                <td>{r.crop}</td>
                <td>{r.quantity || "—"}</td>
                <td>{r.amount === "" ? "—" : money(r.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty-state">
            No records for the selected month and sections.
          </div>
        )}
      </div>
      <h4 className="mt-4">Profit by crop</h4>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {profit.map((x) => (
              <tr key={x.crop}>
                <td>{x.crop}</td>
                <td>{money(x.revenue)}</td>
                <td>{money(x.expense)}</td>
                <td>{money(x.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
