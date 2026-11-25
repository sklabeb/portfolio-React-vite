import React, { useEffect } from "react";
import { loadScripts } from "../scripts.js";

export default function Home() {
  useEffect(() => {
    loadScripts(["/script.js"]);
  }, []);

  return (
    <>
      <header className="navbar">
        <a className="logo" href="#home">
          Portfolio<span>Pro</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#login">Login</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div>
          <span className="eyebrow">
            YOUR PROFESSIONAL IDENTITY
          </span>

          <h1>
            Showcase Your <span>Potential.</span>
          </h1>

          <p>
            Create your professional digital portfolio with projects,
            skills, achievements, blogs and contact details.
          </p>

          <a className="primary-btn" href="#login">
            Get Started
          </a>
        </div>

        <div className="hero-preview hover-card">
          <div className="avatar">P</div>

          <h2>My Portfolio</h2>
          <p>Projects • Skills • Achievements</p>

          <div className="preview-line" />
          <div className="preview-line short" />
        </div>
      </section>

      <section className="features" id="features">
        <h2>Everything in One Place</h2>

        <div className="feature-grid">
          <article className="feature-card hover-card">
            <div className="feature-icon">💻</div>

            <h3>Skills</h3>
            <p>Organize your technical and professional skills.</p>
          </article>

          <article className="feature-card hover-card">
            <div className="feature-icon">📁</div>

            <h3>Projects</h3>
            <p>Present your best academic and personal work.</p>
          </article>

          <article className="feature-card hover-card">
            <div className="feature-icon">🏆</div>

            <h3>Achievements</h3>
            <p>Highlight certificates, awards and milestones.</p>
          </article>
        </div>
      </section>

      <section className="login-section" id="login">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p>Sign in to your portfolio dashboard</p>

          <div className="tabs">
            <button
              type="button"
              id="userTab"
              className="active"
              onClick={() => window.switchRole("user")}
            >
              User Login
            </button>

            <button
              type="button"
              id="adminTab"
              onClick={() => window.switchRole("admin")}
            >
              Admin Login
            </button>
          </div>

          <form id="loginForm">
            <label id="loginLabel" htmlFor="loginId">
              Email Address
            </label>

            <input
              id="loginId"
              type="email"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="loginPassword">
              Password
            </label>

            <input
              id="loginPassword"
              type="password"
              placeholder="Enter password"
              required
            />

            <button
              className="primary-btn full"
              type="submit"
            >
              Login
            </button>
          </form>

          <p id="loginMessage" role="status" />

          <div id="registerLink">
            New user?{" "}

            <button
              type="button"
              className="text-btn"
              onClick={() => window.toggleRegister(true)}
            >
              Create an account
            </button>
          </div>

          <form id="registerForm" className="hidden">
            <h3>Create Account</h3>

            <label htmlFor="regName">
              Full Name
            </label>

            <input
              id="regName"
              type="text"
              required
            />

            <label htmlFor="regEmail">
              Email
            </label>

            <input
              id="regEmail"
              type="email"
              required
            />

            <label htmlFor="regPassword">
              Password
            </label>

            <input
              id="regPassword"
              type="password"
              minLength={6}
              required
            />

            <button
              className="primary-btn full"
              type="submit"
            >
              Register
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => window.toggleRegister(false)}
            >
              Back to Login
            </button>
          </form>
        </div>
      </section>

      <footer>
        © 2026 PortfolioPro. All rights reserved.
      </footer>
    </>
  );
}