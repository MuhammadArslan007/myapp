import { useEffect, useState } from "react";
import { getServices } from "../api/api";

const iconMap = {
  pipeline: "⚙️",
  cloud: "☁️",
  container: "🐳",
  monitor: "📊",
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page services-page">
      <h1>Services</h1>
      <p className="subtitle">What I can help you with</p>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{iconMap[service.icon] || "🔧"}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
