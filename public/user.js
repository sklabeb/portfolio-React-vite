"use strict";

// ==========================================
// SESSION MANAGEMENT
// ==========================================

const SESSION_KEY = "portfolioSession";
const USERS_KEY = "portfolioUsers";
const LOGIN_URL = "index.html";

function readSession() {
    try {
        const value = sessionStorage.getItem(SESSION_KEY);

        if (!value) {
            return null;
        }

        const parsed = JSON.parse(value);

        if (!parsed ||
            parsed.role !== "user" ||
            parsed.id === undefined ||
            parsed.id === null
        ) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

const session = readSession();

function hasActiveUserSession() {
    const activeSession = readSession();

    return Boolean(
        session &&
        activeSession &&
        activeSession.id === session.id
    );
}

function checkDashboardSession() {
    if (!hasActiveUserSession()) {
        window.location.replace(LOGIN_URL);
        return false;
    }

    return true;
}

// Recheck when the browser restores a cached page.
window.addEventListener("pageshow", checkDashboardSession);

// ==========================================
// SKILL CATEGORIES
// ==========================================

const CATEGORIES = [
    "Programming Languages",
    "Web Development",
    "Databases & Tools",
    "Core Computer Science",
    "Professional Skills",
    "Other"
];

// ==========================================
// USER STORAGE
// ==========================================

function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem(USERS_KEY)
        );

        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

function currentUser() {
    if (!hasActiveUserSession()) {
        return null;
    }

    return (
        getUsers().find(user => user.id === session.id) ||
        null
    );
}

function requireCurrentUser() {
    const user = currentUser();

    if (!user) {
        logout();
        return null;
    }

    return user;
}

function saveUser(user) {
    if (!hasActiveUserSession()) {
        logout();
        return false;
    }

    const users = getUsers();

    const index = users.findIndex(
        item => item.id === session.id
    );

    if (index === -1) {
        logout();
        return false;
    }

    users[index] = user;

    try {
        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );
    } catch (error) {
        alert("Unable to save. Browser storage may be full.");
        console.error(error);
        return false;
    }

    renderDashboard();
    return true;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function el(tag, value = "", className = "") {
    const node = document.createElement(tag);

    node.textContent = value;

    if (className) {
        node.className = className;
    }

    return node;
}

function getValue(id) {
    return document.getElementById(id).value.trim();
}

function normalizeUserCollections(user) {
    const keys = [
        "skills",
        "projects",
        "achievements",
        "blogs"
    ];

    keys.forEach(key => {
        if (!Array.isArray(user[key])) {
            user[key] = [];
        }
    });

    return user;
}

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

function showSection(id) {
    const target = document.getElementById(id);

    if (!target) {
        return;
    }

    document.querySelectorAll(".page-section").forEach(
        section => {
            section.classList.add("hidden");
        }
    );

    target.classList.remove("hidden");

    const titles = {
        overview: "Dashboard Overview",
        profile: "My Profile",
        skills: "My Skills",
        projects: "My Projects",
        achievements: "My Achievements",
        blogs: "My Blogs",
        contact: "Contact Information",
        customization: "Profile & Theme Customization"
    };

    document.getElementById("pageTitle").textContent =
        titles[id] || "Dashboard";

    const keys = Object.keys(titles);

    document.querySelectorAll(
        ".sidebar nav button"
    ).forEach((button, index) => {
        button.classList.toggle(
            "active",
            keys[index] === id
        );
    });
}

// ==========================================
// DASHBOARD INITIALIZATION
// ==========================================

function startDashboard() {
    if (!requireCurrentUser()) {
        return;
    }

    setupForms();
    setupCustomization();
    renderDashboard();
    showSection("overview");
}

// ==========================================
// RENDER DASHBOARD
// ==========================================

function renderDashboard() {
    const user = requireCurrentUser();

    if (!user) {
        return;
    }

    normalizeUserCollections(user);

    document.getElementById("welcomeName").textContent =
        user.name;

    document.getElementById("topUser").textContent =
        user.name;

    const counters = [
        ["skillCount", "skills"],
        ["projectCount", "projects"],
        ["achievementCount", "achievements"],
        ["blogCount", "blogs"]
    ];

    counters.forEach(([id, key]) => {
        document.getElementById(id).textContent =
            user[key].length;
    });

    const summary = document.getElementById(
        "portfolioSummary"
    );

    summary.replaceChildren(
        el("p", "Name: " + user.name),
        el(
            "p",
            "Education: " + (user.education || "Not added")
        ),
        el("p", "Email: " + user.email),
        el(
            "p",
            "About: " + (
                user.bio || "Add your introduction"
            )
        )
    );

    const profileFields = [
        ["profileName", user.name],
        ["profileEmail", user.email],
        ["profilePhone", user.phone || ""],
        ["profileEducation", user.education || ""],
        ["profileBio", user.bio || ""],
        ["profileGithub", user.github || ""],
        ["profileLinkedin", user.linkedin || ""]
    ];

    profileFields.forEach(([id, value]) => {
        document.getElementById(id).value = value;
    });

    renderSkills(user.skills);

    renderItems(
        "projectsList",
        user.projects,
        "projects"
    );

    renderItems(
        "achievementsList",
        user.achievements,
        "achievements"
    );

    renderItems(
        "blogsList",
        user.blogs,
        "blogs"
    );

    renderContact(user);
    renderSmartAnalytics(user);
    renderCustomization(user);
}

// ==========================================
// SMART DASHBOARD ANALYTICS
// ==========================================

function renderSmartAnalytics(user) {
    if (!window.PortfolioAnalytics) {
        console.error(
            "Dashboard Analytics module not loaded!"
        );
        return;
    }

    const analytics =
        window.PortfolioAnalytics.getDashboardAnalytics(
            user
        );

    const percentage = analytics.profileCompletion;

    document.getElementById(
        "profileCompletionPercent"
    ).textContent = percentage + "%";

    document.getElementById(
        "profileProgressFill"
    ).style.width = percentage + "%";

    document.getElementById(
        "totalPortfolioItems"
    ).textContent = analytics.totalItems;

    document.getElementById(
        "totalSkillCategories"
    ).textContent = analytics.totalSkillCategories;

    const suggestionsContainer =
        document.getElementById(
            "analyticsSuggestions"
        );

    suggestionsContainer.replaceChildren();

    analytics.suggestions.forEach(suggestion => {
        suggestionsContainer.appendChild(
            el("li", suggestion)
        );
    });

    // Portfolio activity chart

    const activityContainer =
        document.getElementById(
            "portfolioActivityChart"
        );

    activityContainer.replaceChildren();

    const activityData = [{
            name: "Skills",
            count: analytics.skills
        },
        {
            name: "Projects",
            count: analytics.projects
        },
        {
            name: "Awards",
            count: analytics.achievements
        },
        {
            name: "Blogs",
            count: analytics.blogs
        }
    ];

    const maxCount = Math.max(
        1,
        ...activityData.map(item => item.count)
    );

    activityData.forEach(item => {
        const wrapper = el(
            "div",
            "",
            "chart-bar-wrapper"
        );

        const value = el(
            "span",
            String(item.count),
            "chart-value"
        );

        const bar = el(
            "div",
            "",
            "chart-bar"
        );

        const height =
            (item.count / maxCount) * 150;

        bar.style.height = height + "px";

        bar.title =
            item.name + ": " + item.count;

        const label = el(
            "span",
            item.name,
            "chart-label"
        );

        wrapper.append(
            value,
            bar,
            label
        );

        activityContainer.appendChild(wrapper);
    });

    // Skill distribution chart

    const skillContainer =
        document.getElementById(
            "skillDistributionChart"
        );

    skillContainer.replaceChildren();

    const distribution =
        analytics.skillDistribution;

    const totalSkills =
        analytics.skills;

    if (totalSkills === 0) {
        skillContainer.appendChild(
            el(
                "p",
                "No skills added yet. Add skills to view distribution."
            )
        );
    } else {
        Object.entries(distribution).forEach(
            ([category, count]) => {
                const percent =
                    (count / totalSkills) * 100;

                const item = el(
                    "div",
                    "",
                    "skill-distribution-item"
                );

                const header = el(
                    "div",
                    "",
                    "skill-distribution-header"
                );

                header.append(
                    el("span", category),
                    el(
                        "span",
                        count +
                        " (" +
                        Math.round(percent) +
                        "%)"
                    )
                );

                const track = el(
                    "div",
                    "",
                    "skill-distribution-track"
                );

                const fill = el(
                    "div",
                    "",
                    "skill-distribution-fill"
                );

                fill.style.width =
                    percent + "%";

                track.appendChild(fill);

                item.append(
                    header,
                    track
                );

                skillContainer.appendChild(item);
            }
        );
    }

    console.log(
        "Dashboard Analytics Updated",
        analytics
    );
}

// ==========================================
// PROFILE & THEME CUSTOMIZATION
// ==========================================

function renderCustomization(user) {
    if (!window.PortfolioCustomization) {
        console.error(
            "Customization module not loaded!"
        );
        return;
    }

    const custom =
        window.PortfolioCustomization;

    const preferences =
        custom.applyUserPreferences(user);

    const preview =
        document.getElementById(
            "profilePicturePreview"
        );

    const topPicture =
        document.getElementById(
            "topProfilePicture"
        );

    const placeholder =
        document.getElementById(
            "profilePicturePlaceholder"
        );

    if (preferences.profilePicture) {
        preview.src =
            preferences.profilePicture;

        topPicture.src =
            preferences.profilePicture;

        preview.hidden = false;
        topPicture.hidden = false;
        placeholder.hidden = true;
    } else {
        preview.removeAttribute("src");
        topPicture.removeAttribute("src");

        preview.hidden = true;
        topPicture.hidden = true;
        placeholder.hidden = false;
    }

    document.querySelectorAll(
        'input[name="dashboardTheme"]'
    ).forEach(input => {
        input.checked =
            input.value === preferences.theme;
    });

    document.querySelectorAll(
        'input[name="accentColor"]'
    ).forEach(input => {
        input.checked =
            input.value === preferences.accentColor;
    });
}

// ==========================================
// SETUP CUSTOMIZATION
// ==========================================

function setupCustomization() {
    if (!window.PortfolioCustomization) {
        return;
    }

    const custom =
        window.PortfolioCustomization;

    const pictureInput =
        document.getElementById(
            "profilePictureInput"
        );

    const pictureMessage =
        document.getElementById(
            "profilePictureMessage"
        );

    const customizationMessage =
        document.getElementById(
            "customizationMessage"
        );

    const uploadButton =
        document.getElementById(
            "uploadProfilePictureBtn"
        );

    // Upload profile picture

    uploadButton.onclick = async function() {
        const file = pictureInput.files[0];

        if (!file) {
            pictureMessage.textContent =
                "Please select a picture first.";
            return;
        }

        uploadButton.disabled = true;

        pictureMessage.textContent =
            "Uploading picture...";

        try {
            const imageData =
                await custom.processProfileImage(file);

            const user = requireCurrentUser();

            if (!user) {
                return;
            }

            const updatedUser =
                custom.updateUserPreferences(
                    user, {
                        profilePicture: imageData
                    }
                );

            if (saveUser(updatedUser)) {
                pictureInput.value = "";

                pictureMessage.textContent =
                    "Profile picture uploaded successfully!";
            } else {
                pictureMessage.textContent =
                    "Unable to save profile picture.";
            }
        } catch (error) {
            pictureMessage.textContent =
                error.message;
        } finally {
            uploadButton.disabled = false;
        }
    };

    // Remove profile picture

    document.getElementById(
        "removeProfilePictureBtn"
    ).onclick = function() {
        const user = requireCurrentUser();

        if (!user) {
            return;
        }

        const updatedUser =
            custom.updateUserPreferences(
                user, {
                    profilePicture: ""
                }
            );

        if (saveUser(updatedUser)) {
            pictureInput.value = "";

            pictureMessage.textContent =
                "Profile picture removed successfully.";
        }
    };

    // Preview theme

    document.querySelectorAll(
        'input[name="dashboardTheme"]'
    ).forEach(input => {
        input.addEventListener(
            "change",
            function() {
                if (input.checked) {
                    custom.applyTheme(input.value);

                    customizationMessage.textContent =
                        "Theme preview applied. Click Save Customization.";
                }
            }
        );
    });

    // Preview accent color

    document.querySelectorAll(
        'input[name="accentColor"]'
    ).forEach(input => {
        input.addEventListener(
            "change",
            function() {
                if (input.checked) {
                    custom.applyAccentColor(
                        input.value
                    );

                    customizationMessage.textContent =
                        "Color preview applied. Click Save Customization.";
                }
            }
        );
    });

    // Save customization

    document.getElementById(
        "saveCustomizationBtn"
    ).onclick = function() {
        const user = requireCurrentUser();

        if (!user) {
            return;
        }

        const selectedTheme =
            document.querySelector(
                'input[name="dashboardTheme"]:checked'
            );

        const selectedAccent =
            document.querySelector(
                'input[name="accentColor"]:checked'
            );

        const updatedUser =
            custom.updateUserPreferences(
                user, {
                    theme: selectedTheme ?
                        selectedTheme.value :
                        "light",

                    accentColor: selectedAccent ?
                        selectedAccent.value :
                        "blue"
                }
            );

        if (saveUser(updatedUser)) {
            customizationMessage.textContent =
                "Customization saved successfully!";
        } else {
            customizationMessage.textContent =
                "Unable to save customization.";
        }
    };
}

// ==========================================
// SKILLS
// ==========================================

function renderSkills(skills) {
    const container =
        document.getElementById(
            "skillsList"
        );

    container.replaceChildren();

    if (!skills.length) {
        container.appendChild(
            el("p", "No skills added yet.")
        );
        return;
    }

    CATEGORIES.forEach(category => {
        const matching = skills
            .map((skill, index) => ({
                skill,
                index
            }))
            .filter(({ skill }) => {
                const itemCategory =
                    typeof skill === "string" ?
                    "Other" :
                    skill.category || "Other";

                return itemCategory === category;
            });

        if (!matching.length) {
            return;
        }

        const card = el(
            "article",
            "",
            "skill-category"
        );

        card.appendChild(
            el("h3", category)
        );

        const badges = el(
            "div",
            "",
            "skill-badges"
        );

        matching.forEach(
            ({ skill, index }) => {
                const badge = el(
                    "span",
                    "",
                    "skill-badge"
                );

                badge.appendChild(
                    el(
                        "span",
                        typeof skill === "string" ?
                        skill :
                        skill.name
                    )
                );

                const button = el(
                    "button",
                    "×"
                );

                button.type = "button";
                button.title = "Remove skill";

                button.onclick = () => {
                    removeItem(
                        "skills",
                        index
                    );
                };

                badge.appendChild(button);
                badges.appendChild(badge);
            }
        );

        card.appendChild(badges);
        container.appendChild(card);
    });
}

// ==========================================
// PROJECTS, ACHIEVEMENTS & BLOGS
// ==========================================

function renderItems(
    containerId,
    items,
    type
) {
    const container =
        document.getElementById(
            containerId
        );

    container.replaceChildren();

    if (!items.length) {
        container.appendChild(
            el("p", "No items added yet.")
        );
        return;
    }

    items.forEach((item, index) => {
        const card = el(
            "article",
            "",
            "item-card"
        );

        card.appendChild(
            el(
                "h3",
                item.title || "Untitled"
            )
        );

        if (item.description) {
            card.appendChild(
                el("p", item.description)
            );
        }

        if (item.tech) {
            card.appendChild(
                el(
                    "p",
                    "Technologies: " +
                    item.tech
                )
            );
        }

        if (item.content) {
            card.appendChild(
                el("p", item.content)
            );
        }

        if (item.link) {
            try {
                const url =
                    new URL(item.link);

                if (
                    ["http:", "https:"].includes(
                        url.protocol
                    )
                ) {
                    const link = el(
                        "a",
                        "View Project"
                    );

                    link.href = url.href;
                    link.target = "_blank";

                    link.rel =
                        "noopener noreferrer";

                    card.appendChild(link);
                }
            } catch {
                // Ignore invalid project URLs.
            }
        }

        const button = el(
            "button",
            "Delete",
            "delete-btn"
        );

        button.type = "button";

        button.onclick = () => {
            removeItem(
                type,
                index
            );
        };

        card.appendChild(button);
        container.appendChild(card);
    });
}

// ==========================================
// REMOVE ITEM
// ==========================================

function removeItem(type, index) {
    const allowedTypes = [
        "skills",
        "projects",
        "achievements",
        "blogs"
    ];

    if (!allowedTypes.includes(type)) {
        return;
    }

    if (!confirm("Delete this item?")) {
        return;
    }

    const user = requireCurrentUser();

    if (!user) {
        return;
    }

    normalizeUserCollections(user);

    if (!Number.isInteger(index) ||
        index < 0 ||
        index >= user[type].length
    ) {
        return;
    }

    user[type].splice(index, 1);

    saveUser(user);
}

// ==========================================
// CONTACT INFORMATION
// ==========================================

function renderContact(user) {
    const container =
        document.getElementById(
            "contactDetails"
        );

    container.replaceChildren();

    const details = [
        [
            "Email",
            user.email
        ],
        [
            "Phone",
            user.phone || "Not added"
        ],
        [
            "GitHub",
            user.github || "Not added"
        ],
        [
            "LinkedIn",
            user.linkedin || "Not added"
        ]
    ];

    details.forEach(
        ([key, value]) => {
            container.appendChild(
                el(
                    "p",
                    key + ": " + value
                )
            );
        }
    );
}

// ==========================================
// SETUP FORMS
// ==========================================

function setupForms() {
    // ----------------------------------------
    // PROFILE FORM
    // ----------------------------------------

    document.getElementById(
        "profileForm"
    ).onsubmit = event => {
        event.preventDefault();

        const user =
            requireCurrentUser();

        if (!user) {
            return;
        }

        const fields = [
            ["name", "profileName"],
            ["phone", "profilePhone"],
            ["education", "profileEducation"],
            ["bio", "profileBio"],
            ["github", "profileGithub"],
            ["linkedin", "profileLinkedin"]
        ];

        fields.forEach(
            ([key, id]) => {
                user[key] = getValue(id);
            }
        );

        if (saveUser(user)) {
            alert(
                "Profile saved successfully."
            );
        }
    };

    // ----------------------------------------
    // SKILL FORM
    // ----------------------------------------

    document.getElementById(
        "skillForm"
    ).onsubmit = event => {
        event.preventDefault();

        const user =
            requireCurrentUser();

        if (!user) {
            return;
        }

        normalizeUserCollections(user);

        const name =
            getValue("skillInput");

        if (!name) {
            return;
        }

        user.skills.push({
            name,

            category: document.getElementById(
                "skillCategory"
            ).value
        });

        if (saveUser(user)) {
            event.target.reset();
        }
    };

    // ----------------------------------------
    // PROJECT FORM
    // ----------------------------------------

    document.getElementById(
        "projectForm"
    ).onsubmit = event => {
        event.preventDefault();

        const user =
            requireCurrentUser();

        if (!user) {
            return;
        }

        normalizeUserCollections(user);

        const title =
            getValue("projectTitle");

        if (!title) {
            return;
        }

        user.projects.push({
            title,

            description: getValue(
                "projectDescription"
            ),

            tech: getValue(
                "projectTech"
            ),

            link: getValue(
                "projectLink"
            )
        });

        if (saveUser(user)) {
            event.target.reset();
        }
    };

    // ----------------------------------------
    // ACHIEVEMENT FORM
    // ----------------------------------------

    document.getElementById(
        "achievementForm"
    ).onsubmit = event => {
        event.preventDefault();

        const user =
            requireCurrentUser();

        if (!user) {
            return;
        }

        normalizeUserCollections(user);

        const title =
            getValue(
                "achievementTitle"
            );

        if (!title) {
            return;
        }

        user.achievements.push({
            title,

            description: getValue(
                "achievementDescription"
            )
        });

        if (saveUser(user)) {
            event.target.reset();
        }
    };

    // ----------------------------------------
    // BLOG FORM
    // ----------------------------------------

    document.getElementById(
        "blogForm"
    ).onsubmit = event => {
        event.preventDefault();

        const user =
            requireCurrentUser();

        if (!user) {
            return;
        }

        normalizeUserCollections(user);

        const title =
            getValue("blogTitle");

        if (!title) {
            return;
        }

        user.blogs.push({
            title,

            content: getValue(
                "blogContent"
            )
        });

        if (saveUser(user)) {
            event.target.reset();
        }
    };
}

// ==========================================
// LOGOUT
// ==========================================

function logout() {
    sessionStorage.removeItem(
        SESSION_KEY
    );

    window.location.replace(
        LOGIN_URL
    );
}

// ==========================================
// EXPOSE LEGACY DASHBOARD ACTIONS
// ==========================================

// These allow existing dashboard buttons to
// continue calling the functions by name.

window.showSection = showSection;
window.logout = logout;

// ==========================================
// START APPLICATION
// ==========================================

if (checkDashboardSession()) {
    startDashboard();
}