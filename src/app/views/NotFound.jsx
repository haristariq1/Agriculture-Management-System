import React from "react";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="section-card empty-state">
      <h1>Page not found</h1>
      <p>The page you requested is not in this farm workspace.</p>
      <Link to="/" className="btn btn-brand">
        Back to dashboard
      </Link>
    </section>
  );
}
