// localStorage 관리 모듈

const STORAGE_KEYS = {
  SETTINGS: 'uc:settings',
  LAST_SESSION: 'uc:lastSession',
  HISTORY: 'uc:history',
};

const DEFAULT_SETTINGS = {
  lastCategory: null,
  timeLimitSec: 10,
};

// Settings
export function getSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings) {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

// Session
export function getLastSession() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load session:', error);
  }
  return null;
}

export function saveSession(session) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.LAST_SESSION);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

// History
export function getHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
  return [];
}

export function addToHistory(entry) {
  try {
    const history = getHistory();
    history.unshift(entry);
    if (history.length > 20) {
      history.splice(20);
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to add to history:', error);
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
