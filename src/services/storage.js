// LocalStorage keys for Guest Mode & Offline Sync
export const STORAGE_KEYS = {
  MOOD_LOGS: 'sisu_mood_logs',
  BELIEFS: 'sisu_beliefs',
  BELIEF_PRACTICES: 'sisu_belief_practices',
  FRIENDS: 'sisu_friends',
  COMPLETED_RESOURCES: 'sisu_completed_resources',
  BREATHING_STREAK: 'sisu_breathing_streak',
  USER_PREFERENCES: 'sisu_user_prefs',
  THEME_MODE: 'sisu_theme_mode',
  JOURNAL_ENTRIES: 'sisu_journal_entries',
  ACTIVE_TAB: 'sisu_active_tab'
};

export const getStoredItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from LocalStorage:`, error);
    return fallback;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to LocalStorage:`, error);
  }
};
