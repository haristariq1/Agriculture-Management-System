import React from "react";
import LoginForm from "../auth/LoginForm";
export default function Login() {
  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="brand-mark large">
          <i className="bi bi-flower1" />
        </div>
        <div className="eyebrow">WELCOME TO VERDANT</div>
        <h1>
          Farm management,
          <br /> made clearer.
        </h1>
        <p>One workspace for crops, people, equipment and profitability.</p>
        <div className="login-illustration">
          <i className="bi bi-sun" />
          <i className="bi bi-flower1" />
          <i className="bi bi-tree" />
        </div>
      </div>
      <div className="login-form-wrap">
        <LoginForm />
      </div>
    </div>
  );
}
