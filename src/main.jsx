import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";

const pages = {
  "index.html": Home,
  "user.html": UserDashboard,
  "admin.html": AdminDashboard,
  "resume.html": ResumeBuilder
};
const page = location.pathname.split("/").pop() || "index.html";
const Page = pages[page] || Home;
createRoot(document.getElementById("root")).render(<Page />);
