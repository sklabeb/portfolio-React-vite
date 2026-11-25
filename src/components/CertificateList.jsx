import React, { useEffect, useState } from "react";

function CertificateCard({ certificate, onDelete }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!(certificate.file instanceof Blob)) {
      return;
    }

    const url = URL.createObjectURL(certificate.file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [certificate.file]);

  return (
    <article className="panel">
      <h3>{certificate.title}</h3>

      {certificate.issuer && (
        <p>Issued by: {certificate.issuer}</p>
      )}

      {certificate.date && (
        <p>Issue date: {certificate.date}</p>
      )}

      <div className="customization-actions">
        {previewUrl && (
          <a
            className="primary-btn"
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview
          </a>
        )}

        <button
          type="button"
          onClick={() => onDelete(certificate.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default function CertificateList({ refreshKey }) {
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadCertificates() {
    setLoading(true);
    setMessage("");

    try {
      if (!window.PortfolioCertificates) {
        throw new Error("Certificate module is not loaded.");
      }

      const items = await window.PortfolioCertificates.list();
      setCertificates(items);
    } catch (error) {
      setMessage(error.message || "Could not load certificates.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCertificates();
  }, [refreshKey]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this certificate permanently?")) {
      return;
    }

    try {
      const removed = await window.PortfolioCertificates.remove(id);

      if (!removed) {
        throw new Error("Certificate could not be deleted.");
      }

      await loadCertificates();
    } catch (error) {
      setMessage(error.message || "Could not delete certificate.");
    }
  }

  return (
    <div>
      <h3>Saved Certificates</h3>

      {loading && <p>Loading certificates...</p>}

      {message && <p role="status">{message}</p>}

      {!loading && !message && certificates.length === 0 && (
        <p>No certificates saved yet.</p>
      )}

      <div className="item-grid">
        {certificates.map(certificate => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}