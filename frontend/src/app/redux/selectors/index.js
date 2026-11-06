import { createSelector } from "@reduxjs/toolkit";
import { addDays, dayDiff, localDate } from "../../utils/formatters";
export const selectCrops = (s) => s.crops.crops;
export const selectHealthDistribution = createSelector(
  [selectCrops],
  (crops) => ({
    healthy: crops.filter((c) => Number(c.healthScore) >= 75).length,
    attention: crops.filter(
      (c) => Number(c.healthScore) >= 50 && Number(c.healthScore) < 75,
    ).length,
    critical: crops.filter((c) => Number(c.healthScore) < 50).length,
  }),
);
export const selectOrdersSummary = createSelector(
  [(s) => s.orders.orders],
  (orders) => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  }),
);
export const selectBuyers = (s) => s.buyers.buyers;
export const selectWorkers = (s) => s.workers.workers;
export const selectAttendance = (s) => s.attendance.records;
export const selectEquipment = (s) => s.equipment.equipment;
export const selectStock = createSelector(
  [selectCrops, selectBuyers],
  (crops, buyers) =>
    crops.map((c) => ({
      ...c,
      sold: buyers
        .filter((b) => b.cropId === c.id)
        .reduce((n, b) => n + Number(b.quantity), 0),
      available: Math.max(
        0,
        Number(c.harvestQty) -
          buyers
            .filter((b) => b.cropId === c.id)
            .reduce((n, b) => n + Number(b.quantity), 0),
      ),
    })),
);
export const selectLowStock = createSelector([selectStock], (stock) =>
  stock.filter((c) => c.available < Number(c.harvestQty) * 0.2),
);
export const selectDueCrops = createSelector([selectCrops], (crops) =>
  crops
    .map((c) => ({ ...c, daysRemaining: dayDiff(c.cuttingDate) }))
    .filter((c) => c.daysRemaining <= 7)
    .sort((a, b) => a.daysRemaining - b.daysRemaining),
);
export const selectServiceDue = createSelector([selectEquipment], (equipment) =>
  equipment
    .map((e) => ({
      ...e,
      nextServiceDate: addDays(
        e.lastServiceDate,
        Number(e.serviceIntervalDays),
      ),
      daysRemaining: dayDiff(
        addDays(e.lastServiceDate, Number(e.serviceIntervalDays)),
      ),
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining),
);
export const selectEquipmentStatusCount = createSelector(
  [selectEquipment],
  (equipment) =>
    Object.fromEntries(
      ["Active", "Under Repair", "Idle"].map((status) => [
        status,
        equipment.filter((e) => e.status === status).length,
      ]),
    ),
);
export const selectWorkersPresentToday = createSelector(
  [selectAttendance, selectWorkers],
  (records, workers) =>
    records.filter(
      (r) =>
        r.date === localDate() &&
        r.status === "Present" &&
        workers.some((w) => w.id === r.workerId && w.status === "Active"),
    ).length,
);
export const selectWorkersAbsentToday = createSelector(
  [selectAttendance, selectWorkers],
  (records, workers) =>
    records.filter(
      (r) =>
        r.date === localDate() &&
        r.status === "Absent" &&
        workers.some((w) => w.id === r.workerId && w.status === "Active"),
    ).length,
);
export const wageFor = (worker, records, month) =>
  records
    .filter((r) => r.workerId === worker.id && r.date?.startsWith(month))
    .reduce(
      (n, r) =>
        n + (r.status === "Present" ? 1 : r.status === "Half-day" ? 0.5 : 0),
      0,
    ) * Number(worker.dailyWage);
export const selectWagesPayable = (month) =>
  createSelector([selectWorkers, selectAttendance, (s) => s.expenses.expenses], (workers, records, expenses) =>
    workers.map((w) => ({
      ...w,
      wage: wageFor(w, records, month),
      unpaidWage: expenses.some((e) => e.sourceType === "wage" && e.sourceId === w.id && e.sourceMonth === month) ? 0 : wageFor(w, records, month),
    })),
  );
export const selectProfitByCrop = createSelector(
  [selectCrops, selectBuyers, (s) => s.expenses.expenses],
  (crops, buyers, expenses) =>
    crops.map((c) => {
      const revenue = buyers
        .filter((b) => b.cropId === c.id)
        .reduce(
          (n, b) => n + Number(b.total || b.quantity * b.unitPrice || 0),
          0,
        );
      const cost = expenses
        .filter((e) => e.cropId === c.id)
        .reduce((n, e) => n + Number(e.amount), 0);
      return { crop: c.name, revenue, expense: cost, profit: revenue - cost };
    }),
);
export const selectMonthlyProfitByCrop = (month) => createSelector(
  [selectCrops, selectBuyers, (s) => s.expenses.expenses],
  (crops, buyers, expenses) => crops.map((c) => {
    const revenue = buyers.filter((b) => b.cropId === c.id && b.date?.startsWith(month))
      .reduce((n, b) => n + Number(b.quantity) * Number(b.unitPrice), 0);
    const cost = expenses.filter((e) => e.cropId === c.id && e.date?.startsWith(month))
      .reduce((n, e) => n + Number(e.amount), 0);
    return { crop: c.name, revenue, expense: cost, profit: revenue - cost };
  }).filter((row) => row.revenue || row.expense),
);
export const selectHarvestSalesTrend = createSelector([selectCrops, selectBuyers], (crops, buyers) => {
  const dates = [...new Set([
    ...crops.map((crop) => crop.cuttingDate),
    ...buyers.map((buyer) => buyer.date),
  ].filter(Boolean))].sort();
  return {
    dates,
    harvest: dates.map((date) => crops.filter((crop) => crop.cuttingDate === date)
      .reduce((total, crop) => total + Number(crop.harvestQty), 0)),
    sales: dates.map((date) => buyers.filter((buyer) => buyer.date === date)
      .reduce((total, buyer) => total + Number(buyer.quantity), 0)),
  };
});
export const selectAttendanceTrend = createSelector([selectAttendance], (records) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    return localDate(day);
  });
  return {
    days,
    present: days.map((day) => records.filter((r) => r.date === day && r.status === "Present").length),
    absent: days.map((day) => records.filter((r) => r.date === day && r.status === "Absent").length),
  };
});
export const selectDashboard = createSelector(
  [
    selectStock,
    (s) => s.orders.orders,
    (s) => s.expenses.expenses,
    selectWorkers,
    selectAttendance,
    selectEquipment,
  ],
  (stock, orders, expenses, workers, attendance, equipment) => ({
    harvest: stock.reduce((n, c) => n + Number(c.harvestQty), 0),
    sold: stock.reduce((n, c) => n + c.sold, 0),
    remaining: stock.reduce((n, c) => n + c.available, 0),
    orders: orders.length,
    expenses: expenses.reduce((n, e) => n + Number(e.amount), 0),
    workers: workers.length,
    equipment: equipment.length,
  }),
);
export const selectAlerts = createSelector(
  [
    selectStock,
    selectDueCrops,
    (s) => s.inventory.items,
    (s) => s.tasks.tasks,
    selectWorkers,
    selectAttendance,
    selectServiceDue,
    selectEquipment,
    (s) => s.weather.data,
  ],
  (
    stock,
    due,
    items,
    tasks,
    workers,
    attendance,
    service,
    equipment,
    weather,
  ) => {
    const alerts = [];
    const add = (type, text) => alerts.push({ type, text });
    stock
      .filter((c) => Number(c.healthScore) < 50)
      .forEach((c) => add("danger", `${c.name} crop health is critical`));
    stock
      .filter((c) => c.available < Number(c.harvestQty) * 0.2)
      .forEach((c) => add("warning", `${c.name} stock is low`));
    due
      .filter((c) => c.daysRemaining <= 3)
      .forEach((c) =>
        add(
          "warning",
          `${c.name} cutting is ${c.daysRemaining < 0 ? "overdue" : "due soon"}`,
        ),
      );
    items
      .filter((i) => Number(i.qty) < Number(i.minQty))
      .forEach((i) => add("warning", `${i.item} inventory is low`));
    tasks
      .filter((t) => t.status !== "Done" && dayDiff(t.dueDate) < 0)
      .forEach((t) => add("danger", `${t.title} task is overdue`));
    service
      .filter((e) => e.daysRemaining <= 7)
      .forEach((e) =>
        add(
          e.daysRemaining < 0 ? "danger" : "warning",
          `${e.name} service ${e.daysRemaining < 0 ? "overdue" : "due soon"}`,
        ),
      );
    equipment
      .filter((e) => e.status === "Under Repair")
      .forEach((e) => add("warning", `${e.name} is under repair`));
    const today = localDate();
    const activeIds = new Set(
      workers.filter((w) => w.status === "Active").map((w) => w.id),
    );
    const absent = attendance.filter(
      (a) =>
        a.date === today && a.status === "Absent" && activeIds.has(a.workerId),
    ).length;
    if (activeIds.size && absent / activeIds.size > 0.3)
      add("warning", "More than 30% of active workers are absent");
    if (Number(weather?.current?.relative_humidity_2m) > 75)
      add("warning", "Humidity is high");
    return alerts;
  },
);
