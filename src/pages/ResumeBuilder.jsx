import React, { useEffect } from "react";
import { loadScripts } from "../scripts.js";

export default function ResumeBuilder() {
  useEffect(() => {
    loadScripts([
      "/features/resumeBuilder.js",
      "/features/resumePDF.js",
      "/features/resumeEditor.js"
    ]);
  }, []);

  return (
    <>
      <header className="resume-header">
        <div className="resume-brand">
          <h2>
            Portfolio<span>Pro</span>
          </h2>
          <p>Smart Resume Builder</p>
        </div>

        <div className="header-actions">
          <a href="user.html" className="back-btn">
            ← Back to Dashboard
          </a>

          <button
            type="button"
            id="saveResumeBtn"
            className="primary-btn"
          >
            💾 Save Resume
          </button>

          <button
            type="button"
            id="downloadResumeBtn"
            className="download-btn"
          >
            📄 Download PDF
          </button>
        </div>
      </header>

      <main className="resume-builder-layout">
        <section className="resume-editor">
          <div className="editor-heading">
            <h1>Build Your Resume</h1>
            <p>
              Edit your information and preview your professional
              resume instantly.
            </p>
          </div>

          <div className="editor-card">
            <div className="completion-header">
              <h3>Resume Completion</h3>
              <strong id="resumeCompletionPercent">0%</strong>
            </div>

            <div className="progress-track">
              <div
                id="resumeProgressFill"
                className="progress-fill"
              />
            </div>

            <p className="hint">
              Complete important sections to improve your resume.
            </p>
          </div>

          <div className="editor-card">
            <h3>🎨 Choose Resume Template</h3>

            <div className="template-options">
              <label className="template-option">
                <input
                  type="radio"
                  name="resumeTemplate"
                  value="professional"
                  defaultChecked
                />

                <span>
                  <strong>Professional</strong>
                  <small>Clean, ATS-friendly layout</small>
                </span>
              </label>

              <label className="template-option">
                <input
                  type="radio"
                  name="resumeTemplate"
                  value="modern"
                />

                <span>
                  <strong>Modern</strong>
                  <small>Contemporary two-column layout</small>
                </span>
              </label>
            </div>
          </div>

          <div className="editor-card">
            <h3>👤 Personal Information</h3>

            <p className="section-description">
              These fields are initially filled using your
              PortfolioPro profile.
            </p>

            <div className="form-grid">
              <label>
                Full Name
                <input
                  type="text"
                  id="resumeFullName"
                  placeholder="Your full name"
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  id="resumeEmail"
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  id="resumePhone"
                  placeholder="Your phone number"
                />
              </label>

              <label>
                Education
                <input
                  type="text"
                  id="resumeEducation"
                  placeholder="Degree and university"
                />
              </label>

              <label>
                GitHub URL
                <input
                  type="url"
                  id="resumeGithub"
                  placeholder="https://github.com/username"
                />
              </label>

              <label>
                LinkedIn URL
                <input
                  type="url"
                  id="resumeLinkedin"
                  placeholder="https://linkedin.com/in/username"
                />
              </label>
            </div>
          </div>

          <div className="editor-card">
            <h3>🎯 Career Objective</h3>

            <label htmlFor="resumeObjective">
              Professional Summary
            </label>

            <textarea
              id="resumeObjective"
              rows={5}
              placeholder="Write a short professional summary highlighting your skills, interests, and career goals."
            />
          </div>

          <div className="editor-card">
            <h3>💻 Technical &amp; Professional Skills</h3>

            <p className="section-description">
              Skills are imported from your PortfolioPro dashboard.
            </p>

            <div id="resumeSkillsList" />

            <p className="hint">
              To update your main portfolio skills, visit the dashboard.
            </p>
          </div>

          <div className="editor-card">
            <h3>📁 Projects</h3>

            <p className="section-description">
              Projects are imported from your saved portfolio.
            </p>

            <div id="resumeProjectsList" />
          </div>

          <div className="editor-card">
            <h3>🏆 Achievements</h3>
            <div id="resumeAchievementsList" />
          </div>

          <div className="editor-card">
            <h3>💼 Work Experience</h3>

            <p className="section-description">
              Add internships, jobs, or relevant professional experience.
            </p>

            <form id="experienceForm">
              <div className="form-grid">
                <label>
                  Job Role
                  <input
                    type="text"
                    id="experienceRole"
                    placeholder="Software Developer Intern"
                    required
                  />
                </label>

                <label>
                  Company
                  <input
                    type="text"
                    id="experienceCompany"
                    placeholder="Company name"
                    required
                  />
                </label>

                <label>
                  Location
                  <input
                    type="text"
                    id="experienceLocation"
                    placeholder="City or Remote"
                  />
                </label>

                <label>
                  Start Date
                  <input
                    type="month"
                    id="experienceStartDate"
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="month"
                    id="experienceEndDate"
                  />
                </label>
              </div>

              <label>
                Description
                <textarea
                  id="experienceDescription"
                  rows={3}
                  placeholder="Describe your responsibilities and achievements."
                />
              </label>

              <button
                type="submit"
                className="primary-btn"
              >
                + Add Experience
              </button>
            </form>

            <div
              id="experienceList"
              className="resume-item-list"
            />
          </div>

          <div className="editor-card">
            <h3>📜 Certifications</h3>

            <form id="certificationForm">
              <div className="form-grid">
                <label>
                  Certification Name
                  <input
                    type="text"
                    id="certificationName"
                    placeholder="Certification title"
                    required
                  />
                </label>

                <label>
                  Issuing Organization
                  <input
                    type="text"
                    id="certificationIssuer"
                    placeholder="Organization name"
                  />
                </label>

                <label>
                  Completion Date
                  <input
                    type="month"
                    id="certificationDate"
                  />
                </label>

                <label>
                  Certificate URL
                  <input
                    type="url"
                    id="certificationLink"
                    placeholder="https://example.com/certificate"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="primary-btn"
              >
                + Add Certification
              </button>
            </form>

            <div
              id="certificationsList"
              className="resume-item-list"
            />
          </div>

          <div className="editor-card">
            <h3>🌐 Languages</h3>

            <form id="languageForm">
              <label>
                Language
                <input
                  type="text"
                  id="languageInput"
                  placeholder="Example: English"
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-btn"
              >
                + Add Language
              </button>
            </form>

            <div
              id="languagesList"
              className="resume-item-list"
            />
          </div>

          <div className="editor-card">
            <h3>🎓 Additional Education</h3>

            <form id="additionalEducationForm">
              <div className="form-grid">
                <label>
                  Institution
                  <input
                    type="text"
                    id="additionalInstitution"
                    placeholder="College or school"
                    required
                  />
                </label>

                <label>
                  Degree / Qualification
                  <input
                    type="text"
                    id="additionalDegree"
                    placeholder="Degree or qualification"
                  />
                </label>

                <label>
                  Year
                  <input
                    type="text"
                    id="additionalYear"
                    placeholder="2024 - 2028"
                  />
                </label>
              </div>

              <label>
                Details
                <textarea
                  id="additionalDetails"
                  rows={3}
                  placeholder="Specialization, CGPA, or relevant information"
                />
              </label>

              <button
                type="submit"
                className="primary-btn"
              >
                + Add Education
              </button>
            </form>

            <div
              id="additionalEducationList"
              className="resume-item-list"
            />
          </div>

          <div className="editor-card">
            <h3>Resume Actions</h3>

            <div className="editor-actions">
              <button
                type="button"
                id="saveResumeBottomBtn"
                className="primary-btn"
              >
                💾 Save Resume
              </button>

              <button
                type="button"
                id="resetResumeBtn"
                className="secondary-btn"
              >
                Reset Resume Draft
              </button>
            </div>

            <p
              id="resumeStatus"
              className="status-message"
              role="status"
              aria-live="polite"
            />
          </div>
        </section>

        <section className="resume-preview-panel">
          <div className="preview-toolbar">
            <div>
              <h2>Live Resume Preview</h2>
              <p>A4 document preview</p>
            </div>

            <button
              type="button"
              id="refreshPreviewBtn"
              className="secondary-btn"
            >
              ↻ Refresh
            </button>
          </div>

          <div
            id="resumePrintArea"
            className="resume-paper template-professional"
          >
            <div className="preview-personal">
              <h1 id="previewFullName">Your Name</h1>
              <p id="previewContact">Email | Phone</p>
              <p id="previewLinks" />
            </div>

            <section
              id="previewObjectiveSection"
              className="preview-section"
            >
              <h2>Professional Summary</h2>
              <p id="previewObjective" />
            </section>

            <section
              id="previewEducationSection"
              className="preview-section"
            >
              <h2>Education</h2>
              <div id="previewEducation" />
            </section>

            <section
              id="previewSkillsSection"
              className="preview-section"
            >
              <h2>Skills</h2>
              <div id="previewSkills" />
            </section>

            <section
              id="previewExperienceSection"
              className="preview-section"
            >
              <h2>Work Experience</h2>
              <div id="previewExperience" />
            </section>

            <section
              id="previewProjectsSection"
              className="preview-section"
            >
              <h2>Projects</h2>
              <div id="previewProjects" />
            </section>

            <section
              id="previewAchievementsSection"
              className="preview-section"
            >
              <h2>Achievements</h2>
              <div id="previewAchievements" />
            </section>

            <section
              id="previewCertificationsSection"
              className="preview-section"
            >
              <h2>Certifications</h2>
              <div id="previewCertifications" />
            </section>

            <section
              id="previewLanguagesSection"
              className="preview-section"
            >
              <h2>Languages</h2>
              <div id="previewLanguages" />
            </section>
          </div>
        </section>
      </main>
    </>
  );
}