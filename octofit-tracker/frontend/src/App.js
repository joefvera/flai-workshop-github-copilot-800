import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import './App.css';
import octofitLogo from './octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navItems = [
  { to: '/users',       label: 'Users' },
  { to: '/teams',       label: 'Teams' },
  { to: '/activities',  label: 'Activities' },
  { to: '/workouts',    label: 'Workouts' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

const featureCards = [
  { to: '/users',       icon: '👤', title: 'Users',       desc: 'Manage athlete profiles',         color: 'border-primary' },
  { to: '/teams',       icon: '🏆', title: 'Teams',       desc: 'Build and manage your squads',    color: 'border-success' },
  { to: '/activities',  icon: '🏃', title: 'Activities',  desc: 'Log every workout session',       color: 'border-warning' },
  { to: '/workouts',    icon: '💪', title: 'Workouts',    desc: 'Browse personalised plans',       color: 'border-danger' },
  { to: '/leaderboard', icon: '📊', title: 'Leaderboard', desc: 'See who tops the rankings',      color: 'border-info' },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <div className="octofit-hero text-center">
        <img src={octofitLogo} alt="OctoFit" className="hero-logo" />
        <h1>Welcome to OctoFit Tracker</h1>
        <p className="lead mb-0">
          Track activities, manage teams, and compete on the leaderboard.
        </p>
      </div>

      {/* Feature cards */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
        {featureCards.map(({ to, icon, title, desc, color }) => (
          <div className="col" key={to}>
            <Link to={to} className={`feature-card card h-100 border-2 ${color}`}>
              <div className="card-body">
                <div className="feature-icon">{icon}</div>
                <h6 className="card-title">{title}</h6>
                <p className="card-text text-muted small mb-0">{desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

function App() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg octofit-navbar">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img src={octofitLogo} alt="OctoFit logo" className="navbar-brand-logo" />
            Octo<span className="brand-accent">Fit</span> Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {navItems.map(({ to, label }) => (
                <li className="nav-item" key={to}>
                  <NavLink
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                    to={to}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div className="page-wrapper">
        <div className="container">
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/users"      element={<Users />} />
            <Route path="/teams"      element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/workouts"   element={<Workouts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 small">
        &copy; {new Date().getFullYear()} OctoFit Tracker &mdash; Built with React &amp; Django
      </footer>
    </div>
  );
}

export default App;
