import React from "react";
import { formatCnic } from "../../utils/validators";
import { APP_SETTINGS } from "../../../config";
export default function BuyerDetailsModal({ buyer, cropName, onClose }) {
  if (!buyer) return null;
  return (
    <div className="modal-layer">
      <div className="modal-card confirm-card">
        <button
          className="btn-close float-end"
          onClick={onClose}
          aria-label="Close details"
        />
        <h3>Buyer details</h3>
        <img className="buyer-large" src={buyer.photoUrl ? `${APP_SETTINGS.IMAGE_BASE}${buyer.photoUrl}` : buyer.imageBase64} alt={buyer.name} />
        <p>
          <strong>{buyer.name}</strong>
          <br />
          {formatCnic(buyer.cnic)}
          <br />
          {cropName} · {buyer.quantity} kg · {buyer.date}
        </p>
        <button
          className="btn btn-outline-secondary"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
    </div>
  );
}
