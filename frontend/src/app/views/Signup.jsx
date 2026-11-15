import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GETALLUSERS, REGISTER } from "../redux/actions/users";

const emptyForm = { fullName: "", username: "", email: "", password: "", role: "Manager" };

export default function Signup() {
  const dispatch = useDispatch();
  const { allUsers, signupLoading, signupError, signupSuccess, getallLoading, getallError } = useSelector((state) => state.user);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => { dispatch(GETALLUSERS()).catch(() => {}); }, [dispatch]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await dispatch(REGISTER(form));
      setForm(emptyForm);
      setMessage("Account created. The new user can now sign in with these credentials.");
    } catch {
      // Redux stores the API's validation message in createError.
    }
  };

  return <section>
    <div className="page-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>User registration</h1><p>Create and review Admin and Manager accounts.</p></div></div>
    <div className="row g-4">
      <div className="col-12 col-xl-5">
        <form className="card p-4" onSubmit={submit}>
          <h2 className="h5 mb-3">Register a user</h2>
          {signupError && <div className="alert alert-danger" role="alert">{signupError}</div>}
          {message && signupSuccess && <div className="alert alert-success" role="status">{message}</div>}
          <label className="form-label" htmlFor="user-full-name">Full name</label>
          <input id="user-full-name" className="form-control mb-3" autoComplete="name" minLength={2} maxLength={80} required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <label className="form-label" htmlFor="user-username">Username</label>
          <input id="user-username" className="form-control mb-3" autoComplete="username" minLength={3} maxLength={40} required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          <label className="form-label" htmlFor="user-email">Email</label>
          <input id="user-email" type="email" className="form-control mb-3" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <label className="form-label" htmlFor="user-password">Temporary password</label>
          <input id="user-password" type="password" className="form-control mb-3" autoComplete="new-password" minLength={6} required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <label className="form-label" htmlFor="user-role">Role</label>
          <select id="user-role" className="form-select mb-4" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option>Manager</option><option>Admin</option></select>
          <button className="btn btn-brand" type="submit" disabled={signupLoading}>{signupLoading ? "Registering…" : "Register user"}</button>
        </form>
      </div>
      <div className="col-12 col-xl-7">
        <div className="card p-4"><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 mb-0">Registered accounts</h2><span className="badge text-bg-light">{allUsers.length} users</span></div>
          {getallLoading ? <p className="text-muted mb-0">Loading users…</p> : getallError ? <p className="text-danger mb-0">{getallError}</p> : allUsers.length === 0 ? <p className="text-muted mb-0">No user accounts found.</p> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th></tr></thead><tbody>{allUsers.map((user) => <tr key={user.id}><td>{user.fullName}</td><td>{user.username}</td><td>{user.email}</td><td><span className="badge text-bg-success">{user.role}</span></td></tr>)}</tbody></table></div>}
        </div>
      </div>
    </div>
  </section>;
}
