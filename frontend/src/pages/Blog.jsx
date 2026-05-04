import { useEffect, useState } from "react";
import { getBlog } from "../api/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBlog()
      .then(setPosts)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="page blog-page">
      <h1>Learning Blog</h1>
      <p className="subtitle">DevOps journey — notes, guides, aur tips</p>

      <div className="blog-list">
        {posts.map((post) => (
          <div key={post.id} className="blog-card">
            <div className="blog-meta">
              <span className="blog-date">{post.date}</span>
              <div className="blog-tags">
                {post.tags.map((tag, i) => (
                  <span key={i} className="blog-tag">{tag}</span>
                ))}
              </div>
            </div>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <button className="blog-read-btn">Read More →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
