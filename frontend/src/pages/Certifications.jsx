import { useEffect, useState } from "react";
import { getCertifications } from "../api/api";

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCertifications()
      .then(setCerts)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page certs-page">
      <h1>Certifications</h1>
      <p className="subtitle">Microsoft Azure professional certifications</p>

      <div className="certs-grid">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="cert-card"
            style={{ borderTop: `4px solid ${cert.badge_color}` }}
          >
            <div
              className="cert-badge"
              style={{ backgroundColor: cert.badge_color }}
            >
              {cert.name}
            </div>
            <h3>{cert.type}</h3>
            <p className="issuer">Issued by: {cert.issuer}</p>
            <span
              className={`status ${cert.status === "Completed" ? "completed" : "in-progress"}`}
            >
              {cert.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
