import React, { useState, useEffect } from 'react';

const medalColors = ['text-warning', 'text-secondary', 'text-danger'];
const medalIcons  = ['🥇', '🥈', '🥉'];

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setEntries(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="card octofit-card">
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <span>📊 Leaderboard</span>
        {!loading && !error && (
          <span className="badge bg-dark record-count">{entries.length} records</span>
        )}
      </div>
      <div className="card-body">
        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 mb-0">Loading leaderboard&hellip;</p>
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
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Team</th>
                  <th>Score</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted py-3">No entries found.</td></tr>
                ) : (
                  entries.map((entry, index) => (
                    <tr key={entry._id || index}>
                      <td className={`fw-bold ${medalColors[index] || ''}`}>
                        {index < 3 ? medalIcons[index] : index + 1}
                      </td>
                      <td>{entry.user || entry.username || 'N/A'}</td>
                      <td>
                        {entry.team
                          ? <span className={`badge ${entry.team === 'Team Marvel' ? 'bg-danger' : 'bg-primary'}`}>{entry.team}</span>
                          : <span className="text-muted">N/A</span>}
                      </td>
                      <td><span className="badge bg-info text-dark">{entry.score}</span></td>
                      <td>{entry.calories ? `${entry.calories} kcal` : <span className="text-muted">N/A</span>}</td>
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

export default Leaderboard;
