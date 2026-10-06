import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Upload,
  Sparkles,
  Heart,
  Music,
  Cake,
  Share2,
  Check,
  Flame,
  ArrowLeft
} from "lucide-react";
import { fireCelebrationShower, fireHeartConfetti, fireConfetti } from "../utils/confetti";

const BASE = import.meta.env.BASE_URL || "/";
const cleanBase = BASE.endsWith("/") ? BASE : `${BASE}/`;

export default function StepCelebration({ onPrev, onRestart }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isLooping, setIsLooping] = useState(true);
  const [audioSource, setAudioSource] = useState(`${cleanBase}happy-birthday.mp3`);
  const [trackName, setTrackName] = useState("Happy Birthday Priyal 🎂 (Birthday Anthem)");
  const [customAudioUploaded, setCustomAudioUploaded] = useState(false);

  // Birthday cake interactive candles state
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const audioFileInputRef = useRef(null);

  // Audio time formatting
  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Launch initial confetti shower and attempt playback of happy-birthday.mp3
  useEffect(() => {
    fireCelebrationShower();

    const audio = audioRef.current;
    if (audio) {
      // Small timeout to allow element to mount and prepare buffer
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Audio autoplay waiting for user click:", err);
          });
      }
    }
  }, []);

  // Handle fallback if primary path is not found
  const handleAudioError = () => {
    if (audioSource !== "/happy-birthday.mp3" && audioSource !== "./happy-birthday.mp3") {
      console.log("Primary path failed, attempting fallback to /happy-birthday.mp3");
      setAudioSource("/happy-birthday.mp3");
    }
  };

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Autoplay / audio play blocked or error:", err);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleCustomAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setAudioSource(fileUrl);
    setTrackName(file.name.replace(/\.[^/.]+$/, ""));
    setCustomAudioUploaded(true);
    setIsPlaying(false);

    // Play new track after loaded
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 200);

    fireConfetti();
  };

  const blowCandles = () => {
    if (!candlesBlown) {
      setCandlesBlown(true);
      fireCelebrationShower();
      fireHeartConfetti();
    } else {
      setCandlesBlown(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <section className="step-celebration-section">
      {/* Audio element for happy-birthday.mp3 */}
      <audio
        ref={audioRef}
        src={audioSource}
        loop={isLooping}
        preload="auto"
        onError={handleAudioError}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Hidden custom file input */}
      <input
        type="file"
        ref={audioFileInputRef}
        accept="audio/*"
        style={{ display: "none" }}
        onChange={handleCustomAudioUpload}
      />

      {/* Header */}
      <div className="celebration-header">
        <div className="kicker">
          <span /> STEP 03 · THE GRAND FINALE
        </div>
        <h2 className="section-title">
          The <i>Birthday</i> Anthem.
        </h2>
        <p className="section-subtitle">
          Turn your sound up! Official celebration music is live.
        </p>
      </div>

      <div className="celebration-grid">
        {/* Left Column: Music Player & Interactive Cake */}
        <div className="celebration-left-col">
          {/* MP3 Audio Player Card */}
          <div className={`music-player-card ${isPlaying ? "playing" : ""}`}>
            <div className="player-top">
              <div className="track-badge">
                <Music size={13} className="track-icon-spin" />
                <span>OFFICIAL BIRTHDAY TRACK · MP3</span>
              </div>

              <button
                className="custom-audio-btn"
                onClick={() => audioFileInputRef.current?.click()}
                title="Upload custom MP3 audio"
              >
                <Upload size={12} /> {customAudioUploaded ? "Change MP3" : "Upload MP3"}
              </button>
            </div>

            <div className="player-disc-row">
              {/* Vinyl / Disc Visualizer */}
              <div className={`vinyl-disc ${isPlaying ? "spinning" : ""}`} onClick={togglePlay}>
                <div className="disc-grooves">
                  <div className="disc-center">
                    <span>P✦</span>
                  </div>
                </div>
              </div>

              <div className="player-meta">
                <h3 className="track-title">{trackName}</h3>
                <p className="track-artist">Dedicated to Priyal • Played with Love</p>

                {/* Animated Equalizer Wave */}
                <div className="equalizer-wave" aria-hidden="true">
                  {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
                    <span
                      key={i}
                      className="eq-bar"
                      style={{
                        animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                        animationPlayState: isPlaying ? "running" : "paused",
                        height: isPlaying ? `${h}%` : "15%",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Scrubber */}
            <div className="scrubber-row">
              <span className="time-text">{formatTime(currentTime)}</span>
              <input
                type="range"
                className="scrubber-slider"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
              />
              <span className="time-text">{formatTime(duration)}</span>
            </div>

            {/* Player Controls */}
            <div className="controls-row">
              <div className="volume-wrapper">
                <button
                  className="mute-btn"
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
              </div>

              {/* Big Play / Pause Button */}
              <button
                className={`main-play-btn ${isPlaying ? "is-playing" : ""}`}
                onClick={togglePlay}
                id="toggle-birthday-audio"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
                <span>{isPlaying ? "Pause Anthem" : "Play Anthem"}</span>
              </button>

              <button
                className={`loop-btn ${isLooping ? "active" : ""}`}
                onClick={() => setIsLooping(!isLooping)}
                title="Toggle Loop"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Interactive Birthday Cake Card */}
          <div className="cake-interactive-card">
            <div className="cake-header">
              <span className="cake-label">INTERACTIVE RITUAL</span>
              <span className="cake-hint">
                {candlesBlown ? "✨ Wish has been made!" : "👆 Tap candles to blow them out!"}
              </span>
            </div>

            <div className="cake-stage" onClick={blowCandles} role="button" tabIndex={0}>
              <div className="cake-illustration">
                {/* 3 Candles */}
                <div className="candles-row">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className={`candle ${candlesBlown ? "blown-out" : ""}`}>
                      <div className="flame">
                        <Flame size={18} />
                      </div>
                      <div className="wick" />
                      <div className="candle-body" />
                      {candlesBlown && <div className="smoke" />}
                    </div>
                  ))}
                </div>

                {/* Cake Layers */}
                <div className="cake-tier cake-tier-top">
                  <div className="frosting-drips">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="cake-tier cake-tier-base">
                  <div className="cake-plate" />
                </div>
              </div>
            </div>

            <div className="cake-action-text">
              <button className="blow-btn" onClick={blowCandles}>
                <Cake size={16} />
                {candlesBlown ? "Relight Candles 🕯️" : "Blow Out Candles & Make a Wish 💨"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Birthday Letter & Confetti Shower */}
        <div className="celebration-right-col">
          <div className="birthday-letter-card">
            <div className="letter-stamp">
              <span>PRIYAL</span>
              <span>25 · 10</span>
            </div>

            <div className="letter-header">
              <p className="kicker">
                <span /> OFFICIAL BESTIE PROCLAMATION
              </p>
              <h3 className="letter-title">
                Happy Birthday, <i>Priyal!</i> 💖
              </h3>
            </div>

            <div className="letter-body">
              <p>
                To my absolute favorite human, certified yapper, and partner in every questionable life choice:
              </p>
              <p>
                Thank you for being the person who answers every 3 AM crisis call, laughs until our stomachs hurt at things that make zero sense, and brings so much light and joy everywhere you go.
              </p>
              <p>
                May this year bring you breathtaking adventures, peaceful mornings, iced coffees that taste heavenly, and every single dream you've been working toward. You deserve all the good things the universe has to offer.
              </p>
            </div>

            <div className="letter-badges">
              <span className="badge">✦ 100% UNREPLACEABLE</span>
              <span className="badge">✦ MAIN CHARACTER</span>
              <span className="badge">✦ ICONIC FRIENDSHIP</span>
            </div>

            <div className="letter-signature">
              <p>Forever & always,</p>
              <p className="sign-name">Your Best Friend ♡</p>
            </div>

            <div className="celebration-actions">
              <button
                className="action-btn confetti-btn"
                onClick={() => fireCelebrationShower()}
              >
                <Sparkles size={16} /> Shower Confetti 🎉
              </button>

              <button
                className="action-btn heart-btn"
                onClick={() => fireHeartConfetti()}
              >
                <Heart size={16} fill="#d45b87" /> Send Infinite Love
              </button>

              <button
                className="action-btn share-btn"
                onClick={handleShare}
              >
                {copiedLink ? <Check size={16} color="#06d6a0" /> : <Share2 size={16} />}
                <span>{copiedLink ? "Link Copied!" : "Share Birthday Link"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="step-navigation-footer">
        <button className="nav-btn prev-btn" onClick={onPrev}>
          <ArrowLeft size={16} /> Back to Photos
        </button>

        <div className="nav-step-count">
          <span>03 / 03 · FINALE</span>
        </div>

        <button className="nav-btn restart-btn" onClick={onRestart}>
          <RotateCcw size={15} /> Start Over
        </button>
      </div>
    </section>
  );
}
