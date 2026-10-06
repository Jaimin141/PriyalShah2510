import confetti from "canvas-confetti";

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

export function fireHeartConfetti() {
  const count = 30;
  const scalar = 2;
  const heart = confetti.shapeFromText({ text: "💖", scalar });

  confetti({
    shapes: [heart],
    particleCount: count,
    spread: 60,
    startVelocity: 25,
    origin: { y: 0.7 },
  });
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
