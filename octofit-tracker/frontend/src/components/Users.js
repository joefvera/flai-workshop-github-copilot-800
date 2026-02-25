import React, { useState, useEffect, useCallback } from 'react';

const BASE = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;

/* ── Edit Modal ─────────────────────────────────────────────────── */
function EditUserModal({ user, teams, onSave, onClose }) {
  const [form, setForm] = useState({
    name:     user.name     || '',
    email:    user.email    || '',
    age:      user.age      || '',
    team:     user.team     || '',
    password: user.password || '',
  });
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const url = `${BASE}/users/${user.id}/`;
    console.log('Users: PATCHing', url, form);
    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, age: Number(form.age) }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((updated) => {
        console.log('Users: patched successfully', updated);
        onSave(updated);
      })
      .catch((err) => {
        console.error('Users: patch error', err);
        setSaveError(err.message);
        setSaving(false);
      });
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header" style={{ background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff' }}>
            <h5 className="modal-title">✏️ Edit User — {user.name}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body pb-2">
              {saveError && (
                <div className="alert alert-danger py-2 mb-3">{saveError}</div>
              )}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text" name="name" className="form-control"
                  value={form.name} onChange={handleChange} required
                  placeholder="e.g. Tony Stark"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email" name="email" className="form-control"
                  value={form.email} onChange={handleChange} required
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Age</label>
                  <input
                    type="number" name="age" className="form-control" min="0"
                    value={form.age} onChange={handleChange} placeholder="e.g. 30"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    name="team" className="form-select"
                    value={form.team} onChange={handleChange}
                  >
                    <option value="">— No team —</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-1">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="text" name="password" className="form-control"
                  value={form.password} onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                {saving
                  ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                  : '💾 Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Users list ─────────────────────────────────────────────────── */
function Users() {
  const [users, setUsers]             = useState([]);
  const [teams, setTeams]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const usersUrl = `${BASE}/users/`;
  const teamsUrl = `${BASE}/teams/`;

  const fetchData = useCallback(() => {
    setLoading(true);
    console.log('Users: fetching from', usersUrl);
    console.log('Users: fetching teams from', teamsUrl);
    Promise.all([
      fetch(usersUrl).then((r) => {
        if (!r.ok) throw new Error(`Users API error: ${r.status}`);
        return r.json();
      }),
      fetch(teamsUrl).then((r) => {
        if (!r.ok) throw new Error(`Teams API error: ${r.status}`);
        return r.json();
      }),
    ])
      .then(([userData, teamData]) => {
        console.log('Users: fetched users data', userData);
        console.log('Users: fetched teams data', teamData);
        setUsers(Array.isArray(userData) ? userData : userData.results || []);
        setTeams(Array.isArray(teamData) ? teamData : teamData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Users: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [usersUrl, teamsUrl]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = (updated) => {
    setUsers((prev) =>
      prev.map((u) => (String(u.id) === String(updated.id) ? updated : u))
    );
    setEditingUser(null);
  };

  const teamBadgeClass = (teamName) => {
    if (teamName === 'Team Marvel') return 'bg-danger';
    if (teamName === 'Team DC')     return 'bg-primary';
    return 'bg-secondary';
  };

  return (
    <>
      {editingUser && (
        <EditUserModal
          user={editingUser}
          teams={teams}
          onSave={handleSave}
          onClose={() => setEditingUser(null)}
        />
      )}

      <div className="card octofit-card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span>👤 Users</span>
          {!loading && !error && (
            <span className="badge bg-dark record-count">{users.length} records</span>
          )}
        </div>
        <div className="card-body">
          {loading && (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
              <p className="mt-2 mb-0">Loading users…</p>
            </div>
          )}
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover octofit-table">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Team</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">No users found.</td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id || user.id || index}>
                        <td className="text-muted">{index + 1}</td>
                        <td><strong>{user.name || <span className="text-muted">N/A</span>}</strong></td>
                        <td>{user.email || <span className="text-muted">N/A</span>}</td>
                        <td>{user.age   || <span className="text-muted">N/A</span>}</td>
                        <td>
                          {user.team
                            ? <span className={`badge ${teamBadgeClass(user.team)}`}>{user.team}</span>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setEditingUser(user)}
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Users;
