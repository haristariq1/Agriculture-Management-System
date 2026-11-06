import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../redux/actions/users";
import { Link } from "react-router-dom";
export default function LoginForm() {
  const [username, setUsername] = useState("admin"),
    [password, setPassword] = useState("Admin@123"),
    dispatch = useDispatch(),
    navigate = useNavigate(),
    error = useSelector((s) => s.user.loginError),
    loading = useSelector((s) => s.user.loginLoading);
  return (
    <form
      className="login-card"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await dispatch(LOGIN(username, password));
          navigate("/");
        } catch {}
      }}
    >
      <h2>Welcome back</h2>
      <p>Sign in to your farm workspace.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <label className="form-label">Username</label>
      <input
        required
        className="form-control mb-3"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-label">Password</label>
      <input
        required
        type="password"
        className="form-control mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-brand w-100" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}{" "}
        <i className="bi bi-arrow-right ms-2" />
      </button>
      <p className="text-center mt-3 mb-0">New to the workspace? <Link to="/signup">Create a Manager account</Link></p>
      <div className="demo-credentials">
        <strong>Demo credentials</strong>
        <div>Admin: admin / Admin@123</div>
        <div>Manager: manager / Manager@123</div>
      </div>
    </form>
  );
}
