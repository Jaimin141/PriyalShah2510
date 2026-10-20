import { useState, useEffect } from "react";
import { Heart, ZoomIn, ArrowRight, ArrowLeft, X } from "lucide-react";
import { fireConfetti, fireHeartConfetti } from "../utils/confetti";

const BASE = import.meta.env.BASE_URL || "/";
const cleanBase = BASE.endsWith("/") ? BASE : `${BASE}/`;

const DEFAULT_MEMORIES = [
  {
    id: 1,
    url: `${cleanBase}photos/memory1.jpg`,
    title: "The Iconic Duo 💖",
    date: "Best Moments Together",
    caption: "Unfiltered smiles, goofy jokes, and the truest friendship. You and me against the world, always.",
    tag: "BEST DUO💖",
    likes: 48,
  },
  {
    id: 2,
    url: `${cleanBase}photos/memory2.jpg`,
    title: "Main Character Energy ✨",
    date: "Elegance & Radiance",
    caption: "Serving pure grace, unmatched vibes, and that effortless smile that lights up every single room.",
    tag: "10/10 GORGEOUS",
    likes: 64,
  },
  {
    id: 3,
    url: `${cleanBase}photos/memory3.jpg`,
    title: "Night Aesthetic & Deep Talks 🏮",
    date: "Fairy Lights & Serenity",
    caption: "Under the warm lanterns and night breeze, making memories that will stay with us forever.",
    tag: "WARM MEMORIES",
    likes: 39,
  },
  {
    id: 4,
    url: `${cleanBase}photos/memory4.jpg`,
    title: "Late Night Laughs & Dinners 🌙",
    date: "Unending Chats",
    caption: "Sitting across the table, losing track of time, laughing until our stomachs hurt at things only we understand.",
    tag: "PRICELESS VIBES",
    likes: 52,
  },
];

export default function StepPhotos({ onNext, onPrev }) {
  // Clear old stale photo cache from previous version so code edits apply immediately
  useEffect(() => {
    try {
      localStorage.removeItem("priyal_birthday_photos_real_v1");
      localStorage.removeItem("priyal_birthday_photos");
    } catch {
      // Ignore in private browsing
    }
  }, []);

  const [likesMap, setLikesMap] = useState(() => {
    try {
      const saved = localStorage.getItem("priyal_birthday_likes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeModalPhoto, setActiveModalPhoto] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);

  const getLikes = (memory) => {
    return memory.likes + (likesMap[memory.id] || 0);
  };

  const isLiked = (id) => {
    return Boolean(likesMap[id]);
  };

  const handleLike = (id, e) => {
    if (e) e.stopPropagation();

    // Calculate tap/click coordinates for bursting hearts right from button
    let origin = undefined;
    if (e && typeof e.clientX === "number" && typeof e.clientY === "number" && e.clientX > 0) {
      origin = {
        x: Math.max(0.1, Math.min(0.9, e.clientX / window.innerWidth)),
        y: Math.max(0.1, Math.min(0.9, e.clientY / window.innerHeight)),
      };
    }

    // Trigger vector heart confetti without white background box
    fireHeartConfetti(origin);

    // Trigger local heart pulse animation
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 600);

    setLikesMap((prev) => {
      const updated = { ...prev, [id]: (prev[id] || 0) + 1 };
      try {
        localStorage.setItem("priyal_birthday_likes", JSON.stringify(updated));
      } catch (err) {
        console.warn("Storage warning:", err);
      }
      return updated;
    });
  };

  const handleProceed = () => {
    fireConfetti();
    onNext();
  };

  return (
    <section className="step-photos-section">
      <div className="photos-header">
        <div className="kicker">
          <span /> STEP 02 · ARCHIVE OF EXCELLENCE
        </div>
        <h2 className="section-title">
          The <i>Bestie</i> Vault.
        </h2>
        <p className="section-subtitle">
          Evidence that life is at least 1000% brighter with Priyal around.
          <br className="desktop-only" /> Tap any memory to zoom in, celebrate Priyal's iconic moments, or shower her with infinite love! 💖
        </p>
      </div>

      <div className="polaroid-grid">
        {DEFAULT_MEMORIES.map((m, index) => {
          // slight alternating rotations for playful polaroid effect
          const rotations = [-2.5, 1.8, -1.5, 2.2];
          const rotation = rotations[index % rotations.length];
          const isAnimating = animatingId === m.id;
          const currentLikes = getLikes(m);
          const userLiked = isLiked(m.id);

          return (
            <div
              key={m.id}
              className="polaroid-card"
              style={{ "--tilt": `${rotation}deg` }}
              onClick={() => setActiveModalPhoto(m)}
            >
              <div className="polaroid-tape" />
              <div className="polaroid-photo-frame">
                <img
                  src={m.url}
                  alt={m.title}
                  className="polaroid-img"
                  loading="lazy"
                />
                <div className="photo-tag-pill">{m.tag}</div>
                <div className="photo-hover-overlay">
                  <span className="overlay-pill">
                    <ZoomIn size={14} /> View
                  </span>
                </div>
              </div>

              <div className="polaroid-caption">
                <div className="polaroid-caption-top">
                  <span className="caption-date">{m.date}</span>
                  <button
                    className={`like-button ${userLiked ? "liked" : ""} ${isAnimating ? "animating" : ""}`}
                    onClick={(e) => handleLike(m.id, e)}
                    title="Send a heart"
                    aria-label={`Like ${m.title}, currently ${currentLikes} hearts`}
                  >
                    <Heart
                      size={15}
                      className="heart-icon"
                      fill={userLiked || isAnimating ? "#d45b87" : "transparent"}
                      color="#d45b87"
                    />
                    <span className="like-count">{currentLikes}</span>
                  </button>
                </div>
                <h3 className="polaroid-title">{m.title}</h3>
                <p className="polaroid-desc">{m.caption}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation footer */}
      <div className="step-navigation-footer">
        <button className="nav-btn prev-btn" onClick={onPrev}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="nav-step-count">
          <span>02 / 03</span>
        </div>

        <button className="nav-btn next-btn" onClick={handleProceed} id="goto-celebration-btn">
          Next: Birthday Song & Finale <ArrowRight size={16} />
        </button>
      </div>

      {/* Lightbox Modal */}
      {activeModalPhoto && (
        <div className="photo-modal-overlay" onClick={() => setActiveModalPhoto(null)}>
          <div className="photo-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setActiveModalPhoto(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="modal-img-container">
              <img src={activeModalPhoto.url} alt={activeModalPhoto.title} />
            </div>

            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-tag">{activeModalPhoto.tag}</span>
                <span className="modal-date">{activeModalPhoto.date}</span>
              </div>
              <h3 className="modal-title">{activeModalPhoto.title}</h3>
              <p className="modal-caption">{activeModalPhoto.caption}</p>

              <div className="modal-actions">
                <button
                  className={`modal-love-btn ${animatingId === activeModalPhoto.id ? "animating" : ""}`}
                  onClick={(e) => handleLike(activeModalPhoto.id, e)}
                  title="Send love"
                >
                  <Heart
                    size={18}
                    fill="#d45b87"
                    color="#d45b87"
                    className="modal-heart-icon"
                  />
                  <span>Send Love ({getLikes(activeModalPhoto)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
