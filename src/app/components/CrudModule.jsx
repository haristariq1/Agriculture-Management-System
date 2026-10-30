import CropForm from "./crops/CropForm";
import CropTable from "./crops/CropTable";
import OrderForm from "./harvest/OrderForm";
import OrdersTable from "./harvest/OrdersTable";
import BuyerForm from "./buyers/BuyerForm";
import BuyerTable from "./buyers/BuyerTable";
import TaskForm from "./tasks/TaskForm";
import TaskList from "./tasks/TaskList";
import ExpenseForm from "./expenses/ExpenseForm";
import ExpenseTable from "./expenses/ExpenseTable";
import InventoryForm from "./inventory/InventoryForm";
import InventoryTable from "./inventory/InventoryTable";
import WorkerForm from "./workers/WorkerForm";
import WorkerTable from "./workers/WorkerTable";
import EquipmentForm from "./equipment/EquipmentForm";
import EquipmentTable from "./equipment/EquipmentTable";
import MaintenanceForm from "./equipment/MaintenanceForm";
import MaintenanceLog from "./equipment/MaintenanceLog";
import React, { useState } from "react";
import RecordForm from "./common/RecordForm";
import RecordTable from "./common/RecordTable";
import { useDispatch, useSelector } from "react-redux";
import * as A from "../redux/actions";
import { SHOWTOAST } from "../redux/actions/ui";
import useRole from "../hooks/useRole";
import useDebounce from "../hooks/useDebounce";
import { exportCsv } from "../utils/exportCsv";
import { validateImage } from "../utils/validators";
import BuyerDetailsModal from "./buyers/BuyerDetailsModal";
import { addDays, localDate } from "../utils/formatters";
import ConfirmModal from "./common/ConfirmModal";
import SearchBar from "./common/SearchBar";
const date = () => localDate();
const field = (key, label, type = "text") => ({ key, label, type });
export const configs = {
  crops: [
    "Crops",
    "crops",
    ["ADDCROP", "UPDATECROP", "REMOVECROP"],
    [
      field("name", "Crop name"),
      field("field", "Field"),
      field("plantingDate", "Planting date", "date"),
      field("cuttingDate", "Cutting date", "date"),
      field("healthScore", "Health score", "number"),
      field("harvestQty", "Harvested kg", "number"),
      field("expectedQty", "Expected kg", "number"),
    ],
  ],
  orders: [
    "Orders",
    "orders",
    ["ADDORDER", "UPDATEORDER", "REMOVEORDER"],
    [
      field("cropId", "Crop", "crop"),
      field("quantity", "Quantity kg", "number"),
      field("orderDate", "Order date", "date"),
      field("status", "Status", "select:Pending|Delivered|Cancelled"),
    ],
  ],
  buyers: [
    "Buyers & Sales",
    "buyers",
    ["SAVEBUYER", "UPDATEBUYER", "REMOVEBUYER"],
    [
      field("name", "Full name"),
      field("cnic", "CNIC"),
      field("imageBase64", "Photo", "image"),
      field("cropId", "Crop", "crop"),
      field("quantity", "Quantity kg", "number"),
      field("unitPrice", "Unit price PKR", "number"),
      field("date", "Sale date", "date"),
    ],
  ],
  tasks: [
    "Farm Tasks",
    "tasks",
    ["ADDTASK", "UPDATETASK", "REMOVETASK"],
    [
      field("title", "Task title"),
      field(
        "type",
        "Type",
        "select:Irrigation|Fertilizer|Spraying|Labour|Other",
      ),
      field("cropId", "Crop", "crop"),
      field("dueDate", "Due date", "date"),
      field("status", "Status", "select:Pending|Done"),
    ],
  ],
  expenses: [
    "Expenses",
    "expenses",
    ["ADDEXPENSE", "UPDATEEXPENSE", "REMOVEEXPENSE"],
    [
      field("cropId", "Crop", "cropOptional"),
      field(
        "category",
        "Category",
        "select:Seeds|Fertilizer|Labour|Fuel|Repair/Fuel|Other",
      ),
      field("amount", "Amount PKR", "number"),
      field("date", "Date", "date"),
      field("note", "Note"),
    ],
  ],
  inventory: [
    "Inputs Inventory",
    "items",
    ["ADDITEM", "UPDATEITEM", "REMOVEITEM"],
    [
      field("item", "Item"),
      field("type", "Type", "select:Fertilizer|Pesticide|Seed|Other"),
      field("qty", "Quantity", "number"),
      field("minQty", "Minimum quantity", "number"),
      field("unit", "Unit"),
    ],
  ],
  workers: [
    "Workers",
    "workers",
    ["ADDWORKER", "UPDATEWORKER", "REMOVEWORKER"],
    [
      field("fullName", "Full name"),
      field("cnic", "CNIC"),
      field("phone", "Phone"),
      field("role", "Role", "select:Farm Hand|Driver|Supervisor|Sprayer"),
      field("dailyWage", "Daily wage PKR", "number"),
      field("joinDate", "Join date", "date"),
      field("status", "Status", "select:Active|Inactive"),
    ],
  ],
  attendance: [
    "Attendance",
    "records",
    ["MARKATTENDANCE", "UPDATEATTENDANCE", "REMOVEATTENDANCE"],
    [
      field("workerId", "Worker", "worker"),
      field("date", "Date", "date"),
      field("status", "Status", "select:Present|Absent|Half-day|Leave"),
      field("note", "Note"),
    ],
  ],
  equipment: [
    "Equipment",
    "equipment",
    ["ADDEQUIPMENT", "UPDATEEQUIPMENT", "REMOVEEQUIPMENT"],
    [
      field("name", "Machine name"),
      field(
        "type",
        "Type",
        "select:Tractor|Water Pump|Sprayer|Harvester|Other",
      ),
      field("purchaseDate", "Purchase date", "date"),
      field("status", "Status", "select:Active|Under Repair|Idle"),
      field("lastServiceDate", "Last service date", "date"),
      field("serviceIntervalDays", "Service interval days", "number"),
      field("notes", "Notes"),
    ],
  ],
  maintenance: [
    "Maintenance Log",
    "services",
    ["ADDSERVICE", "UPDATESERVICE", "REMOVESERVICE"],
    [
      field("equipmentId", "Equipment", "equipment"),
      field("date", "Service date", "date"),
      field("description", "Description"),
      field("cost", "Cost PKR", "number"),
      field("performedBy", "Performed by"),
    ],
  ],
};
const formComponents = {
  crops: CropForm,
  orders: OrderForm,
  buyers: BuyerForm,
  tasks: TaskForm,
  expenses: ExpenseForm,
  inventory: InventoryForm,
  workers: WorkerForm,
  equipment: EquipmentForm,
  maintenance: MaintenanceForm,
};
const tableComponents = {
  crops: CropTable,
  orders: OrdersTable,
  buyers: BuyerTable,
  tasks: TaskList,
  expenses: ExpenseTable,
  inventory: InventoryTable,
  workers: WorkerTable,
  equipment: EquipmentTable,
  maintenance: MaintenanceLog,
};
export default function CrudModule({ module }) {
  const FormComponent = formComponents[module] || RecordForm;
  const TableComponent = tableComponents[module] || RecordTable;
  const [title, slot, names, fields] = configs[module],
    dispatch = useDispatch(),
    rows = useSelector((s) => s[module][slot]),
    crops = useSelector((s) => s.crops.crops),
    workers = useSelector((s) => s.workers.workers),
    machines = useSelector((s) => s.equipment.equipment),
    { canEdit, role } = useRole();
  const [form, setForm] = useState(null),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState(""),
    [sort, setSort] = useState("new"),
    [confirm, setConfirm] = useState(null),
    [details, setDetails] = useState(null);
  const q = useDebounce(search).toLowerCase();
  const labels = Object.fromEntries(
    [...crops, ...workers, ...machines].map((x) => [
      x.id,
      x.name || x.fullName,
    ]),
  );
  const filterOptions =
    module === "crops"
      ? ["Healthy", "Needs Attention", "Critical"]
      : module === "workers"
        ? ["Farm Hand", "Driver", "Supervisor", "Sprayer", "Active", "Inactive"]
        : module === "equipment"
          ? [
              "Tractor",
              "Water Pump",
              "Sprayer",
              "Harvester",
              "Other",
              "Active",
              "Under Repair",
              "Idle",
            ]
          : module === "tasks"
            ? ["Pending", "Done", ...crops.map((c) => c.name)]
            : module === "orders"
              ? ["Pending", "Delivered", "Cancelled"]
              : module === "attendance"
                ? ["Present", "Absent", "Half-day", "Leave"]
                : [];
  const matchesFilter = (x) =>
    !filter ||
    (module === "crops"
      ? filter === "Healthy"
        ? Number(x.healthScore) >= 75
        : filter === "Needs Attention"
          ? Number(x.healthScore) >= 50 && Number(x.healthScore) < 75
          : Number(x.healthScore) < 50
      : module === "tasks" && crops.some((c) => c.name === filter)
        ? crops.some((c) => c.name === filter && c.id === x.cropId)
        : Object.values(x).includes(filter));
  let visible = rows.filter((x) => {
    const text = module === "buyers" ? `${x.name} ${x.cnic}` : JSON.stringify(x);
    return text.toLowerCase().includes(q) && matchesFilter(x);
  });
  const dateKey = {
    crops: "cuttingDate",
    orders: "orderDate",
    buyers: "date",
    tasks: "dueDate",
    expenses: "date",
    workers: "joinDate",
    attendance: "date",
    equipment: "lastServiceDate",
    maintenance: "date",
  }[module];
  if (sort === "new") visible = [...visible].reverse();
  if (sort === "date")
    visible = [...visible].sort((a, b) =>
      String(b[dateKey] || "").localeCompare(String(a[dateKey] || "")),
    );
  if (sort === "service")
    visible = [...visible].sort((a, b) =>
      String(addDays(a.lastServiceDate, a.serviceIntervalDays)).localeCompare(
        String(addDays(b.lastServiceDate, b.serviceIntervalDays)),
      ),
    );
  if (sort === "quantity")
    visible = [...visible].sort(
      (a, b) =>
        Number(b.quantity || b.qty || b.amount || 0) -
        Number(a.quantity || a.qty || a.amount || 0),
    );
  const save = async (e) => {
    e.preventDefault();
    try {
      await dispatch(A[form.id ? names[1] : names[0]](form));
      dispatch(SHOWTOAST("Record saved"));
      setForm(null);
    } catch (e) {
      dispatch(SHOWTOAST(e.message, "danger"));
    }
  };
  const remove = async () => {
    try {
      await dispatch(A[names[2]](confirm.id));
      dispatch(SHOWTOAST("Record deleted"));
      setConfirm(null);
    } catch (e) {
      dispatch(SHOWTOAST(e.message, "danger"));
    }
  };
  const photo = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!validateImage(f)) {
      dispatch(SHOWTOAST("Photo must be JPG or PNG under 1 MB", "danger"));
      return;
    }
    const r = new FileReader();
    r.onload = () => setForm({ ...form, imageBase64: r.result });
    r.readAsDataURL(f);
  };
  return (
    <section className="section-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FARM OPERATIONS</span>
          <h2>{title}</h2>
          <p>Manage records and keep the farm in sync.</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => exportCsv(`${module}.csv`, visible)}
          >
            Export CSV
          </button>
          {!(module === "equipment" && role === "Manager") && (
            <button
              className="btn btn-brand"
              onClick={() =>
                setForm({
                  date: date(),
                  orderDate: date(),
                  joinDate: date(),
                  purchaseDate: date(),
                  plantingDate: date(),
                  lastServiceDate: date(),
                  status:
                    module === "attendance"
                      ? "Present"
                      : module === "orders" || module === "tasks"
                        ? "Pending"
                        : "Active",
                })
              }
            >
              <i className="bi bi-plus-lg me-2" />
              Add new
            </button>
          )}
        </div>
      </div>
      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={`Search ${title.toLowerCase()}...`}
        />
        <select
          className="form-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
          <option value="date">Newest date</option>
          <option value="quantity">Highest amount</option>
          {module === "equipment" && (
            <option value="service">Next service date</option>
          )}
        </select>
        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All filters</option>
          {filterOptions.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <TableComponent
        module={module}
        fields={fields}
        visible={visible}
        labels={labels}
        canEdit={canEdit}
        setDetails={setDetails}
        setForm={setForm}
        setConfirm={setConfirm}
      />
      <FormComponent
        form={form}
        title={title}
        setForm={setForm}
        save={save}
        fields={fields}
        crops={crops}
        workers={workers}
        machines={machines}
        photo={photo}
      />
      <BuyerDetailsModal
        buyer={details}
        cropName={labels[details?.cropId]}
        onClose={() => setDetails(null)}
      />
      <ConfirmModal
        record={confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </section>
  );
}
