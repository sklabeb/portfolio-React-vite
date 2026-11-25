/*
========================================
PORTFOLIOPRO 2.0
SMART DASHBOARD ANALYTICS
========================================
*/

// 1. Calculate Profile Completion Percentage

function calculateProfileCompletion(user) {

  if (!user) return 0;

  const fields = [
    "name",
    "email",
    "phone",
    "education",
    "bio",
    "github",
    "linkedin"
  ];

  let completedFields = 0;

  fields.forEach(field => {

    if (
      typeof user[field] === "string" &&
      user[field].trim() !== ""
    ) {
      completedFields++;
    }

  });

  const percentage =
    (completedFields / fields.length) * 100;

  return Math.round(percentage);
}


// 2. Calculate Portfolio Statistics

function calculatePortfolioStats(user) {

  if (!user) {
    return {
      skills: 0,
      projects: 0,
      achievements: 0,
      blogs: 0,
      totalItems: 0
    };
  }

  const countItems = key => {
    return Array.isArray(user[key]) ?
      user[key].length :
      0;
  };

  const skills = countItems("skills");
  const projects = countItems("projects");
  const achievements = countItems("achievements");
  const blogs = countItems("blogs");

  const totalItems =
    skills + projects + achievements + blogs;

  return {
    skills,
    projects,
    achievements,
    blogs,
    totalItems
  };
}


// 3. Calculate Skill Category Distribution

function calculateSkillDistribution(user) {

  const distribution = {};

  if (!user || !Array.isArray(user.skills)) {
    return distribution;
  }

  user.skills.forEach(skill => {

    let category = "Other";

    if (
      skill &&
      typeof skill === "object" &&
      typeof skill.category === "string" &&
      skill.category.trim() !== ""
    ) {
      category = skill.category.trim();
    }

    distribution[category] =
      (distribution[category] || 0) + 1;

  });

  return distribution;
}


// 4. Generate Smart Profile Suggestions

function generateProfileSuggestions(user) {

  if (!user) return [];

  const suggestions = [];

  if (!(user.phone || "").trim()) {
    suggestions.push("Add your phone number.");
  }

  if (!(user.education || "").trim()) {
    suggestions.push("Add your education details.");
  }

  if (!(user.bio || "").trim()) {
    suggestions.push("Write an About Me section.");
  }

  if (!(user.github || "").trim()) {
    suggestions.push("Add your GitHub profile link.");
  }

  if (!(user.linkedin || "").trim()) {
    suggestions.push("Add your LinkedIn profile link.");
  }

  if (!Array.isArray(user.skills) ||
    user.skills.length === 0
  ) {
    suggestions.push("Add your technical skills.");
  }

  if (!Array.isArray(user.projects) ||
    user.projects.length === 0
  ) {
    suggestions.push("Add at least one project.");
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Excellent! Your portfolio is looking great."
    );
  }

  return suggestions;
}


// 5. Combine All Analytics

function getDashboardAnalytics(user) {

  const stats = calculatePortfolioStats(user);

  const skillDistribution =
    calculateSkillDistribution(user);

  return {
    profileCompletion: calculateProfileCompletion(user),

    skills: stats.skills,
    projects: stats.projects,
    achievements: stats.achievements,
    blogs: stats.blogs,
    totalItems: stats.totalItems,

    skillDistribution: skillDistribution,

    totalSkillCategories: Object.keys(skillDistribution).length,

    suggestions: generateProfileSuggestions(user)
  };
}


// 6. Make Analytics Available to user.js

window.PortfolioAnalytics = {
  calculateProfileCompletion,
  calculatePortfolioStats,
  calculateSkillDistribution,
  generateProfileSuggestions,
  getDashboardAnalytics
};

console.log("PortfolioPro Analytics Module Loaded");