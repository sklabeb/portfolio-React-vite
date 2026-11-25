/* ==========================================
 PORTFOLIOPRO 2.0
 FEATURE 3 - RESUME EDITOR
 File: features/resumeEditor.js
 ========================================== */

(function() {
  "use strict";

  const Builder = window.PortfolioResumeBuilder;
  const PDF = window.PortfolioResumePDF;

  if (!Builder || !PDF) {
    console.error("Resume Builder or PDF module is missing.");
    return;
  }

  let resume = null;
  let hasUnsavedChanges = false;
  let statusTimer = null;

  // ======================================
  // 1. DOM HELPERS
  // ======================================

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const element = $(id);

    if (element) {
      element.textContent = value == null ? "" : String(value);
    }
  }

  function setValue(id, value) {
    const element = $(id);

    if (element) {
      element.value = value == null ? "" : value;
    }
  }

  function createElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (content !== undefined) {
      element.textContent = String(content);
    }

    return element;
  }

  function clearElement(id) {
    const element = $(id);

    if (element) {
      element.replaceChildren();
    }

    return element;
  }

  // ======================================
  // 2. NOTIFICATION SYSTEM
  // ======================================

  function ensureStatusElement() {
    let status = $("resumeStatus");

    if (status) {
      return status;
    }

    status = document.createElement("div");
    status.id = "resumeStatus";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    const saveButton =
      $("saveResumeBtn") ||
      $("saveResumeBottomBtn");

    if (saveButton && saveButton.parentElement) {
      saveButton.insertAdjacentElement(
        "afterend",
        status
      );
    } else {
      document.body.appendChild(status);
    }

    return status;
  }

  function showStatus(message, type = "success") {
    const status = ensureStatusElement();

    if (statusTimer) {
      clearTimeout(statusTimer);
      statusTimer = null;
    }

    status.textContent = message;
    status.className = "status-message " + type;

    status.style.cssText = `
      display: block;
      padding: 12px 16px;
      margin: 12px 0;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.5;
      background: ${
        type === "success"
          ? "#dcfce7"
          : type === "warning"
          ? "#fef3c7"
          : "#fee2e2"
      };
      color: ${
        type === "success"
          ? "#166534"
          : type === "warning"
          ? "#92400e"
          : "#991b1b"
      };
      border: 1px solid ${
        type === "success"
          ? "#86efac"
          : type === "warning"
          ? "#fcd34d"
          : "#fca5a5"
      };
    `;

    if (type === "success") {
      statusTimer = setTimeout(function() {
        status.style.display = "none";
      }, 5000);
    }
  }

  function updateSaveButtons() {
    [
      "saveResumeBtn",
      "saveResumeBottomBtn"
    ].forEach(function(id) {
      const button = $(id);

      if (!button) {
        return;
      }

      button.textContent = hasUnsavedChanges ?
        "💾 Save Resume (Unsaved)" :
        "✓ Save Resume";
    });
  }

  function markChanged() {
    hasUnsavedChanges = true;

    updateSaveButtons();

    showStatus(
      "⚠ You have unsaved changes.",
      "warning"
    );
  }

  // ======================================
  // 3. DATE FORMAT
  // ======================================

  function formatDate(value) {
    if (!value) {
      return "";
    }

    const match = /^(\d{4})-(\d{2})$/.exec(value);

    if (!match) {
      return value;
    }

    const date = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      1
    );

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  }

  // ======================================
  // 4. LOAD RESUME INTO FORM
  // ======================================

  function fillForm() {
    if (!resume) {
      return;
    }

    setValue("resumeFullName", resume.fullName);
    setValue("resumeEmail", resume.email);
    setValue("resumePhone", resume.phone);
    setValue("resumeEducation", resume.education);
    setValue("resumeGithub", resume.github);
    setValue("resumeLinkedin", resume.linkedin);
    setValue("resumeObjective", resume.objective);

    document.querySelectorAll(
      'input[name="resumeTemplate"]'
    ).forEach(function(input) {
      input.checked =
        input.value === resume.template;
    });
  }

  // ======================================
  // 5. IMPORTED ITEMS
  // ======================================

  function renderImportedList(
    containerId,
    items,
    titleField,
    descriptionField
  ) {
    const container = clearElement(containerId);

    if (!container) {
      return;
    }

    if (!items || !items.length) {
      container.appendChild(
        createElement(
          "p",
          "empty-message",
          "No items available."
        )
      );
      return;
    }

    items.forEach(function(item) {
      const card = createElement(
        "div",
        "resume-list-item"
      );

      card.appendChild(
        createElement(
          "h4",
          "",
          item[titleField] || "Untitled"
        )
      );

      if (item[descriptionField]) {
        card.appendChild(
          createElement(
            "p",
            "",
            item[descriptionField]
          )
        );
      }

      container.appendChild(card);
    });
  }

  function renderSkillsEditor() {
    const container = clearElement("resumeSkillsList");

    if (!container) {
      return;
    }

    if (!resume.skills.length) {
      container.appendChild(
        createElement(
          "p",
          "empty-message",
          "No skills found in your portfolio."
        )
      );
      return;
    }

    resume.skills.forEach(function(skill) {
      container.appendChild(
        createElement(
          "span",
          "skill-chip",
          skill.name
        )
      );
    });
  }

  // ======================================
  // 6. EDITABLE SECTIONS
  // ======================================

  const editableSections = [{
      key: "experience",
      container: "experienceList",
      title: "role",
      detail: "company"
    },
    {
      key: "certifications",
      container: "certificationsList",
      title: "name",
      detail: "issuer"
    },
    {
      key: "languages",
      container: "languagesList",
      title: null,
      detail: null
    },
    {
      key: "additionalEducation",
      container: "additionalEducationList",
      title: "institution",
      detail: "degree"
    }
  ];

  function renderEditableLists() {
    editableSections.forEach(function(section) {
      const container = clearElement(
        section.container
      );

      if (!container) {
        return;
      }

      const items = resume[section.key] || [];

      if (!items.length) {
        container.appendChild(
          createElement(
            "p",
            "empty-message",
            "No entries added yet."
          )
        );
        return;
      }

      items.forEach(function(item, index) {
        const card = createElement(
          "div",
          "resume-list-item"
        );

        const title = section.title ?
          item[section.title] :
          item;

        card.appendChild(
          createElement(
            "h4",
            "",
            title || "Untitled"
          )
        );

        if (
          section.detail &&
          item[section.detail]
        ) {
          card.appendChild(
            createElement(
              "p",
              "",
              item[section.detail]
            )
          );
        }

        const removeButton = createElement(
          "button",
          "",
          "Remove"
        );

        removeButton.type = "button";

        removeButton.addEventListener(
          "click",
          function() {
            resume = Builder.removeItem(
              resume,
              section.key,
              index
            );

            markChanged();
            renderAll();
          }
        );

        card.appendChild(removeButton);
        container.appendChild(card);
      });
    });
  }

  // ======================================
  // 7. PREVIEW HELPERS
  // ======================================

  function setSectionVisible(sectionId, visible) {
    const section = $(sectionId);

    if (section) {
      section.hidden = !visible;
    }
  }

  function addPreviewEntry(
    container,
    title,
    meta,
    description
  ) {
    const entry = createElement(
      "div",
      "preview-entry"
    );

    if (title) {
      entry.appendChild(
        createElement("h3", "", title)
      );
    }

    if (meta) {
      entry.appendChild(
        createElement(
          "p",
          "entry-meta",
          meta
        )
      );
    }

    if (description) {
      entry.appendChild(
        createElement(
          "p",
          "",
          description
        )
      );
    }

    container.appendChild(entry);
  }

  // ======================================
  // 8. LIVE RESUME PREVIEW
  // ======================================

  function renderPreview() {
    if (!resume) {
      return;
    }

    const paper = $("resumePrintArea");

    if (paper) {
      paper.classList.remove(
        "template-professional",
        "template-modern"
      );

      paper.classList.add(
        "template-" + resume.template
      );
    }

    setText(
      "previewFullName",
      resume.fullName || "Your Name"
    );

    const contact = [
      resume.email,
      resume.phone
    ].filter(Boolean);

    setText(
      "previewContact",
      contact.join(" | ")
    );

    // LINKS

    const links = clearElement("previewLinks");

    if (links) {
      [
        ["GitHub", resume.github],
        ["LinkedIn", resume.linkedin]
      ].forEach(function(entry) {
        if (!entry[1]) {
          return;
        }

        if (links.childNodes.length) {
          links.appendChild(
            document.createTextNode(" | ")
          );
        }

        const link = createElement(
          "a",
          "",
          entry[0]
        );

        try {
          const url = new URL(entry[1]);

          if (
            url.protocol !== "https:" &&
            url.protocol !== "http:"
          ) {
            return;
          }

          link.href = url.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          links.appendChild(link);
        } catch (error) {
          links.appendChild(
            document.createTextNode(entry[1])
          );
        }
      });
    }

    // CAREER OBJECTIVE

    setText(
      "previewObjective",
      resume.objective
    );

    setSectionVisible(
      "previewObjectiveSection",
      Boolean(resume.objective)
    );

    // EDUCATION

    const education = clearElement(
      "previewEducation"
    );

    if (education && resume.education) {
      addPreviewEntry(
        education,
        resume.education,
        "",
        ""
      );
    }

    resume.additionalEducation.forEach(
      function(item) {
        if (!education) {
          return;
        }

        addPreviewEntry(
          education,
          item.degree || item.institution, [
            item.institution,
            item.year
          ].filter(Boolean).join(" | "),
          item.details
        );
      }
    );

    setSectionVisible(
      "previewEducationSection",
      Boolean(
        resume.education ||
        resume.additionalEducation.length
      )
    );

    // SKILLS

    const skills = clearElement("previewSkills");

    if (skills) {
      const group = createElement(
        "div",
        "preview-skills-group"
      );

      resume.skills.forEach(function(skill, index) {
        const label = createElement(
          "span",
          "preview-skill",
          skill.name +
          (
            index < resume.skills.length - 1 ?
            " •" :
            ""
          )
        );

        group.appendChild(label);
      });

      skills.appendChild(group);
    }

    setSectionVisible(
      "previewSkillsSection",
      resume.skills.length > 0
    );

    // EXPERIENCE

    const experience = clearElement(
      "previewExperience"
    );

    resume.experience.forEach(function(item) {
      if (!experience) {
        return;
      }

      addPreviewEntry(
        experience,
        item.role, [
          item.company,
          item.location, [
            formatDate(item.startDate),
            formatDate(item.endDate) || "Present"
          ].filter(Boolean).join(" - ")
        ].filter(Boolean).join(" | "),
        item.description
      );
    });

    setSectionVisible(
      "previewExperienceSection",
      resume.experience.length > 0
    );

    // PROJECTS

    const projects = clearElement(
      "previewProjects"
    );

    resume.projects.forEach(function(item) {
      if (!projects) {
        return;
      }

      addPreviewEntry(
        projects,
        item.title,
        item.technologies,
        item.description
      );
    });

    setSectionVisible(
      "previewProjectsSection",
      resume.projects.length > 0
    );

    // ACHIEVEMENTS

    const achievements = clearElement(
      "previewAchievements"
    );

    resume.achievements.forEach(function(item) {
      if (!achievements) {
        return;
      }

      addPreviewEntry(
        achievements,
        item.title,
        "",
        item.description
      );
    });

    setSectionVisible(
      "previewAchievementsSection",
      resume.achievements.length > 0
    );

    // CERTIFICATIONS

    const certifications = clearElement(
      "previewCertifications"
    );

    resume.certifications.forEach(function(item) {
      if (!certifications) {
        return;
      }

      addPreviewEntry(
        certifications,
        item.name, [
          item.issuer,
          formatDate(item.date)
        ].filter(Boolean).join(" | "),
        ""
      );
    });

    setSectionVisible(
      "previewCertificationsSection",
      resume.certifications.length > 0
    );

    // LANGUAGES

    const languages = clearElement(
      "previewLanguages"
    );

    if (languages) {
      languages.appendChild(
        createElement(
          "p",
          "",
          resume.languages.join(", ")
        )
      );
    }

    setSectionVisible(
      "previewLanguagesSection",
      resume.languages.length > 0
    );

    updateCompletion();
  }

  // ======================================
  // 9. RESUME COMPLETION
  // ======================================

  function updateCompletion() {
    if (!resume) {
      return;
    }

    const percentage =
      Builder.getResumeCompletion(resume);

    setText(
      "resumeCompletionPercent",
      percentage + "%"
    );

    const progress = $("resumeProgressFill");

    if (progress) {
      progress.style.width = percentage + "%";
    }
  }

  // ======================================
  // 10. RENDER ALL
  // ======================================

  function renderAll() {
    if (!resume) {
      return;
    }

    renderSkillsEditor();

    renderImportedList(
      "resumeProjectsList",
      resume.projects,
      "title",
      "description"
    );

    renderImportedList(
      "resumeAchievementsList",
      resume.achievements,
      "title",
      "description"
    );

    renderEditableLists();
    renderPreview();
  }

  // ======================================
  // 11. PERSONAL FIELD EVENTS
  // ======================================

  function setupPersonalFields() {
    const fields = {
      resumeFullName: "fullName",
      resumeEmail: "email",
      resumePhone: "phone",
      resumeEducation: "education",
      resumeGithub: "github",
      resumeLinkedin: "linkedin",
      resumeObjective: "objective"
    };

    Object.entries(fields).forEach(
      function([elementId, field]) {
        const input = $(elementId);

        if (!input) {
          return;
        }

        input.addEventListener(
          "input",
          function() {
            resume = Builder.updateField(
              resume,
              field,
              input.value
            );

            markChanged();
            renderPreview();
          }
        );
      }
    );
  }

  // ======================================
  // 12. TEMPLATE SWITCHING
  // ======================================

  function setupTemplates() {
    document.querySelectorAll(
      'input[name="resumeTemplate"]'
    ).forEach(function(input) {
      input.addEventListener(
        "change",
        function() {
          if (!input.checked) {
            return;
          }

          resume = Builder.updateTemplate(
            resume,
            input.value
          );

          markChanged();
          renderPreview();
        }
      );
    });
  }

  // ======================================
  // 13. EXPERIENCE FORM
  // ======================================

  function setupExperienceForm() {
    const form = $("experienceForm");

    if (!form) {
      return;
    }

    form.addEventListener(
      "submit",
      function(event) {
        event.preventDefault();

        const item = {
          id: String(Date.now()),
          role: $("experienceRole").value.trim(),
          company: $("experienceCompany").value.trim(),
          location: $("experienceLocation").value.trim(),
          startDate: $("experienceStartDate").value,
          endDate: $("experienceEndDate").value,
          description: $("experienceDescription").value.trim()
        };

        if (!item.role || !item.company) {
          showStatus(
            "Role and company are required.",
            "error"
          );
          return;
        }

        resume = Builder.addItem(
          resume,
          "experience",
          item
        );

        form.reset();
        markChanged();
        renderAll();
      }
    );
  }

  // ======================================
  // 14. CERTIFICATION FORM
  // ======================================

  function setupCertificationForm() {
    const form = $("certificationForm");

    if (!form) {
      return;
    }

    form.addEventListener(
      "submit",
      function(event) {
        event.preventDefault();

        const item = {
          name: $("certificationName").value.trim(),
          issuer: $("certificationIssuer").value.trim(),
          date: $("certificationDate").value,
          link: $("certificationLink").value.trim()
        };

        if (!item.name) {
          showStatus(
            "Certification name is required.",
            "error"
          );
          return;
        }

        resume = Builder.addItem(
          resume,
          "certifications",
          item
        );

        form.reset();
        markChanged();
        renderAll();
      }
    );
  }

  // ======================================
  // 15. LANGUAGE FORM
  // ======================================

  function setupLanguageForm() {
    const form = $("languageForm");

    if (!form) {
      return;
    }

    form.addEventListener(
      "submit",
      function(event) {
        event.preventDefault();

        const language =
          $("languageInput").value.trim();

        if (!language) {
          return;
        }

        const alreadyExists = resume.languages.some(
          function(item) {
            return item.toLowerCase() ===
              language.toLowerCase();
          }
        );

        if (alreadyExists) {
          showStatus(
            "Language already added.",
            "error"
          );
          return;
        }

        resume = Builder.addItem(
          resume,
          "languages",
          language
        );

        form.reset();
        markChanged();
        renderAll();
      }
    );
  }

  // ======================================
  // 16. ADDITIONAL EDUCATION
  // ======================================

  function setupEducationForm() {
    const form = $("additionalEducationForm");

    if (!form) {
      return;
    }

    form.addEventListener(
      "submit",
      function(event) {
        event.preventDefault();

        const item = {
          institution: $("additionalInstitution").value.trim(),
          degree: $("additionalDegree").value.trim(),
          year: $("additionalYear").value.trim(),
          details: $("additionalDetails").value.trim()
        };

        if (!item.institution) {
          showStatus(
            "Institution is required.",
            "error"
          );
          return;
        }

        resume = Builder.addItem(
          resume,
          "additionalEducation",
          item
        );

        form.reset();
        markChanged();
        renderAll();
      }
    );
  }

  // ======================================
  // 17. SAVE RESUME
  // ======================================

  function saveResume() {
    if (!resume) {
      showStatus(
        "Please login and load your resume first.",
        "error"
      );
      return false;
    }

    try {
      const savedResume = Builder.saveResume(resume);

      if (!savedResume) {
        throw new Error(
          "Resume save did not return saved data."
        );
      }

      resume = savedResume;
      hasUnsavedChanges = false;

      updateSaveButtons();
      renderPreview();

      showStatus(
        "✓ Resume saved successfully! Your changes are stored.",
        "success"
      );

      console.log(
        "PortfolioPro Resume Saved Successfully"
      );

      return true;

    } catch (error) {
      console.error("Resume Save Error:", error);

      showStatus(
        "✕ Save failed: " + error.message,
        "error"
      );

      return false;
    }
  }

  // ======================================
  // 18. RESET RESUME
  // ======================================

  function resetResume() {
    const confirmed = window.confirm(
      "Reset resume to your portfolio details? " +
      "Your saved resume edits will be replaced."
    );

    if (!confirmed) {
      return;
    }

    try {
      resume = Builder.resetResume();

      hasUnsavedChanges = false;

      fillForm();
      renderAll();
      updateSaveButtons();

      showStatus(
        "✓ Resume reset successfully.",
        "success"
      );

    } catch (error) {
      showStatus(
        "Reset failed: " + error.message,
        "error"
      );
    }
  }

  // ======================================
  // 19. DOWNLOAD PDF
  // ======================================

  function downloadPDF() {
    if (!resume) {
      return;
    }

    if (hasUnsavedChanges) {
      if (!saveResume()) {
        return;
      }
    }

    try {
      renderPreview();

      PDF.exportToPDF(resume);

      showStatus(
        "Select Save as PDF in the print dialog.",
        "success"
      );

    } catch (error) {
      showStatus(
        "PDF export failed: " + error.message,
        "error"
      );
    }
  }

  // ======================================
  // 20. REFRESH PREVIEW
  // ======================================

  function refreshPreview() {
    if (!resume) {
      showStatus(
        "Resume data is not loaded.",
        "error"
      );
      return;
    }

    try {
      // Update the preview using the
      // latest in-memory resume data.
      renderAll();

      showStatus(
        "✓ Resume preview refreshed successfully!",
        "success"
      );

      console.log(
        "PortfolioPro Resume Preview Refreshed"
      );

    } catch (error) {
      console.error(
        "Resume Preview Refresh Error:",
        error
      );

      showStatus(
        "Preview refresh failed: " + error.message,
        "error"
      );
    }
  }

  // ======================================
  // 21. BUTTON EVENTS
  // ======================================

  function setupButtons() {
    [
      "saveResumeBtn",
      "saveResumeBottomBtn"
    ].forEach(function(id) {
      const button = $(id);

      if (button) {
        button.addEventListener(
          "click",
          function(event) {
            event.preventDefault();
            saveResume();
          }
        );
      }
    });

    const download = $("downloadResumeBtn");

    if (download) {
      download.addEventListener(
        "click",
        function(event) {
          event.preventDefault();
          downloadPDF();
        }
      );
    }

    const reset = $("resetResumeBtn");

    if (reset) {
      reset.addEventListener(
        "click",
        function(event) {
          event.preventDefault();
          resetResume();
        }
      );
    }

    const refresh = $("refreshPreviewBtn");

    if (refresh) {
      refresh.addEventListener(
        "click",
        function(event) {
          event.preventDefault();
          refreshPreview();
        }
      );
    }
  }

  // ======================================
  // 22. UNSAVED CHANGES WARNING
  // ======================================

  function setupUnsavedWarning() {
    window.addEventListener(
      "beforeunload",
      function(event) {
        if (!hasUnsavedChanges) {
          return;
        }

        event.preventDefault();
        event.returnValue = "";
      }
    );
  }

  // ======================================
  // 23. INITIALIZE RESUME EDITOR
  // ======================================

  function initialize() {
    try {
      resume = Builder.loadResume();

      if (!resume) {
        throw new Error(
          "Resume data could not be loaded."
        );
      }

    } catch (error) {
      console.error(error);

      showStatus(
        error.message,
        "error"
      );

      return;
    }

    fillForm();
    renderAll();

    setupPersonalFields();
    setupTemplates();

    setupExperienceForm();
    setupCertificationForm();
    setupLanguageForm();
    setupEducationForm();

    setupButtons();
    setupUnsavedWarning();

    updateSaveButtons();

    console.log(
      "PortfolioPro Resume Editor Initialized"
    );
  }

  // ======================================
  // 24. PUBLIC API
  // ======================================

  window.PortfolioResumeEditor = {
    getResume: function() {
      return resume ?
        JSON.parse(JSON.stringify(resume)) :
        null;
    },

    renderPreview: renderPreview,

    refreshPreview: refreshPreview,

    saveResume: saveResume
  };

  // ======================================
  // 25. DOM READY
  // ======================================

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }

})();