// ============================================
// Sound System - 8-bit Style Audio
// ============================================

console.log('🔊 Sound system loading...');

// Audio Context (Lazy initialization)
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// ============================================
// Sound Effects Generator
// ============================================

/**
 * Play a simple beep sound
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in seconds
 * @param {number} volume - Volume (0-1)
 * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
 */
function playBeep(frequency, duration, volume = 0.3, type = 'square') {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Failed to play sound:', error);
  }
}

/**
 * Play a sequence of notes
 * @param {Array} notes - Array of {frequency, duration} objects
 * @param {number} volume - Volume (0-1)
 */
function playSequence(notes, volume = 0.3) {
  try {
    const ctx = getAudioContext();
    let startTime = ctx.currentTime;

    notes.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = note.frequency;
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);

      startTime += note.duration;
    });
  } catch (error) {
    console.warn('Failed to play sequence:', error);
  }
}

// ============================================
// Predefined Sound Effects
// ============================================

const SoundEffects = {
  // Button click - short high beep
  buttonClick: () => {
    playBeep(800, 0.05, 0.2);
  },

  // Category select - medium beep
  categorySelect: () => {
    playBeep(600, 0.1, 0.25);
  },

  // Start game - ascending notes
  gameStart: () => {
    playSequence([
      { frequency: 523, duration: 0.1 }, // C5
      { frequency: 659, duration: 0.1 }, // E5
      { frequency: 784, duration: 0.15 }, // G5
    ], 0.25);
  },

  // Image select - quick beep
  imageSelect: () => {
    playBeep(700, 0.08, 0.2);
  },

  // Round complete - success melody
  roundComplete: () => {
    playSequence([
      { frequency: 659, duration: 0.1 }, // E5
      { frequency: 784, duration: 0.1 }, // G5
      { frequency: 988, duration: 0.15 }, // B5
    ], 0.25);
  },

  // Victory - fanfare
  victory: () => {
    playSequence([
      { frequency: 523, duration: 0.15 }, // C5
      { frequency: 659, duration: 0.15 }, // E5
      { frequency: 784, duration: 0.15 }, // G5
      { frequency: 1047, duration: 0.3 }, // C6
    ], 0.3);
  },

  // Error - descending beeps
  error: () => {
    playSequence([
      { frequency: 400, duration: 0.1 },
      { frequency: 300, duration: 0.1 },
      { frequency: 200, duration: 0.15 },
    ], 0.25);
  },

  // Tick - timer sound
  tick: () => {
    playBeep(1200, 0.03, 0.15);
  },

  // Warning - low beep
  warning: () => {
    playBeep(300, 0.2, 0.25, 'sawtooth');
  },

  // Hover - very short subtle beep
  hover: () => {
    playBeep(900, 0.03, 0.1);
  },
};

// ============================================
// Volume Control
// ============================================

let globalVolume = 1.0;
let isMuted = false;

function setVolume(volume) {
  globalVolume = Math.max(0, Math.min(1, volume));
}

function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

function isSoundEnabled() {
  return !isMuted;
}

// ============================================
// Export to Window
// ============================================

window.SoundSystem = {
  play: (soundName) => {
    if (isMuted || globalVolume === 0) return;
    if (SoundEffects[soundName]) {
      SoundEffects[soundName]();
    } else {
      console.warn(`Sound effect '${soundName}' not found`);
    }
  },
  setVolume,
  toggleMute,
  isMuted: () => isMuted,
  isSoundEnabled,
};

console.log('✅ Sound system loaded');
