/**
 * Manages the watched clips list functionality
 * Provides functions to initialize, add, remove, and check watched clips
 */

// Storage key for watched clips
const STORAGE_KEY = 'minecraft-minute-watched-clips';

/**
 * Initialize the watched clips list
 * @returns {string[]} Array of watched clip IDs
 */
export function initWatchedClips() {
  // Get watched clips from localStorage or initialize as empty array
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

/**
 * Add a clip to the watched list
 * @param {string} clipId - The ID of the clip to add
 * @returns {string[]} Updated array of watched clip IDs
 */
export function addWatchedClip(clipId) {
  const watchedClips = initWatchedClips();

  // Add clip to watched list if not already there
  if (!watchedClips.includes(clipId)) {
    watchedClips.push(clipId);
    // Save updated watched clips to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedClips));
  }

  return watchedClips;
}

/**
 * Remove a clip from the watched list
 * @param {string} clipId - The ID of the clip to remove
 * @returns {string[]} Updated array of watched clip IDs
 */
export function removeWatchedClip(clipId) {
  const watchedClips = initWatchedClips();

  // Remove clip from watched list
  const index = watchedClips.indexOf(clipId);
  if (index > -1) {
    watchedClips.splice(index, 1);
    // Save updated watched clips to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedClips));
  }

  return watchedClips;
}

/**
 * Check if a clip is in the watched list
 * @param {string} clipId - The ID of the clip to check
 * @returns {boolean} True if the clip is in the watched list, false otherwise
 */
export function isClipWatched(clipId) {
  const watchedClips = initWatchedClips();
  return watchedClips.includes(clipId);
}

/**
 * Toggle a clip's watched status
 * @param {string} clipId - The ID of the clip to toggle
 * @param {boolean} isWatched - Whether the clip should be marked as watched
 * @returns {string[]} Updated array of watched clip IDs
 */
export function toggleWatchedClip(clipId, isWatched) {
  return isWatched ? addWatchedClip(clipId) : removeWatchedClip(clipId);
}
