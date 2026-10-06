import { useState, useEffect } from "react";
import StepIndicator from "./components/StepIndicator";
import StepEvasive from "./components/StepEvasive";
import StepPhotos from "./components/StepPhotos";
import StepCelebration from "./components/StepCelebration";

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    if (stepNumber > maxUnlockedStep) {
      setMaxUnlockedStep(stepNumber);
    }
  };

  const handleStep1Complete = () => {
    goToStep(2);
  };

  const handleStep2Next = () => {
    goToStep(3);
  };

  const handleStep2Prev = () => {
    goToStep(1);
  };

  const handleStep3Prev = () => {
    goToStep(2);
  };

  const handleRestart = () => {
    setCurrentStep(1);
  };

  return (
    <main className="birthday-app">
      {/* Background grain texture */}
      <div className="grain" />

      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-brand">
          <span className="tiny-logo">
            P<span>✦</span>
          </span>
          <span className="top-brand-sub">PRIYAL'S DAY</span>
        </div>

        {/* Step Indicator Navigation */}
        <StepIndicator
          currentStep={currentStep}
          setStep={goToStep}
          maxUnlockedStep={maxUnlockedStep}
        />

        <div className="topbar-right">
          <span className="top-note desktop-only">INTERNET BIRTHDAY DEPT</span>
          <span className="top-date">25 · 10 · ∞</span>
        </div>
      </header>

      {/* Active Step Content */}
      <div className="step-viewport">
        {currentStep === 1 && (
          <StepEvasive onComplete={handleStep1Complete} />
        )}

        {currentStep === 2 && (
          <StepPhotos onNext={handleStep2Next} onPrev={handleStep2Prev} />
        )}

        {currentStep === 3 && (
          <StepCelebration onPrev={handleStep3Prev} onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
}
