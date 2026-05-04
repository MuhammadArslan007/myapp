import { useEffect, useState } from "react";
import { getProfile } from "../api/api";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error">Error: {error}</div>;
  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="page home-page">
      <div className="hero">
        <div className="avatar">MA</div>
        <h1>{profile.name}</h1>
        <p className="role">{profile.role}</p>
        <p className="bio">{profile.bio}</p>
        <p className="program">
          <span className="label">Program:</span> {profile.learning}
        </p>
        <p className="instructor">
          <span className="label">Instructor:</span> {profile.instructor}
        </p>
        <p className="location">{profile.location}</p>
        <div className="links">
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>

      <div className="skills-section">
        <h2>Skills</h2>
        <div className="skills-grid">
          {profile.skills?.map((skill, i) => (
            <span key={i} className="skill-badge">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
