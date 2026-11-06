import React from "react";
import CnicInput from "../buyers/CnicInput";
import ImageUpload from "../buyers/ImageUpload";
import { APP_SETTINGS } from "../../../config";
export default function RecordForm({
  form,
  title,
  setForm,
  save,
  fields,
  crops,
  workers,
  machines,
  photo,
}) {
  return (
    <>
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
                      <ImageUpload
                        value={form.imageBase64 || (form.photoUrl ? `${APP_SETTINGS.IMAGE_BASE}${form.photoUrl}` : "")}
                        onChange={photo}
                        onRemove={() => setForm({ ...form, imageBase64: "", photoUrl: "", photoFile: null })}
                      />
                    ) : x.key === "cnic" ? (
                      <CnicInput
                        value={form.cnic}
                        onChange={(value) => setForm({ ...form, cnic: value })}
                      />
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
                            [x.key]: e.target.value,
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
    </>
  );
}
