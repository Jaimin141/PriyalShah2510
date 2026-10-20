import confetti from "canvas-confetti";

// SVG Vector Heart Path - draws directly with Path2D, completely transparent with NO white square box artifact
const HEART_SVG_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

let heartShapeInstance = null;

function getHeartShape() {
  if (!heartShapeInstance && typeof confetti.shapeFromPath === "function") {
    try {
      heartShapeInstance = confetti.shapeFromPath({ path: HEART_SVG_PATH });
    } catch (err) {
      console.warn("Path2D shape not supported, using standard particle:", err);
      heartShapeInstance = null;
    }
  }
  return heartShapeInstance;
}

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: ["#d45b87", "#f6c1d5", "#6959a0", "#ffd166", "#06d6a0"],
  });
}

export function fireCelebrationShower() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#d45b87", "#f6c1d5", "#6959a0", "#ffd166", "#06d6a0"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#d45b87", "#f6c1d5", "#6959a0", "#ffd166", "#06d6a0"],
    });
  }, 250);
}

export function fireHeartConfetti(origin) {
  const shape = getHeartShape();

  const options = {
    particleCount: 26,
    spread: 55,
    startVelocity: 24,
    gravity: 0.85,
    ticks: 75,
    scalar: 1.5,
    origin: origin || { y: 0.68 },
    colors: ["#d45b87", "#ff4d6d", "#f6c1d5", "#ff758f", "#e63946"],
  };

  if (shape) {
    options.shapes = [shape];
  } else {
    // Graceful fallback to pure circles if Path2D is unavailable
    options.shapes = ["circle"];
  }

  confetti(options);
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
