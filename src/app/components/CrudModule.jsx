import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as A from "../redux/actions";
import { SHOWTOAST } from "../redux/actions/ui";
import useRole from "../hooks/useRole";
import useDebounce from "../hooks/useDebounce";
import { exportCsv } from "../utils/exportCsv";
import { formatCnic, validateImage } from "../utils/validators";
import { addDays } from "../utils/formatters";
import ConfirmModal from "./common/ConfirmModal";
import EmptyState from "./common/EmptyState";
import SearchBar from "./common/SearchBar";
const date = () => new Date().toISOString().slice(0, 10);
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
export default function CrudModule({ module }) {
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
            ? ["Pending", "Done"]
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
      : Object.values(x).includes(filter));
  let visible = rows.filter(
    (x) => JSON.stringify(x).toLowerCase().includes(q) && matchesFilter(x),
  );
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
  if (sort === "old") visible = [...visible].reverse();
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
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              {fields
                .filter((x) => x.type !== "image")
                .map((x) => (
                  <th key={x.key}>{x.label}</th>
                ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                {fields
                  .filter((x) => x.type !== "image")
                  .map((x) => (
                    <td key={x.key}>
                      {module === "buyers" &&
                        x.key === "name" &&
                        row.imageBase64 && (
                          <img
                            className="buyer-thumb me-2"
                            src={row.imageBase64}
                            alt=""
                          />
                        )}
                      {x.key === "cnic"
                        ? formatCnic(row[x.key])
                        : labels[row[x.key]] || row[x.key] || "—"}
                    </td>
                  ))}
                <td>
                  <div className="d-flex gap-1">
                    {module === "buyers" && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setDetails(row)}
                      >
                        View
                      </button>
                    )}
                    {canEdit && !(module === "expenses" && row.sourceType) && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setForm({ ...row })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setConfirm(row)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && <EmptyState />}
      </div>
      {form && (
        <div className="modal-layer">
          <div className="modal-card">
            <div className="d-flex justify-content-between mb-3">
              <h3>
                {form.id ? "Edit" : "Add"} {title}
              </h3>
              <button className="btn-close" onClick={() => setForm(null)} />
            </div>
            <form onSubmit={save}>
              <div className="row g-3">
                {fields.map((x) => (
                  <div className="col-md-6" key={x.key}>
                    <label className="form-label">{x.label}</label>
                    {x.type.startsWith("select:") ? (
                      <select
                        required
                        className="form-select"
                        value={form[x.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [x.key]: e.target.value })
                        }
                      >
                        <option value="">Select</option>
                        {x.type
                          .slice(7)
                          .split("|")
                          .map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                      </select>
                    ) : [
                        "crop",
                        "cropOptional",
                        "worker",
                        "equipment",
                      ].includes(x.type) ? (
                      <select
                        required={x.type !== "cropOptional"}
                        className="form-select"
                        value={form[x.key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [x.key]: e.target.value })
                        }
                      >
                        <option value="">Select</option>
                        {(x.type.startsWith("crop")
                          ? crops
                          : x.type === "worker"
                            ? workers
                            : machines
                        ).map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name || v.fullName}
                          </option>
                        ))}
                      </select>
                    ) : x.type === "image" ? (
                      <>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="form-control"
                          onChange={photo}
                        />
                        {form.imageBase64 && (
                          <img
                            className="image-preview"
                            src={form.imageBase64}
                            alt="Preview"
                          />
                        )}
                      </>
                    ) : (
                      <input
                        required={
                          !["note", "notes", "performedBy"].includes(x.key)
                        }
                        className="form-control"
                        type={x.type}
                        min={x.type === "number" ? 0 : undefined}
                        value={form[x.key] ?? ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [x.key]:
                              x.key === "cnic"
                                ? formatCnic(e.target.value)
                                : e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setForm(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-brand">Save record</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {details && (
        <div className="modal-layer">
          <div className="modal-card confirm-card">
            <button
              className="btn-close float-end"
              onClick={() => setDetails(null)}
            />
            <h3>Buyer details</h3>
            <img
              className="buyer-large"
              src={details.imageBase64}
              alt={details.name}
            />
            <p>
              <strong>{details.name}</strong>
              <br />
              {formatCnic(details.cnic)}
              <br />
              {labels[details.cropId]} · {details.quantity} kg · {details.date}
            </p>
            <button
              className="btn btn-outline-secondary"
              onClick={() => window.print()}
            >
              Print
            </button>
          </div>
        </div>
      )}
      <ConfirmModal
        record={confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
      />
    </section>
  );
}
