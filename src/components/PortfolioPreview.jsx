import React, { useEffect, useState } from "react";

function readCurrentUser() {
  const session = JSON.parse(
    sessionStorage.getItem("portfolioSession") || "null"
  );

  if (!session || session.role !== "user" || session.id == null) {
    throw new Error("Please log in to preview your portfolio.");
  }

  const users = JSON.parse(
    localStorage.getItem("portfolioUsers") || "[]"
  );

  if (!Array.isArray(users)) {
    throw new Error("Portfolio data could not be read.");
  }

  const user = users.find(item => item.id === session.id);

  if (!user) {
    throw new Error("Your portfolio could not be found.");
  }

  return user;
}

function safeWebUrl(value) {
  try {
    const url = new URL(value);

    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch {
    return "";
  }

  return "";
}

function WebLink({ value, children }) {
  const href = safeWebUrl(value);

  if (!href) {
    return null;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function PreviewSection({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function PortfolioPreview({ refreshKey }) {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");
  const [certificateMessage, setCertificateMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      setMessage("");
      setCertificateMessage("");
      setCertificates([]);

      try {
        const currentUser = readCurrentUser();

        if (cancelled) {
          return;
        }

        setUser(currentUser);

        try {
          if (!window.PortfolioCertificates) {
            throw new Error("Certificate module is not available.");
          }

          const items = await window.PortfolioCertificates.list();

          if (!cancelled) {
            setCertificates(Array.isArray(items) ? items : []);
          }
        } catch {
          if (!cancelled) {
            setCertificateMessage("Certificates could not be loaded.");
          }
        }
      } catch (error) {
        if (!cancelled) {
          setUser(null);
          setMessage(
            error instanceof Error
              ? error.message
              : "Portfolio preview could not be loaded."
          );
        }
      }
    }

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (message) {
    return <p role="status">{message}</p>;
  }

  if (!user) {
    return <p>Loading portfolio preview...</p>;
  }

  const skills = Array.isArray(user.skills) ? user.skills : [];
  const projects = Array.isArray(user.projects) ? user.projects : [];
  const achievements = Array.isArray(user.achievements)
    ? user.achievements
    : [];

  return (
    <div className="portfolio-preview">
      <header className="welcome">
        <p>MY PORTFOLIO</p>
        <h1>{user.name || "My Portfolio"}</h1>

        {user.education && <p>{user.education}</p>}
        {user.bio && <p>{user.bio}</p>}

        <div className="customization-actions">
          <WebLink value={user.github}>GitHub</WebLink>
          <WebLink value={user.linkedin}>LinkedIn</WebLink>
        </div>
      </header>

      <PreviewSection title="Skills">
        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <div className="skill-badges">
            {skills.map((skill, index) => (
              <span className="skill-badge" key={index}>
                {typeof skill === "string" ? skill : skill.name}
              </span>
            ))}
          </div>
        )}
      </PreviewSection>

      <PreviewSection title="Projects">
        {projects.length === 0 ? (
          <p>No projects added yet.</p>
        ) : (
          <div className="item-grid">
            {projects.map((project, index) => (
              <article className="item-card" key={index}>
                <h3>{project.title || "Untitled Project"}</h3>
                {project.description && <p>{project.description}</p>}
                {project.tech && <p>Technologies: {project.tech}</p>}
                <WebLink value={project.link}>View Project</WebLink>
              </article>
            ))}
          </div>
        )}
      </PreviewSection>

      <PreviewSection title="Achievements">
        {achievements.length === 0 ? (
          <p>No achievements added yet.</p>
        ) : (
          <div className="item-grid">
            {achievements.map((achievement, index) => (
              <article className="item-card" key={index}>
                <h3>{achievement.title || "Achievement"}</h3>
                {achievement.description && (
                  <p>{achievement.description}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </PreviewSection>

      <PreviewSection title="Certificates">
        {certificateMessage ? (
          <p role="status">{certificateMessage}</p>
        ) : certificates.length === 0 ? (
          <p>No certificates added yet.</p>
        ) : (
          <div className="item-grid">
            {certificates.map(certificate => (
              <article className="item-card" key={certificate.id}>
                <h3>{certificate.title}</h3>
                {certificate.issuer && (
                  <p>Issued by: {certificate.issuer}</p>
                )}
                {certificate.date && (
                  <p>Issue date: {certificate.date}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </PreviewSection>
    </div>
  );
}