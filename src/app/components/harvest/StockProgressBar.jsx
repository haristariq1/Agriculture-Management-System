import React from "react";
export default function StockProgressBar({ crop }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between small mb-1">
        <strong>{crop.name}</strong>
        <span>
          {crop.available} / {crop.harvestQty} kg
        </span>
      </div>
      <div className="progress">
        <div
          className="progress-bar"
          style={{
            width: `${crop.harvestQty ? (100 * crop.available) / crop.harvestQty : 0}%`,
            background: "#3d9870",
          }}
        />
      </div>
    </div>
  );
}
