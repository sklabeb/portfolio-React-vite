import React, { useEffect } from "react";
import { loadScripts } from "../scripts.js";

export default function AdminDashboard() {
  useEffect(() => {
    loadScripts(["/admin.js"]);
  }, []);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>
          Portfolio<span>Pro</span>
        </h2>

        <p className="side-label">ADMINISTRATION</p>

        <nav>
          <button
            type="button"
            onClick={() => window.showAdminSection("dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            type="button"
            onClick={() => window.showAdminSection("users")}
          >
            👥 Manage Users
          </button>

          <button
            type="button"
            onClick={() => window.showAdminSection("portfolios")}
          >
            📁 Portfolios
          </button>

          <button
            type="button"
            onClick={() => window.showAdminSection("admins")}
          >
            🛡️ Admin Accounts
          </button>

          <button
            type="button"
            onClick={() => window.showAdminSection("settings")}
          >
            ⚙️ My Account
          </button>
        </nav>

        <button
          type="button"
          className="logout"
          onClick={() => window.logout()}
        >
          Logout
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1 id="adminPageTitle">Admin Dashboard</h1>
            <p>Portfolio management system</p>
          </div>

          <span
            className="admin-badge"
            id="adminBadge"
          />
        </header>

        {/* DASHBOARD */}
        <section
          id="dashboard"
          className="admin-section"
        >
          <div className="welcome">
            <h2>
              Welcome, <span id="adminWelcome" /> 👋
            </h2>

            <p>
              Build and manage professional portfolios, monitor users,
              projects and achievements.
            </p>
          </div>

          <div className="stats">
            <article className="stat-card">
              <p>Registered Users</p>
              <h2 id="totalUsers">0</h2>
            </article>

            <article className="stat-card">
              <p>Total Projects</p>
              <h2 id="totalProjects">0</h2>
            </article>

            <article className="stat-card">
              <p>Achievements</p>
              <h2 id="totalAchievements">0</h2>
            </article>

            <article className="stat-card">
              <p>Blog Posts</p>
              <h2 id="totalBlogs">0</h2>
            </article>
          </div>

          <div className="panel">
            <h2>Recently Registered Users</h2>
            <div id="recentUsers" />
          </div>
        </section>

        {/* USER MANAGEMENT */}
        <section
          id="users"
          className="admin-section hidden"
        >
          <div className="panel">
            <h2>User Management</h2>

            <input
              type="search"
              id="searchUser"
              placeholder="Search by name or email"
              aria-label="Search users by name or email"
            />

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Projects</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody id="usersTable" />
              </table>
            </div>
          </div>
        </section>

        {/* PORTFOLIOS */}
        <section
          id="portfolios"
          className="admin-section hidden"
        >
          <div className="panel">
            <h2>All User Portfolios</h2>

            <div
              id="portfolioList"
              className="portfolio-grid"
            />
          </div>
        </section>

        {/* ADMIN ACCOUNTS */}
        <section
          id="admins"
          className="admin-section hidden"
        >
          <div className="panel">
            <h2>Authorized Administrators</h2>

            <div
              id="adminAccounts"
              className="portfolio-grid"
            />
          </div>
        </section>

        {/* ACCOUNT SETTINGS */}
        <section
          id="settings"
          className="admin-section hidden"
        >
          <div className="panel">
            <h2>My Admin Account</h2>
            <div id="adminDetails" />
          </div>
        </section>
      </main>
    </div>
  );
}