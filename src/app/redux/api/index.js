import { seedData } from "../../../fake-db/seedData";
import { localDate } from "../../utils/formatters";
import {
  validateName,
  validateCnic,
  validatePhone,
  validateWage,
  validateQuantity,
  validateServiceInterval,
  digits,
} from "../../utils/validators";
export const KEYS = Object.fromEntries(
  [
    "crops",
    "orders",
    "buyers",
    "tasks",
    "expenses",
    "inventory",
    "workers",
    "attendance",
    "equipment",
    "maintenance",
    "activity",
    "session",
    "users",
  ].map((k) => [k, `agri_${k}`]),
);
export const ok = (data, message = "OK") => ({
  data: { succeeded: true, message, data },
});
export const bad = (message) => ({
  data: { succeeded: false, message, data: null },
});
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  Date.now().toString(36) + Math.random().toString(36).slice(2);
export const readList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      const name = Object.keys(KEYS).find((k) => KEYS[k] === key);
      return seedData[name] || [];
    }
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
export const writeList = (key, list) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
};
export const storageApi = {
  get: (key) => Promise.resolve(ok(readList(key))),
  set: (key, list) =>
    Promise.resolve(
      writeList(key, list) ? ok(list) : bad("Storage is full or unavailable"),
    ),
};
export function validateRecord(module, item, list, previous) {
  const finite = (value) => value !== "" && value !== null && value !== undefined && Number.isFinite(Number(value));
  const nonNegative = (value) => finite(value) && Number(value) >= 0;
  if (["workers", "buyers"].includes(module)) {
    if (!validateName(module === "workers" ? item.fullName : item.name))
      return "Name must contain letters and spaces (at least 3 characters)";
    if (!validateCnic(item.cnic)) return "CNIC must have 13 digits";
    if (
      list.some((x) => x.id !== item.id && digits(x.cnic) === digits(item.cnic))
    )
      return "CNIC already exists";
  }
  if (
    module === "workers" &&
    (!validatePhone(item.phone) || !validateWage(item.dailyWage))
  )
    return "Phone must have 11 digits and daily wage must be greater than zero";
  if (module === "buyers") {
    if (
      !/^data:image\/(jpeg|png);base64,/.test(item.imageBase64 || "") ||
      (((item.imageBase64 || "").split(",")[1] || "").length * 3) / 4 > 1048576
    )
      return "A JPG or PNG photo up to 1 MB is required";
    const crop = readList(KEYS.crops).find((c) => c.id === item.cropId);
    const sold = list
      .filter((x) => x.cropId === item.cropId && x.id !== item.id)
      .reduce((n, x) => n + Number(x.quantity), 0);
    if (
      !crop ||
      !validateQuantity(item.quantity) ||
      Number(item.quantity) > Number(crop.harvestQty) - sold
    )
      return "Quantity exceeds available crop stock";
    if (!item.date || !finite(item.unitPrice) || Number(item.unitPrice) <= 0)
      return "Date and positive unit price are required";
  }
  if (module === "attendance" &&
    (!readList(KEYS.workers).some((w) => w.id === item.workerId) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(item.date || "") ||
      !["Present", "Absent", "Half-day", "Leave"].includes(item.status)))
    return "Select a valid worker, date and attendance status";
  if (
    module === "attendance" &&
    list.some(
      (x) =>
        x.id !== item.id &&
        x.workerId === item.workerId &&
        x.date === item.date,
    )
  )
    return "Attendance already exists for this worker and date";
  if (
    module === "equipment" &&
    (!item.name?.trim() || !item.purchaseDate || !item.lastServiceDate ||
      !["Tractor", "Water Pump", "Sprayer", "Harvester", "Other"].includes(item.type) ||
      !["Active", "Under Repair", "Idle"].includes(item.status) ||
      !validateServiceInterval(item.serviceIntervalDays))
  )
    return "Equipment name and positive service interval are required";
  if (
    module === "maintenance" &&
    (!readList(KEYS.equipment).some((e) => e.id === item.equipmentId) ||
      !item.date ||
      !item.description?.trim() ||
      !nonNegative(item.cost))
  )
    return "Complete service details and enter a non-negative cost";
  if (module === "orders" && (!validateQuantity(item.quantity) || !readList(KEYS.crops).some((c) => c.id === item.cropId)))
    return "Select a crop and positive quantity";
  if (
    module === "crops" &&
    (!item.name?.trim() ||
      !item.field?.trim() ||
      !item.plantingDate ||
      !item.cuttingDate ||
      !finite(item.healthScore) || Number(item.healthScore) < 0 ||
      Number(item.healthScore) > 100 ||
      !nonNegative(item.harvestQty) ||
      !nonNegative(item.expectedQty))
  )
    return "Complete crop details; health must be 0–100 and quantities non-negative";
  if (
    module === "tasks" &&
    (!item.title?.trim() || !item.type || !item.dueDate)
  )
    return "Task title, type and due date are required";
  if (module === "expenses" && (!item.category || !finite(item.amount) || Number(item.amount) <= 0 || !item.date))
    return "Category and positive amount are required";
  if (
    module === "inventory" &&
    (!item.item?.trim() || !nonNegative(item.qty) || !nonNegative(item.minQty) || !item.unit?.trim())
  )
    return "Item and non-negative quantities are required";
  return null;
}
export async function mutate(module, kind, item, role) {
  if (!keyForModule(module)) return bad("Unsupported module");
  if (!["Admin", "Manager"].includes(role)) return bad("Please sign in");
  if (
    role === "Manager" &&
    (["update", "remove"].includes(kind) ||
      (module === "equipment" && kind === "add"))
  )
    return bad("Admin permission required");
  const key = KEYS[module],
    list = readList(key);
  if (module === "attendance") {
    const current = kind === "remove" ? list.find((x) => x.id === (typeof item === "string" ? item : item.id)) : item;
    const previous = kind === "update" ? list.find((x) => x.id === item.id) : null;
    if ([current, previous].some((record) => record && readList(KEYS.expenses).some((e) => e.id === `wage-${record.workerId}-${record.date?.slice(0, 7)}`)))
      return bad("Attendance is locked after wages are paid for that month");
  }
  let next, payload;
  if (kind === "add") {
    payload = { ...item, id: uid() };
    const error = validateRecord(module, payload, list);
    if (error) return bad(error);
    next = [...list, payload];
  } else if (kind === "update") {
    if (!list.some((x) => x.id === item.id)) return bad("Record not found");
    if (module === "expenses" && list.find((x) => x.id === item.id)?.sourceType)
      return bad("Linked expenses must be changed through their source record");
    payload = item;
    const error = validateRecord(module, payload, list);
    if (error) return bad(error);
    next = list.map((x) => (x.id === item.id ? { ...x, ...item } : x));
    if (
      module === "crops" &&
      readList(KEYS.buyers)
        .filter((b) => b.cropId === item.id)
        .reduce((n, b) => n + Number(b.quantity), 0) > Number(item.harvestQty)
    )
      return bad("Harvest cannot be lower than quantity already sold");
  } else if (kind === "remove") {
    const id = typeof item === "string" ? item : item.id;
    if (!list.some((x) => x.id === id)) return bad("Record not found");
    if (module === "expenses" && list.find((x) => x.id === id)?.sourceType)
      return bad("Linked expenses cannot be deleted directly");
    payload = { id };
    next = list.filter((x) => x.id !== id);
    if (
      module === "crops" &&
      (readList(KEYS.buyers).some((x) => x.cropId === id) ||
        readList(KEYS.orders).some((x) => x.cropId === id))
    )
      return bad("Crop has linked buyers or orders");
    if (
      module === "workers" &&
      readList(KEYS.attendance).some((x) => x.workerId === id)
    )
      return bad("Worker has attendance history");
    if (
      module === "equipment" &&
      readList(KEYS.maintenance).some((x) => x.equipmentId === id)
    )
      return bad("Equipment has maintenance history");
  } else return bad("Unsupported operation");
  if (!writeList(key, next)) return bad("Storage is full or unavailable");
  if (module === "maintenance" && !syncMaintenance(next)) {
    writeList(key, list);
    return bad("Storage is full or unavailable");
  }
  return ok(payload, `${module} ${kind} successful`);
}
const keyForModule = (module) => ["crops", "orders", "buyers", "tasks", "expenses", "inventory", "workers", "attendance", "equipment", "maintenance"].includes(module);
function syncMaintenance(services) {
  const current = readList(KEYS.expenses);
  const manual = current.filter((x) => x.sourceType !== "maintenance");
  const linked = services
    .filter((s) => Number(s.cost) > 0)
    .map((s) => ({
      id: `service-${s.id}`,
      sourceType: "maintenance",
      sourceId: s.id,
      category: "Repair/Fuel",
      cropId: "",
      amount: Number(s.cost),
      date: s.date,
      note: `Service: ${s.description}`,
    }));
  if (!writeList(KEYS.expenses, [...manual, ...linked])) return false;
  const originalMachines = readList(KEYS.equipment);
  const machines = originalMachines.map((e) => ({
    ...e,
    originalServiceDate: e.originalServiceDate || e.lastServiceDate,
    lastServiceDate:
      services
        .filter((s) => s.equipmentId === e.id)
        .map((s) => s.date)
        .sort()
        .at(-1) ||
      e.originalServiceDate ||
      e.lastServiceDate,
  }));
  if (!writeList(KEYS.equipment, machines)) {
    writeList(KEYS.expenses, current);
    return false;
  }
  return true;
}
export async function payWage(worker, month, amount, role) {
  if (!["Admin", "Manager"].includes(role)) return bad("Please sign in");
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || "")) return bad("Invalid wage month");
  const savedWorker = readList(KEYS.workers).find((w) => w.id === worker?.id);
  if (!savedWorker) return bad("Worker not found");
  const days = readList(KEYS.attendance)
    .filter((r) => r.workerId === savedWorker.id && r.date?.startsWith(month))
    .reduce((total, r) => total + (r.status === "Present" ? 1 : r.status === "Half-day" ? 0.5 : 0), 0);
  const payable = days * Number(savedWorker.dailyWage);
  if (!Number.isFinite(payable) || payable <= 0) return bad("No wages payable");
  if (Number(amount) !== payable) return bad("Wage amount is out of date");
  const id = `wage-${worker.id}-${month}`,
    list = readList(KEYS.expenses);
  if (list.some((x) => x.id === id))
    return bad("Wages already paid for this month");
  const item = {
    id,
    sourceType: "wage",
    sourceId: worker.id,
    category: "Labour",
    cropId: "",
    amount: payable,
    date: localDate(),
    note: `${savedWorker.fullName} • ${month}`,
  };
  return writeList(KEYS.expenses, [...list, item])
    ? ok(item, "Wages paid")
    : bad("Storage is full or unavailable");
}
