import { Sparkles, Camera, Music } from "lucide-react";

export default function StepIndicator({ currentStep, setStep, maxUnlockedStep }) {
  const steps = [
    { id: 1, label: "The Question", icon: Sparkles },
    { id: 2, label: "Bestie Vault", icon: Camera },
    { id: 3, label: "Birthday Anthem", icon: Music },
  ];

  return (
    <nav className="step-indicator-wrapper" aria-label="Birthday Journey Steps">
      <div className="step-indicator">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = currentStep === s.id;
          const isCompleted = currentStep > s.id;
          const isAccessible = s.id <= maxUnlockedStep;

          return (
            <button
              key={s.id}
              className={`step-pill ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isAccessible ? "accessible" : "locked"}`}
              onClick={() => isAccessible && setStep(s.id)}
              disabled={!isAccessible}
              title={`Go to Step ${s.id}: ${s.label}`}
            >
              <span className="step-num">{isCompleted ? "✓" : `0${s.id}`}</span>
              <span className="step-icon">
                <Icon size={14} />
              </span>
              <span className="step-label">{s.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
