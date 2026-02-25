import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Teams: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="card octofit-card">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <span>🏆 Teams</span>
        {!loading && !error && (
          <span className="badge bg-dark record-count">{teams.length} records</span>
        )}
      </div>
      <div className="card-body">
        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 mb-0">Loading teams&hellip;</p>
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
                  <th>Team Name</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-muted py-3">No teams found.</td></tr>
                ) : (
                  teams.map((team, index) => (
                    <tr key={team._id || index}>
                      <td className="text-muted">{index + 1}</td>
                      <td><strong>{team.name}</strong></td>
                      <td>
                        {Array.isArray(team.members)
                          ? team.members.map((m) => (
                              <span className="badge bg-success me-1" key={m}>{m}</span>
                            ))
                          : team.members || 'N/A'}
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
  );
}

export default Teams;
