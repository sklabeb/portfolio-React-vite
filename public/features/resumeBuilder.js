/* ==========================================
 PORTFOLIOPRO 2.0
 SMART RESUME BUILDER - FEATURE 3
 ========================================== */

(function() {
  "use strict";

  // ======================================
  // 1. RESUME CONFIGURATION
  // ======================================

  const STORAGE_KEY = "portfolioUsers";

  const DEFAULT_TEMPLATE = "professional";

  const AVAILABLE_TEMPLATES = [
    "professional",
    "modern"
  ];

  // ======================================
  // 2. SAFE DATA HELPERS
  // ======================================

  function text(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value).trim();
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function safeObject(value) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return value;
    }

    return {};
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeTemplate(template) {
    return AVAILABLE_TEMPLATES.includes(template) ?
      template :
      DEFAULT_TEMPLATE;
  }

  // ======================================
  // 3. READ EXISTING PORTFOLIO USERS
  // ======================================

  function getUsers() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(
        "Unable to read portfolio users:",
        error
      );

      return [];
    }
  }

  // ======================================
  // 4. GET LOGGED-IN USER
  // ======================================

  function getSession() {
    try {
      const session = JSON.parse(
        sessionStorage.getItem(
          "portfolioSession"
        ) || "null"
      );

      if (!session ||
        session.role !== "user"
      ) {
        return null;
      }

      return session;
    } catch (error) {
      console.error(
        "Unable to read session:",
        error
      );

      return null;
    }
  }

  function getCurrentUser() {
    const session = getSession();

    if (!session) {
      return null;
    }

    return getUsers().find(function(user) {
      return user.id === session.id;
    }) || null;
  }

  // ======================================
  // 5. NORMALIZE SKILLS
  // ======================================

  function normalizeSkills(skills) {
    return safeArray(skills)
      .map(function(skill) {

        if (typeof skill === "string") {
          return {
            name: text(skill),
            category: "Other"
          };
        }

        const item = safeObject(skill);

        return {
          name: text(item.name),
          category: text(
            item.category || "Other"
          )
        };
      })
      .filter(function(skill) {
        return skill.name.length > 0;
      });
  }

  // ======================================
  // 6. NORMALIZE PROJECTS
  // ======================================

  function normalizeProjects(projects) {
    return safeArray(projects)
      .map(function(project) {

        const item = safeObject(project);

        return {
          title: text(item.title),
          description: text(
            item.description
          ),
          technologies: text(
            item.technologies ||
            item.tech
          ),
          link: text(item.link)
        };
      })
      .filter(function(project) {
        return project.title.length > 0;
      });
  }

  // ======================================
  // 7. NORMALIZE ACHIEVEMENTS
  // ======================================

  function normalizeAchievements(achievements) {
    return safeArray(achievements)
      .map(function(achievement) {

        const item = safeObject(achievement);

        return {
          title: text(item.title),
          description: text(
            item.description
          )
        };
      })
      .filter(function(achievement) {
        return achievement.title.length > 0;
      });
  }

  // ======================================
  // 8. NORMALIZE EXPERIENCE
  // ======================================

  function normalizeExperience(experience) {
    return safeArray(experience)
      .map(function(entry) {

        const item = safeObject(entry);

        return {
          id: text(item.id),
          role: text(item.role),
          company: text(item.company),
          location: text(item.location),
          startDate: text(item.startDate),
          endDate: text(item.endDate),
          description: text(
            item.description
          )
        };
      });
  }

  // ======================================
  // 9. NORMALIZE CERTIFICATIONS
  // ======================================

  function normalizeCertifications(certifications) {
    return safeArray(certifications)
      .map(function(entry) {

        if (typeof entry === "string") {
          return {
            name: text(entry),
            issuer: "",
            date: "",
            link: ""
          };
        }

        const item = safeObject(entry);

        return {
          name: text(item.name),
          issuer: text(item.issuer),
          date: text(item.date),
          link: text(item.link)
        };
      })
      .filter(function(entry) {
        return entry.name.length > 0;
      });
  }

  // ======================================
  // 10. NORMALIZE LANGUAGES
  // ======================================

  function normalizeLanguages(languages) {
    return safeArray(languages)
      .map(function(language) {

        if (typeof language === "string") {
          return text(language);
        }

        return text(
          safeObject(language).name
        );
      })
      .filter(Boolean);
  }

  // ======================================
  // 11. DEFAULT RESUME DATA
  // ======================================

  function createDefaultResume(user) {
    const source = safeObject(user);

    return {
      template: DEFAULT_TEMPLATE,

      fullName: text(source.name),
      email: text(source.email),
      phone: text(source.phone),

      education: text(source.education),

      github: text(source.github),
      linkedin: text(source.linkedin),

      objective: text(source.bio),

      skills: normalizeSkills(
        source.skills
      ),

      projects: normalizeProjects(
        source.projects
      ),

      achievements: normalizeAchievements(
        source.achievements
      ),

      experience: [],

      certifications: [],

      languages: [],

      additionalEducation: [],

      updatedAt: null
    };
  }

  // ======================================
  // 12. NORMALIZE RESUME DATA
  // ======================================

  function normalizeResume(resume, user) {
    const defaults = createDefaultResume(user);

    const saved = safeObject(resume);

    return {
      template: normalizeTemplate(
        saved.template
      ),

      fullName: text(
        saved.fullName !== undefined ?
        saved.fullName :
        defaults.fullName
      ),

      email: text(
        saved.email !== undefined ?
        saved.email :
        defaults.email
      ),

      phone: text(
        saved.phone !== undefined ?
        saved.phone :
        defaults.phone
      ),

      education: text(
        saved.education !== undefined ?
        saved.education :
        defaults.education
      ),

      github: text(
        saved.github !== undefined ?
        saved.github :
        defaults.github
      ),

      linkedin: text(
        saved.linkedin !== undefined ?
        saved.linkedin :
        defaults.linkedin
      ),

      objective: text(
        saved.objective !== undefined ?
        saved.objective :
        defaults.objective
      ),

      skills: saved.skills !== undefined ?
        normalizeSkills(saved.skills) :
        defaults.skills,

      projects: saved.projects !== undefined ?
        normalizeProjects(saved.projects) :
        defaults.projects,

      achievements: saved.achievements !== undefined ?
        normalizeAchievements(
          saved.achievements
        ) :
        defaults.achievements,

      experience: normalizeExperience(
        saved.experience
      ),

      certifications: normalizeCertifications(
        saved.certifications
      ),

      languages: normalizeLanguages(
        saved.languages
      ),

      additionalEducation: safeArray(
        saved.additionalEducation
      ).map(function(entry) {
        const item = safeObject(entry);

        return {
          institution: text(
            item.institution
          ),
          degree: text(item.degree),
          year: text(item.year),
          details: text(item.details)
        };
      }),

      updatedAt: saved.updatedAt || null
    };
  }

  // ======================================
  // 13. LOAD RESUME
  // ======================================

  function loadResume() {
    const user = getCurrentUser();

    if (!user) {
      throw new Error(
        "Please log in to access Resume Builder."
      );
    }

    return normalizeResume(
      user.resume,
      user
    );
  }

  // ======================================
  // 14. SAVE RESUME
  // ======================================

  function saveResume(resumeData) {
    const session = getSession();

    if (!session) {
      throw new Error(
        "Session expired. Please log in again."
      );
    }

    const users = getUsers();

    const index = users.findIndex(
      function(user) {
        return user.id === session.id;
      }
    );

    if (index === -1) {
      throw new Error(
        "User account not found."
      );
    }

    const user = users[index];

    const normalized = normalizeResume(
      resumeData,
      user
    );

    normalized.updatedAt =
      new Date().toISOString();

    // Preserve all existing user fields.
    const updatedUser = Object.assign({},
      user, {
        resume: normalized
      }
    );

    users[index] = updatedUser;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(users)
      );
    } catch (error) {
      console.error(
        "Unable to save resume:",
        error
      );

      throw new Error(
        "Resume could not be saved. Browser storage may be full."
      );
    }

    return clone(normalized);
  }

  // ======================================
  // 15. RESET RESUME DRAFT
  // ======================================

  function resetResume() {
    const user = getCurrentUser();

    if (!user) {
      throw new Error(
        "User account not found."
      );
    }

    const freshResume =
      createDefaultResume(user);

    return saveResume(freshResume);
  }

  // ======================================
  // 16. UPDATE RESUME FIELD
  // ======================================

  function updateField(resume, field, value) {
    const allowedFields = [
      "fullName",
      "email",
      "phone",
      "education",
      "github",
      "linkedin",
      "objective"
    ];

    if (!allowedFields.includes(field)) {
      throw new Error(
        "Invalid resume field: " + field
      );
    }

    const updated = clone(resume);

    updated[field] = text(value);

    return updated;
  }

  // ======================================
  // 17. UPDATE RESUME TEMPLATE
  // ======================================

  function updateTemplate(resume, template) {
    const updated = clone(resume);

    updated.template =
      normalizeTemplate(template);

    return updated;
  }

  // ======================================
  // 18. ADD RESUME ITEM
  // ======================================

  function addItem(resume, section, item) {
    const allowedSections = [
      "experience",
      "certifications",
      "languages",
      "additionalEducation"
    ];

    if (!allowedSections.includes(section)) {
      throw new Error(
        "Invalid resume section: " + section
      );
    }

    const updated = clone(resume);

    if (!Array.isArray(updated[section])) {
      updated[section] = [];
    }

    updated[section].push(clone(item));

    return updated;
  }

  // ======================================
  // 19. REMOVE RESUME ITEM
  // ======================================

  function removeItem(resume, section, index) {
    const allowedSections = [
      "experience",
      "certifications",
      "languages",
      "additionalEducation"
    ];

    if (!allowedSections.includes(section)) {
      throw new Error(
        "Invalid resume section: " + section
      );
    }

    const updated = clone(resume);

    if (!Array.isArray(updated[section])) {
      return updated;
    }

    if (!Number.isInteger(index) ||
      index < 0 ||
      index >= updated[section].length
    ) {
      return updated;
    }

    updated[section].splice(index, 1);

    return updated;
  }

  // ======================================
  // 20. RESUME COMPLETION CALCULATION
  // ======================================

  function getResumeCompletion(resume) {
    const data = safeObject(resume);

    const checks = [
      Boolean(text(data.fullName)),
      Boolean(text(data.email)),
      Boolean(text(data.phone)),
      Boolean(text(data.education)),
      Boolean(text(data.objective)),

      safeArray(data.skills).length > 0,

      safeArray(data.projects).length > 0,

      safeArray(data.achievements).length > 0,

      Boolean(
        text(data.github) ||
        text(data.linkedin)
      ),

      safeArray(data.experience).length > 0 ||
      safeArray(data.certifications).length > 0
    ];

    const completed = checks.filter(
      Boolean
    ).length;

    return Math.round(
      (completed / checks.length) * 100
    );
  }

  // ======================================
  // 21. RESUME SUMMARY
  // ======================================

  function getResumeSummary(resume) {
    const data = safeObject(resume);

    return {
      completion: getResumeCompletion(data),

      skills: safeArray(
        data.skills
      ).length,

      projects: safeArray(
        data.projects
      ).length,

      achievements: safeArray(
        data.achievements
      ).length,

      experience: safeArray(
        data.experience
      ).length,

      certifications: safeArray(
        data.certifications
      ).length,

      languages: safeArray(
        data.languages
      ).length,

      template: normalizeTemplate(
        data.template
      )
    };
  }

  // ======================================
  // 22. PUBLIC MODULE API
  // ======================================

  window.PortfolioResumeBuilder = {
    getCurrentUser,
    createDefaultResume,
    normalizeResume,
    loadResume,
    saveResume,
    resetResume,
    updateField,
    updateTemplate,
    addItem,
    removeItem,
    getResumeCompletion,
    getResumeSummary,
    AVAILABLE_TEMPLATES
  };

  console.log(
    "PortfolioPro Resume Builder Module Loaded"
  );

})();