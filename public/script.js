const ADMINS = [
  { id: "2500080281", password: "LABEB", name: "LABEB" },
  { id: "2500080166", password: "MANI", name: "MANI" },
  { id: "2500080237", password: "JAYA", name: "JAYA" }
];

let role = "user";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("portfolioUsers")) || [];
  } catch {
    return [];
  }
}

function switchRole(selected) {
  role = selected;
  document.getElementById("userTab").classList.toggle("active", role === "user");
  document.getElementById("adminTab").classList.toggle("active", role === "admin");

  const input = document.getElementById("loginId");
  input.type = role === "user" ? "email" : "text";
  input.placeholder = role === "user" ? "Enter email" : "Enter admin ID";

  document.getElementById("loginLabel").textContent =
    role === "user" ? "Email Address" : "Admin ID";

  document.getElementById("registerLink").classList.toggle("hidden", role === "admin");
  toggleRegister(false);
  document.getElementById("loginMessage").textContent = "";
}

function toggleRegister(show) {
  document.getElementById("registerForm").classList.toggle("hidden", !show);
  document.getElementById("loginForm").classList.toggle("hidden", show);
  document.getElementById("registerLink").classList.toggle(
    "hidden", show || role === "admin"
  );
}

document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const password = document.getElementById("regPassword").value;
  const users = getUsers();

  if (users.some(u => u.email === email)) {
    alert("Email already registered.");
    return;
  }

  users.push({
    id: "USER-" + Date.now(),
    name,
    email,
    password,
    phone: "",
    education: "",
    bio: "",
    github: "",
    linkedin: "",
    skills: [],
    projects: [],
    achievements: [],
    blogs: []
  });

  localStorage.setItem("portfolioUsers", JSON.stringify(users));
  e.target.reset();
  toggleRegister(false);
  alert("Registration successful. Please log in.");
});

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("loginId").value.trim();
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");

  if (role === "admin") {
    const admin = ADMINS.find(a => a.id === id && a.password === password);
    if (!admin) {
      message.textContent = "Invalid admin credentials.";
      return;
    }
    sessionStorage.setItem("portfolioSession", JSON.stringify({
      id: admin.id,
      name: admin.name,
      role: "admin"
    }));
    location.href = "admin.html";
  } else {
    const user = getUsers().find(
      u => u.email === id.toLowerCase() && u.password === password
    );
    if (!user) {
      message.textContent = "Invalid email or password.";
      return;
    }
    sessionStorage.setItem("portfolioSession", JSON.stringify({
      id: user.id,
      name: user.name,
      role: "user"
    }));
    location.href = "user.html";
  }
});