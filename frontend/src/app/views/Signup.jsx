import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GETALLUSERS,
  REGISTER,
  REMOVEUSER,
  UPDATEUSER,
} from "../redux/actions/users";

const emptyForm = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  role: "Manager",
};

export default function Signup() {
  const dispatch = useDispatch();
  const {
    allUsers,
    user: currentUser,
    signupLoading,
    signupError,
    updateLoading,
    updateError,
    getallLoading,
    getallError,
    removeLoading,
    removeError,
  } = useSelector((state) => state.user);
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(GETALLUSERS()).catch(() => {});
  }, [dispatch]);

  const startEditing = (account) => {
    setEditingUser(account);
    setForm({
      fullName: account.fullName || "",
      username: account.username || "",
      email: account.email || "",
      password: "",
      role: account.role || "Manager",
    });
    setMessage("");
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setMessage("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const payload = { ...form };
    if (editingUser && !payload.password) delete payload.password;

    try {
      if (editingUser) {
        await dispatch(UPDATEUSER({ id: editingUser.id, ...payload }));
        setMessage(`Updated ${form.fullName}.`);
        setEditingUser(null);
      } else {
        await dispatch(REGISTER(payload));
        setMessage("Account created. The new user can now sign in.");
      }
      setForm(emptyForm);
    } catch {
      // The appropriate Redux error state is shown with the form.
    }
  };

  const removeUser = async () => {
    if (!userToDelete) return;
    try {
      await dispatch(REMOVEUSER(userToDelete.id));
      if (editingUser?.id === userToDelete.id) cancelEditing();
      setMessage(`${userToDelete.fullName} was deleted.`);
      setUserToDelete(null);
    } catch {
      // Redux exposes the API error and keeps the row available.
    }
  };

  const formError = editingUser ? updateError : signupError;
  const formLoading = editingUser ? updateLoading : signupLoading;

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>User management</h1>
          <p>Create, view, update, and remove Admin and Manager accounts.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-5">
          <form className="card p-4" onSubmit={submit}>
            <h2 className="h5 mb-3">
              {editingUser ? `Edit ${editingUser.username}` : "Register a user"}
            </h2>
            {formError && <div className="alert alert-danger" role="alert">{formError}</div>}
            {message && <div className="alert alert-success" role="status">{message}</div>}

            <label className="form-label" htmlFor="user-full-name">Full name</label>
            <input id="user-full-name" className="form-control mb-3" autoComplete="name" minLength={2} maxLength={80} required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />

            <label className="form-label" htmlFor="user-username">Username</label>
            <input id="user-username" className="form-control mb-3" autoComplete="username" minLength={3} maxLength={40} required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />

            <label className="form-label" htmlFor="user-email">Email</label>
            <input id="user-email" type="email" className="form-control mb-3" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />

            <label className="form-label" htmlFor="user-password">{editingUser ? "New password (optional)" : "Temporary password"}</label>
            <input id="user-password" type="password" className="form-control mb-3" autoComplete="new-password" minLength={form.password ? 6 : undefined} required={!editingUser} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />

            <label className="form-label" htmlFor="user-role">Role</label>
            <select id="user-role" className="form-select mb-4" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option>Manager</option>
              <option>Admin</option>
            </select>

            <div className="d-flex gap-2">
              <button className="btn btn-brand" type="submit" disabled={formLoading}>
                {formLoading ? "Saving…" : editingUser ? "Save changes" : "Register user"}
              </button>
              {editingUser && <button className="btn btn-light" type="button" onClick={cancelEditing} disabled={formLoading}>Cancel edit</button>}
            </div>
          </form>
        </div>

        <div className="col-12 col-xl-7">
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Registered accounts</h2>
              <span className="badge text-bg-light">{allUsers.length} users</span>
            </div>
            {removeError && <div className="alert alert-danger" role="alert">{removeError}</div>}
            {getallLoading ? <p className="text-muted mb-0">Loading users…</p> : getallError ? <p className="text-danger mb-0">{getallError}</p> : allUsers.length === 0 ? <p className="text-muted mb-0">No user accounts found.</p> : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                  <tbody>{allUsers.map((account) => (
                    <tr key={account.id}>
                      <td>{account.fullName}</td>
                      <td>{account.username}</td>
                      <td>{account.email}</td>
                      <td><span className="badge text-bg-success">{account.role}</span></td>
                      <td className="text-nowrap">
                        <button type="button" className="btn btn-sm btn-outline-primary me-2" aria-label={`Edit ${account.username}`} onClick={() => startEditing(account)}>Edit</button>
                        {account.id === currentUser?.id ? <span className="text-muted small">Current account</span> : <button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Delete ${account.username}`} onClick={() => setUserToDelete(account)}>Delete</button>}
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {userToDelete && <div className="modal-layer" role="presentation"><div className="modal-card confirm-card" role="dialog" aria-modal="true" aria-labelledby="delete-user-title" aria-describedby="delete-user-description"><div className="danger-icon"><i className="bi bi-trash3" /></div><h3 id="delete-user-title">Delete this user?</h3><p id="delete-user-description">Delete <strong>{userToDelete.fullName}</strong> ({userToDelete.username})? This action cannot be undone.</p><div className="d-flex gap-2 justify-content-end"><button type="button" className="btn btn-light" disabled={removeLoading} onClick={() => setUserToDelete(null)}>Cancel</button><button type="button" className="btn btn-danger" disabled={removeLoading} onClick={removeUser}>{removeLoading ? "Deleting…" : "Delete user"}</button></div></div></div>}
    </section>
  );
}
