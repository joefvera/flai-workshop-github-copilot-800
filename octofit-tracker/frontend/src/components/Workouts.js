import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="card octofit-card">
      <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
        <span>💪 Workouts</span>
        {!loading && !error && (
          <span className="badge bg-dark record-count">{workouts.length} records</span>
        )}
      </div>
      <div className="card-body">
        {loading && (
          <div className="loading-container">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 mb-0">Loading workouts&hellip;</p>
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
                  <th>Workout Name</th>
                  <th>Description</th>
                  <th>Duration (min)</th>
                </tr>
              </thead>
              <tbody>
                {workouts.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted py-3">No workouts found.</td></tr>
                ) : (
                  workouts.map((workout, index) => (
                    <tr key={workout._id || index}>
                      <td className="text-muted">{index + 1}</td>
                      <td><strong>{workout.name}</strong></td>
                      <td>{workout.description || <span className="text-muted">N/A</span>}</td>
                      <td>
                        {workout.duration
                          ? <span className="badge bg-danger">{workout.duration} min</span>
                          : <span className="text-muted">N/A</span>}
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

export default Workouts;
