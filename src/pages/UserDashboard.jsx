import React, { useEffect, useState } from "react";
import { loadScripts } from "../scripts.js";
import CertificateList from "../components/CertificateList.jsx";
import PortfolioPreview from "../components/PortfolioPreview.jsx";

export default function UserDashboard() {
  const [certificateMessage, setCertificateMessage] = useState("");
  const [certificateUploading, setCertificateUploading] = useState(false);
  const [certificateRefreshKey, setCertificateRefreshKey] = useState(0);
  const [certificatesOpened, setCertificatesOpened] = useState(false);
  const [previewOpened, setPreviewOpened] = useState(false);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);

  useEffect(() => {
    loadScripts([
      "/features/dashboardAnalytics.js",
      "/features/profileCustomization.js",
      "/features/certificateManager.js",
      "/user.js"
    ]);
  }, []);

  function openCertificates(event) {
    window.showSection("certificates");

    document.getElementById("pageTitle").textContent =
      "My Certificates";

    event.currentTarget.classList.add("active");

    setCertificatesOpened(true);
    setCertificateRefreshKey(key => key + 1);
  }

  function openPortfolioPreview(event) {
    window.showSection("portfolioPreview");

    document.getElementById("pageTitle").textContent =
      "Live Portfolio Preview";

    event.currentTarget.classList.add("active");

    setPreviewOpened(true);
    setPreviewRefreshKey(key => key + 1);
  }

  async function handleCertificateUpload(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fields = form.elements;

    setCertificateMessage("");
    setCertificateUploading(true);

    try {
      if (!window.PortfolioCertificates) {
        throw new Error(
          "Certificate module is not loaded. Please refresh the page."
        );
      }

      await window.PortfolioCertificates.add({
        title: fields.namedItem("certificateTitle").value,
        issuer: fields.namedItem("certificateIssuer").value,
        date: fields.namedItem("certificateDate").value,
        file: fields.namedItem("certificateFile").files[0]
      });

      form.reset();
      setCertificateMessage("Certificate saved successfully!");
      setCertificateRefreshKey(key => key + 1);
    } catch (error) {
      setCertificateMessage(
        error instanceof Error
          ? error.message
          : "Could not save the certificate. Please try again."
      );
    } finally {
      setCertificateUploading(false);
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>
          Portfolio<span>Pro</span>
        </h2>

        <p className="side-label">MY WORKSPACE</p>

        <nav>
          <button
            type="button"
            onClick={() => window.showSection("overview")}
          >
            🏠 Overview
          </button>

          <button
            type="button"
            onClick={() => window.showSection("profile")}
          >
            👤 My Profile
          </button>

          <button
            type="button"
            onClick={() => window.showSection("skills")}
          >
            💻 Skills
          </button>

          <button
            type="button"
            onClick={() => window.showSection("projects")}
          >
            📁 Projects
          </button>

          <button
            type="button"
            onClick={() => window.showSection("achievements")}
          >
            🏆 Achievements
          </button>

          <button
            type="button"
            onClick={() => window.showSection("blogs")}
          >
            ✍️ Blogs
          </button>

          <button
            type="button"
            onClick={() => window.showSection("contact")}
          >
            📞 Contact
          </button>

          <button
            type="button"
            onClick={() => window.showSection("customization")}
          >
            🎨 Customize
          </button>

          <button
            type="button"
            onClick={openCertificates}
          >
            📜 Certificates
          </button>

          <button
            type="button"
            id="openResumeBuilderBtn"
            onClick={() => {
              window.location.href = "resume.html";
            }}
          >
            📄 Resume Builder
          </button>

          <button
            type="button"
            onClick={openPortfolioPreview}
          >
            👁️ Preview Portfolio
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
            <h1 id="pageTitle">Dashboard Overview</h1>
            <p>Manage your professional portfolio</p>
          </div>

          <div className="topbar-user">
            <img
              id="topProfilePicture"
              className="top-profile-picture"
              alt="Profile Picture"
              hidden
            />

            <span
              className="user-badge"
              id="topUser"
            />
          </div>
        </header>

        <section
          id="overview"
          className="page-section"
        >
          <div className="welcome">
            <h2>
              Welcome, <span id="welcomeName" /> 👋
            </h2>

            <p>
              Build your personal brand by updating your portfolio.
            </p>
          </div>

          <div className="stats">
            <article className="stat-card">
              <p>Skills</p>
              <h2 id="skillCount">0</h2>
            </article>

            <article className="stat-card">
              <p>Projects</p>
              <h2 id="projectCount">0</h2>
            </article>

            <article className="stat-card">
              <p>Achievements</p>
              <h2 id="achievementCount">0</h2>
            </article>

            <article className="stat-card">
              <p>Blog Posts</p>
              <h2 id="blogCount">0</h2>
            </article>
          </div>

          <div className="panel">
            <h2>Portfolio Summary</h2>
            <div id="portfolioSummary" />
          </div>

          <div className="panel">
            <h2>📊 Smart Dashboard Analytics</h2>

            <h3>Profile Completion</h3>

            <div className="completion-header">
              <span>Your Profile Progress</span>

              <strong id="profileCompletionPercent">
                0%
              </strong>
            </div>

            <div className="progress-track">
              <div id="profileProgressFill" />
            </div>

            <h3>Portfolio Activity</h3>

            <div className="analytics-grid">
              <div className="analytics-card">
                <p>Total Portfolio Items</p>
                <h2 id="totalPortfolioItems">0</h2>
              </div>

              <div className="analytics-card">
                <p>Skill Categories</p>
                <h2 id="totalSkillCategories">0</h2>
              </div>
            </div>

            <h3>Smart Suggestions</h3>
            <ul id="analyticsSuggestions" />

            <h3>Portfolio Activity Chart</h3>
            <div id="portfolioActivityChart" />

            <h3>Skill Distribution Chart</h3>
            <div id="skillDistributionChart" />
          </div>
        </section>

        <section
          id="profile"
          className="page-section hidden"
        >
          <div className="panel">
            <h2>My Profile</h2>

            <form id="profileForm">
              <label>
                Full Name
                <input id="profileName" required />
              </label>

              <label>
                Email
                <input
                  id="profileEmail"
                  type="email"
                  readOnly
                />
              </label>

              <label>
                Phone
                <input id="profilePhone" type="tel" />
              </label>

              <label>
                Education
                <input id="profileEducation" />
              </label>

              <label>
                About Me
                <textarea id="profileBio" rows={4} />
              </label>

              <label>
                GitHub URL
                <input id="profileGithub" type="url" />
              </label>

              <label>
                LinkedIn URL
                <input id="profileLinkedin" type="url" />
              </label>

              <button className="primary-btn" type="submit">
                Save Profile
              </button>
            </form>
          </div>
        </section>

        <section
          id="skills"
          className="page-section hidden"
        >
          <div className="panel">
            <h2>My Skills</h2>

            <form id="skillForm">
              <label>
                Skill Category
                <select id="skillCategory">
                  <option>Programming Languages</option>
                  <option>Web Development</option>
                  <option>Databases &amp; Tools</option>
                  <option>Core Computer Science</option>
                  <option>Professional Skills</option>
                </select>
              </label>

              <label>
                Skill Name
                <input
                  id="skillInput"
                  placeholder="Example: Python"
                  required
                />
              </label>

              <button className="primary-btn" type="submit">
                Add Skill
              </button>
            </form>

            <div
              id="skillsList"
              className="skill-category-grid"
            />
          </div>
        </section>

        <section
          id="projects"
          className="page-section hidden"
        >
          <div className="panel">
            <h2>My Projects</h2>

            <form id="projectForm">
              <label>
                Project Title
                <input id="projectTitle" required />
              </label>

              <label>
                Description
                <textarea
                  id="projectDescription"
                  rows={3}
                  required
                />
              </label>

              <label>
                Technologies Used
                <input id="projectTech" />
              </label>

              <label>
                Project Link
                <input id="projectLink" type="url" />
              </label>

              <button className="primary-btn" type="submit">
                Add Project
              </button>
            </form>

            <div id="projectsList" className="item-grid" />
          </div>
        </section>

        <section
          id="achievements"
          className="page-section hidden"
        >
          <div className="panel">
            <h2>My Achievements 🏆</h2>

            <form id="achievementForm">
              <label>
                Achievement Title
                <input id="achievementTitle" required />
              </label>

              <label>
                Description
                <textarea
                  id="achievementDescription"
                  rows={3}
                />
              </label>

              <button className="primary-btn" type="submit">
                Add Achievement
              </button>
            </form>

            <div id="achievementsList" className="item-grid" />
          </div>
        </section>

        <section
          id="blogs"
          className="page-section hidden"
        >
          <div className="panel">
            <h2>My Blog Posts</h2>

            <form id="blogForm">
              <label>
                Blog Title
                <input id="blogTitle" required />
              </label>

              <label>
                Blog Content
                <textarea
                  id="blogContent"
                  rows={5}
                  required
                />
              </label>

              <button className="primary-btn" type="submit">
                Publish Blog
              </button>
            </form>

            <div id="blogsList" className="item-grid" />
          </div>
        </section>

        <section
          id="contact"
          className="page-section hidden"
        >
          <div className="panel">
            <h2>Contact Information</h2>

            <div id="contactDetails" />

            <p className="hint">
              Edit these details in My Profile.
            </p>
          </div>
        </section>

        <section
          id="customization"
          className="page-section hidden"
        >
          <div className="panel">
            <h2>🎨 Profile &amp; Theme Customization</h2>

            <p>
              Personalize your PortfolioPro dashboard.
            </p>

            <div className="customization-block">
              <h3>👤 Profile Picture</h3>

              <div className="profile-picture-container">
                <img
                  id="profilePicturePreview"
                  className="profile-picture-preview"
                  alt="Your Profile Picture"
                  hidden
                />

                <div
                  id="profilePicturePlaceholder"
                  className="profile-picture-placeholder"
                >
                  👤
                </div>
              </div>

              <label htmlFor="profilePictureInput">
                Upload Profile Picture
              </label>

              <input
                type="file"
                id="profilePictureInput"
                accept="image/jpeg,image/png,image/webp"
              />

              <p className="hint">
                Supported: JPG, PNG, WebP. Maximum size: 5 MB.
              </p>

              <div className="customization-actions">
                <button
                  type="button"
                  className="primary-btn"
                  id="uploadProfilePictureBtn"
                >
                  Upload Picture
                </button>

                <button
                  type="button"
                  id="removeProfilePictureBtn"
                >
                  Remove Picture
                </button>
              </div>

              <p id="profilePictureMessage" role="status" />
            </div>

            <div className="customization-block">
              <h3>🌙 Dashboard Theme</h3>

              <p>Choose your preferred appearance.</p>

              <div className="theme-options">
                <label>
                  <input
                    type="radio"
                    name="dashboardTheme"
                    value="light"
                    defaultChecked
                  />
                  ☀️ Light Mode
                </label>

                <label>
                  <input
                    type="radio"
                    name="dashboardTheme"
                    value="dark"
                  />
                  🌙 Dark Mode
                </label>
              </div>
            </div>

            <div className="customization-block">
              <h3>🎨 Accent Color</h3>

              <p>
                Select your dashboard highlight color.
              </p>

              <div className="accent-color-options">
                <label>
                  <input
                    type="radio"
                    name="accentColor"
                    value="blue"
                    defaultChecked
                  />
                  🔵 Blue
                </label>

                <label>
                  <input
                    type="radio"
                    name="accentColor"
                    value="purple"
                  />
                  🟣 Purple
                </label>

                <label>
                  <input
                    type="radio"
                    name="accentColor"
                    value="green"
                  />
                  🟢 Green
                </label>

                <label>
                  <input
                    type="radio"
                    name="accentColor"
                    value="orange"
                  />
                  🟠 Orange
                </label>
              </div>
            </div>

            <div className="customization-block">
              <button
                type="button"
                className="primary-btn"
                id="saveCustomizationBtn"
              >
                Save Customization
              </button>

              <p id="customizationMessage" role="status" />
            </div>
          </div>
        </section>

        <section
          id="certificates"
          className="page-section hidden"
        >
          <div className="panel">
            <h2>📜 My Certificates</h2>

            <p>
              Add your professional certificates and credentials.
            </p>

            <form
              id="certificateForm"
              onSubmit={handleCertificateUpload}
            >
              <label>
                Certificate Title
                <input
                  id="certificateTitle"
                  placeholder="Example: Java Programming"
                  required
                />
              </label>

              <label>
                Issued By
                <input
                  id="certificateIssuer"
                  placeholder="Example: NPTEL"
                />
              </label>

              <label>
                Issue Date
                <input
                  id="certificateDate"
                  type="date"
                />
              </label>

              <label>
                Certificate File
                <input
                  id="certificateFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
              </label>

              <p className="hint">
                Supported: PDF, JPG, PNG. Maximum size: 5 MB.
              </p>

              <button
                className="primary-btn"
                type="submit"
                disabled={certificateUploading}
              >
                {certificateUploading
                  ? "Saving..."
                  : "Upload Certificate"}
              </button>

              <p
                id="certificateMessage"
                role="status"
              >
                {certificateMessage}
              </p>
            </form>

            <div id="certificatesList">
              {certificatesOpened && (
                <CertificateList
                  refreshKey={certificateRefreshKey}
                />
              )}
            </div>
          </div>
        </section>

        <section
          id="portfolioPreview"
          className="page-section hidden"
        >
          {previewOpened && (
            <PortfolioPreview
              refreshKey={previewRefreshKey}
            />
          )}
        </section>
      </main>
    </div>
  );
}