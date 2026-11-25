const adminSession = JSON.parse(
  sessionStorage.getItem("portfolioSession") || "null"
);

const ADMIN_ACCOUNTS = [
  { id: "2500080281", name: "LABEB" },
  { id: "2500080166", name: "MANI" },
  { id: "2500080237", name: "JAYA" }
];

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("portfolioUsers")) || [];
  } catch {
    return [];
  }
}

function el(tag, value = "", className = "") {
  const node = document.createElement(tag);
  node.textContent = value;
  if (className) node.className = className;
  return node;
}

function showAdminSection(id) {
  document.querySelectorAll(".admin-section").forEach(section =>
    section.classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");

  const titles = {
    dashboard: "Admin Dashboard",
    users: "Manage Users",
    portfolios: "User Portfolios",
    admins: "Admin Accounts",
    settings: "My Account"
  };

  document.getElementById("adminPageTitle").textContent = titles[id];

  document.querySelectorAll(".sidebar nav button").forEach((button, i) => {
    button.classList.toggle("active", Object.keys(titles)[i] === id);
  });
}

function renderDashboard() {
  const users = getUsers();

  document.getElementById("totalUsers").textContent = users.length;
  document.getElementById("totalProjects").textContent =
    users.reduce((n, u) => n + (u.projects || []).length, 0);
  document.getElementById("totalAchievements").textContent =
    users.reduce((n, u) => n + (u.achievements || []).length, 0);
  document.getElementById("totalBlogs").textContent =
    users.reduce((n, u) => n + (u.blogs || []).length, 0);

  const recent = document.getElementById("recentUsers");
  recent.replaceChildren();

  if (!users.length) {
    recent.appendChild(el("p", "No users registered yet."));
  } else {
    users.slice(-5).reverse().forEach(user => {
      recent.appendChild(el("p", user.name + " — " + user.email));
    });
  }

  renderUsersTable();
  renderPortfolios();
}

function renderUsersTable() {
  const search = document.getElementById("searchUser").value.toLowerCase();
  const table = document.getElementById("usersTable");
  table.replaceChildren();

  const users = getUsers().filter(user =>
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search)
  );

  if (!users.length) {
    const row = document.createElement("tr");
    const cell = el("td", "No users found.");
    cell.colSpan = 5;
    row.appendChild(cell);
    table.appendChild(row);
    return;
  }

  users.forEach(user => {
    const row = document.createElement("tr");

    [
      user.id,
      user.name,
      user.email,
      String((user.projects || []).length)
    ].forEach(value => row.appendChild(el("td", value)));

    const cell = document.createElement("td");
    const button = el("button", "Delete", "delete-btn");
    button.onclick = () => deleteUser(user.id);
    cell.appendChild(button);
    row.appendChild(cell);
    table.appendChild(row);
  });
}

function deleteUser(id) {
  if (!confirm("Delete this user and their portfolio?")) return;
  const users = getUsers().filter(user => user.id !== id);
  localStorage.setItem("portfolioUsers", JSON.stringify(users));
  renderDashboard();
  alert("User deleted successfully.");
}

function renderPortfolios() {
  const container = document.getElementById("portfolioList");
  container.replaceChildren();

  const users = getUsers();

  if (!users.length) {
    container.appendChild(el("p", "No portfolios available."));
    return;
  }

  users.forEach(user => {
    const card = el("article", "", "portfolio-card");
    card.appendChild(el("h3", user.name));
    card.appendChild(el("p", "Email: " + user.email));
    card.appendChild(
      el("p", "Education: " + (user.education || "Not added"))
    );

    for (const [title, items] of[
        ["Skills", user.skills || []], ["Projects", user.projects || []], ["Achievements", user.achievements || []], ["Blogs", user.blogs || []]
      ]) {
      card.appendChild(el("h4", title + " (" + items.length + ")"));
      const list = document.createElement("ul");

      items.forEach(item => {
        const name = typeof item === "string" ?
          item : (item.title || item.name || "Untitled");
        list.appendChild(el("li", name));
      });

      if (!items.length) list.appendChild(el("li", "None added"));
      card.appendChild(list);
    }

    container.appendChild(card);
  });
}

function renderAdminAccounts() {
  const container = document.getElementById("adminAccounts");
  container.replaceChildren();

  ADMIN_ACCOUNTS.forEach(admin => {
    const card = el("article", "", "portfolio-card");
    card.appendChild(el("h3", admin.name));
    card.appendChild(el("p", "Admin ID: " + admin.id));
    card.appendChild(el("p", "Role: Administrator"));

    if (admin.id === adminSession.id) {
      card.appendChild(el("strong", "Currently Logged In"));
    }

    container.appendChild(card);
  });
}

function renderAdminDetails() {
  const container = document.getElementById("adminDetails");
  container.replaceChildren(
    el("p", "Name: " + adminSession.name),
    el("p", "Admin ID: " + adminSession.id),
    el("p", "Role: Administrator"),
    el("p", "Account Status: Active (Demo)")
  );
}

function logout() {
  sessionStorage.removeItem("portfolioSession");
  location.replace("index.html");
}

function startAdmin() {
  const authorized = ADMIN_ACCOUNTS.some(
    admin => admin.id === adminSession?.id
  );

  if (!adminSession || adminSession.role !== "admin" || !authorized) {
    location.replace("index.html");
    return;
  }

  document.getElementById("adminWelcome").textContent = adminSession.name;
  document.getElementById("adminBadge").textContent = adminSession.name;

  document.getElementById("searchUser").addEventListener(
    "input", renderUsersTable
  );

  renderDashboard();
  renderAdminAccounts();
  renderAdminDetails();
  showAdminSection("dashboard");
}

startAdmin();