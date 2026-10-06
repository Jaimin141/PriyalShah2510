import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { fireConfetti } from "../utils/confetti";

const noLines = [
  "nice try 😭",
  "absolutely not.",
  "girl, please.",
  "you really thought?",
  "NOPE ✋",
  "that button has trust issues.",
  "try again, bestie 😂",
  "not on my watch!",
  "effort: 10/10, success: 0/10",
  "just click yes already! 💅",
];

export default function StepEvasive({ onComplete }) {
  const yesRef = useRef(null);
  const noRef = useRef(null);
  const containerRef = useRef(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [tease, setTease] = useState("be honest… you want to click YES");
  const [escapeCount, setEscapeCount] = useState(0);

  const moveNo = () => {
    const container = containerRef.current;
    const button = noRef.current;
    const yesButton = yesRef.current;
    if (!container || !button || !yesButton) return;

    const cRect = container.getBoundingClientRect();
    const bRect = button.getBoundingClientRect();
    const yRect = yesButton.getBoundingClientRect();

    // Clearance margin (in px) that NO button must keep from the YES button
    const safeMargin = 22;
    const containerPadding = 12;

    // Base position of NO button if translation was (0, 0)
    const baseLeft = bRect.left - noPos.x;
    const baseTop = bRect.top - noPos.y;

    // Available bounds within question card container
    const minX = cRect.left + containerPadding - baseLeft;
    const maxX = cRect.right - containerPadding - bRect.width - baseLeft;
    const minY = cRect.top + containerPadding - baseTop;
    const maxY = cRect.bottom - containerPadding - bRect.height - baseTop;

    let targetX = noPos.x;
    let targetY = noPos.y;
    let foundSafeSpot = false;

    // Try up to 50 candidate positions inside the container
    for (let attempt = 0; attempt < 50; attempt++) {
      const candX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      const candY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      // Predicted bounding box in viewport coordinates
      const candLeft = baseLeft + candX;
      const candRight = candLeft + bRect.width;
      const candTop = baseTop + candY;
      const candBottom = candTop + bRect.height;

      // Strict collision check with YES button + safeMargin
      const overlapsYes = !(
        candRight + safeMargin < yRect.left ||
        candLeft - safeMargin > yRect.right ||
        candBottom + safeMargin < yRect.top ||
        candTop - safeMargin > yRect.bottom
      );

      // Must move at least 45px away from current position to feel evasive
      const distance = Math.hypot(candX - noPos.x, candY - noPos.y);

      if (!overlapsYes && distance > 45) {
        targetX = candX;
        targetY = candY;
        foundSafeSpot = true;
        break;
      }
    }

    // Deterministic fallback if random sampling doesn't find a spot:
    // Place strictly to the right or safely below the YES button
    if (!foundSafeSpot) {
      const spaceOnRight = cRect.right - yRect.right;
      if (spaceOnRight >= bRect.width + safeMargin + containerPadding) {
        // Place comfortably to the right of the YES button
        targetX = (yRect.right + safeMargin) - baseLeft;
        targetY = (escapeCount % 2 === 0 ? minY + 10 : maxY - 10);
      } else {
        // Place comfortably below the YES button
        targetX = Math.max(minX, cRect.right - containerPadding - bRect.width - baseLeft);
        targetY = (yRect.bottom + safeMargin) - baseTop;
      }
    }

    setNoPos({ x: targetX, y: targetY });
    setEscapeCount((n) => n + 1);
    setTease(noLines[escapeCount % noLines.length]);
  };

  const handleDodge = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    moveNo();
  };

  useEffect(() => {
    const onPointerMove = (e) => {
      const button = noRef.current;
      if (!button) return;
      const r = button.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) < 65) {
        moveNo();
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [escapeCount]);

  const handleYes = () => {
    fireConfetti();
    onComplete();
  };

  return (
    <section className="step-evasive-section">
      <div className="scribble scribble-one">certified yapper ↗</div>
      <div className="scribble scribble-two">bestie since forever ♡</div>
      <div className="sticker sticker-one" aria-hidden="true">✨</div>
      <div className="sticker sticker-two" aria-hidden="true">LOL</div>
      <div className="sticker sticker-three" aria-hidden="true">
        <span>10/10</span>
        <span>human</span>
      </div>

      <div className="hero-copy">
        <p className="kicker">
          <span /> breaking news from the internet
        </p>
        <h1 className="hero-title">
          It’s your<br />
          <i>birthday,</i> Priyal.
        </h1>
        <p className="subline">
          Another year older. Still making questionable decisions.
          <br />
          Honestly? We love the consistency.
        </p>
      </div>

      <div className="question-card" ref={containerRef}>
        <div className="card-badge">STEP 01 · MANDATORY VERIFICATION</div>
        <p className="question-label">A VERY SERIOUS QUESTION</p>
        <h2>
          Are you ready to accept<br />
          <em>your birthday privileges?</em>
        </h2>

        <p className="tease" key={tease}>
          <Sparkles size={12} className="tease-sparkle" /> {tease}
        </p>

        <div className="choice-area">
          <button ref={yesRef} className="yes-button" onClick={handleYes} id="accept-privileges-btn">
            YES, obviously <ArrowUpRight size={16} />
          </button>

          <button
            ref={noRef}
            className="no-button"
            id="evasive-no-btn"
            style={{
              transform: `translate3d(${noPos.x}px, ${noPos.y}px, 0)`,
            }}
            onPointerEnter={handleDodge}
            onPointerDown={handleDodge}
            onTouchStart={handleDodge}
            onClick={handleDodge}
          >
            no thanks
          </button>
        </div>

        <div className="dodge-counter">
          <span>Dodges evaded: <b>{escapeCount}</b></span>
          <span className="tiny-hint">* the second option has trust issues</span>
        </div>
      </div>

      <div className="bottom-meta">
        <span>made with questionable amounts of love</span>
        <span>scrolling is optional. being iconic isn't.</span>
      </div>
    </section>
  );
}
