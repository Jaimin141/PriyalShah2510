import { useState, useRef } from "react";
import { Heart, Upload, ZoomIn, ArrowRight, ArrowLeft, Plus, X, Sparkles, RotateCcw } from "lucide-react";
import { fireConfetti, fireHeartConfetti } from "../utils/confetti";

const BASE = import.meta.env.BASE_URL || "/";
const cleanBase = BASE.endsWith("/") ? BASE : `${BASE}/`;

const DEFAULT_MEMORIES = [
  {
    id: 1,
    url: `${cleanBase}photos/memory1.jpg`,
    title: "Certified Chaos Twins ☕",
    date: "Cozy Café Sessions",
    caption: "Fuelled by iced coffee, 3-hour phone calls, and zero common sense. Wouldn't trade our yap sessions for the world.",
    tag: "YAP LEVEL: 100",
    likes: 12,
  },
  {
    id: 2,
    url: `${cleanBase}photos/memory2.jpg`,
    title: "Sunset Soulmates 🌅",
    date: "Golden Hour Escapes",
    caption: "Laughing at unhinged inside jokes that literally nobody else in the universe would ever find funny.",
    tag: "CORE MEMORY",
    likes: 24,
  },
  {
    id: 3,
    url: `${cleanBase}photos/memory3.jpg`,
    title: "The Birthday Girl Era 🎂",
    date: "Forever Young",
    caption: "Another year older, none the wiser, but 100% more iconic. Watching you grow is my favorite thing.",
    tag: "MAIN CHARACTER",
    likes: 42,
  },
  {
    id: 4,
    url: `${cleanBase}photos/memory4.jpg`,
    title: "Sleepover Shenanigans 🌙",
    date: "3:42 AM Vibes",
    caption: "Sleepover club rules: deep talks, bad advice, singing at the top of our lungs, and unconditional love.",
    tag: "BESTIE FOREVER",
    likes: 19,
  },
];

export default function StepPhotos({ onNext, onPrev }) {
  const [memories, setMemories] = useState(() => {
    try {
      const saved = localStorage.getItem("priyal_birthday_photos");
      return saved ? JSON.parse(saved) : DEFAULT_MEMORIES;
    } catch {
      return DEFAULT_MEMORIES;
    }
  });

  const [activeModalPhoto, setActiveModalPhoto] = useState(null);
  const [targetReplaceId, setTargetReplaceId] = useState(null);
  const fileInputRef = useRef(null);
  const addFileInputRef = useRef(null);

  const saveMemories = (newMemories) => {
    setMemories(newMemories);
    try {
      localStorage.setItem("priyal_birthday_photos", JSON.stringify(newMemories));
    } catch (e) {
      console.warn("Storage quota exceeded or private mode", e);
    }
  };

  const handleLike = (id, e) => {
    e.stopPropagation();
    fireHeartConfetti();
    const updated = memories.map((m) =>
      m.id === id ? { ...m, likes: m.likes + 1, liked: true } : m
    );
    saveMemories(updated);
  };

  const triggerReplacePhoto = (id, e) => {
    e.stopPropagation();
    setTargetReplaceId(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || targetReplaceId === null) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        const updated = memories.map((m) =>
          m.id === targetReplaceId ? { ...m, url: base64 } : m
        );
        saveMemories(updated);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddNewPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        const newPhoto = {
          id: Date.now(),
          url: base64,
          title: "New Bestie Memory ✨",
          date: "Just Now",
          caption: "Another unforgettable chapter added to our archive of friendship.",
          tag: "SPECIAL MOMENT",
          likes: 1,
        };
        saveMemories([...memories, newPhoto]);
        fireConfetti();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (window.confirm("Reset photos back to default memories?")) {
      saveMemories(DEFAULT_MEMORIES);
      localStorage.removeItem("priyal_birthday_photos");
    }
  };

  const handleProceed = () => {
    fireConfetti();
    onNext();
  };

  return (
    <section className="step-photos-section">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={addFileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleAddNewPhoto}
      />

      <div className="photos-header">
        <div className="kicker">
          <span /> STEP 02 · ARCHIVE OF EXCELLENCE
        </div>
        <h2 className="section-title">
          The <i>Bestie</i> Vault.
        </h2>
        <p className="section-subtitle">
          Evidence that life is at least 1000% better with Priyal around.
          <br className="desktop-only" /> Tap any memory to zoom in, send love, or personalize with your own photos!
        </p>

        <div className="photos-actions-bar">
          <button
            className="action-pill add-btn"
            onClick={() => addFileInputRef.current?.click()}
            title="Upload your own photo with Priyal"
          >
            <Plus size={15} /> Add Photo
          </button>
          <button
            className="action-pill reset-btn"
            onClick={handleReset}
            title="Restore default photos"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
        </div>
      </div>

      <div className="polaroid-grid">
        {memories.map((m, index) => {
          // slight alternating rotations for playful polaroid effect
          const rotations = [-2.5, 1.8, -1.5, 2.2, -1.8, 1.4];
          const rotation = rotations[index % rotations.length];

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
                    className={`like-button ${m.liked ? "liked" : ""}`}
                    onClick={(e) => handleLike(m.id, e)}
                    title="Send a heart"
                  >
                    <Heart size={14} className="heart-icon" fill={m.liked ? "#d45b87" : "transparent"} />
                    <span>{m.likes}</span>
                  </button>
                </div>
                <h3 className="polaroid-title">{m.title}</h3>
                <p className="polaroid-desc">{m.caption}</p>

                <div className="polaroid-footer">
                  <button
                    className="replace-photo-link"
                    onClick={(e) => triggerReplacePhoto(m.id, e)}
                    title="Replace this photo with one from your device"
                  >
                    <Upload size={12} /> Change photo
                  </button>
                </div>
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
                  className="modal-love-btn"
                  onClick={(e) => handleLike(activeModalPhoto.id, e)}
                >
                  <Heart size={18} fill="#d45b87" color="#d45b87" />
                  <span>Send Love ({activeModalPhoto.likes})</span>
                </button>
                <button
                  className="modal-replace-btn"
                  onClick={(e) => {
                    const id = activeModalPhoto.id;
                    setActiveModalPhoto(null);
                    triggerReplacePhoto(id, e);
                  }}
                >
                  <Upload size={15} /> Replace Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
