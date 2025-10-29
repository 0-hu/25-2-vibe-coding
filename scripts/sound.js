/**
 * sound.js - Sound System
 * Manages audio playback for card reveals and pack opening
 */

let soundEnabled = true;
let volume = 0.5; // 50% default volume

// Sound instances (Howler.js will be used when sound files are available)
const sounds = {
  common: null,   // Placeholder for common card flip sound
  rare: null,     // Placeholder for rare card chime
  epic: null,     // Placeholder for epic fanfare
  mythic: null,   // Placeholder for mythic dramatic reveal
  packTear: null  // Placeholder for pack opening sound
};

/**
 * Initialize sound system
 * This will be called when Howler.js is loaded and sound files are available
 */
export function initSounds() {
  // Check if Howler.js is loaded
  if (typeof Howl === 'undefined') {
    console.warn('Howler.js not loaded. Sound system disabled.');
    return false;
  }

  try {
    // When sound files are added to assets/sounds/, initialize them here:
    /*
    sounds.common = new Howl({
      src: ['assets/sounds/whoosh-soft.mp3'],
      volume: volume
    });
    sounds.rare = new Howl({
      src: ['assets/sounds/chime.mp3'],
      volume: volume
    });
    sounds.epic = new Howl({
      src: ['assets/sounds/fanfare.mp3'],
      volume: volume
    });
    sounds.mythic = new Howl({
      src: ['assets/sounds/reveal-epic.mp3'],
      volume: volume
    });
    sounds.packTear = new Howl({
      src: ['assets/sounds/pack-tear.mp3'],
      volume: volume
    });
    */

    console.log('Sound system initialized (placeholder mode)');
    return true;
  } catch (error) {
    console.error('Error initializing sounds:', error);
    return false;
  }
}

/**
 * Play a sound by type
 * @param {string} type - Sound type (common, rare, epic, mythic, packTear)
 */
export function playSound(type) {
  if (!soundEnabled) return;

  if (sounds[type]) {
    sounds[type].play();
  } else {
    // Placeholder: log what sound would play
    console.log(`=
 Sound: ${type}`);
  }
}

/**
 * Toggle sound on/off
 * @returns {boolean} - New sound enabled state
 */
export function toggleSound() {
  soundEnabled = !soundEnabled;
  console.log(`Sound ${soundEnabled ? 'enabled' : 'disabled'}`);
  return soundEnabled;
}

/**
 * Set volume level
 * @param {number} val - Volume (0.0 to 1.0)
 */
export function setVolume(val) {
  volume = Math.max(0, Math.min(1, val));

  // Update volume for all sound instances
  Object.values(sounds).forEach(sound => {
    if (sound) {
      sound.volume(volume);
    }
  });

  console.log(`Volume set to ${Math.round(volume * 100)}%`);
}

/**
 * Get current volume
 * @returns {number} - Current volume (0.0 to 1.0)
 */
export function getVolume() {
  return volume;
}

/**
 * Check if sound is enabled
 * @returns {boolean} - Sound enabled state
 */
export function isSoundEnabled() {
  return soundEnabled;
}

// Initialize on load if Howler.js is available
if (typeof Howl !== 'undefined') {
  initSounds();
}
