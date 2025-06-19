/**
 * Progress Storage Module
 * ======================
 *
 * Handles saving and loading progress data from localStorage
 */

import { debug } from '../../../scripts/core/debug.js';

// Storage key
const STORAGE_KEY = 'bsb-learning-progress';
const MAX_SAVED_ACTIVITIES = 20;
const JSON_INDENT_SPACES = 2;

/**
 * Save progress to localStorage
 * @param {Object} progress - Progress data to save
 */
export const saveProgress = progress => {
  try {
    const saveData = {
      componentsExplored: Array.from(progress.componentsExplored),
      conceptsLearned: Array.from(progress.conceptsLearned),
      achievements: Array.from(progress.achievements),
      checkpoints: Array.from(progress.checkpoints),
      timeSpent: progress.timeSpent,
      lastActivity: progress.lastActivity,
      activityLog: progress.activityLog.slice(0, MAX_SAVED_ACTIVITIES), // Limit saved activities
      version: '1.0.0',
      savedAt: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    debug.log('💾 Learning progress saved');
  } catch (error) {
    debug.warn('Failed to save learning progress:', error);
  }
};

/**
 * Load progress from localStorage
 * @returns {Object} Loaded progress data or default values
 */
export const loadProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);

      // Convert arrays back to Sets and Maps
      const progress = {
        componentsExplored: new Set(data.componentsExplored || []),
        conceptsLearned: new Set(data.conceptsLearned || []),
        achievements: new Set(data.achievements || []),
        checkpoints: new Map(data.checkpoints || []),
        timeSpent: data.timeSpent || 0,
        lastActivity: data.lastActivity || Date.now(),
        activityLog: data.activityLog || []
      };

      debug.log('📂 Learning progress loaded');
      return progress;
    }
  } catch (error) {
    debug.warn('Failed to load learning progress:', error);
  }

  // Return default progress structure
  return {
    componentsExplored: new Set(),
    conceptsLearned: new Set(),
    timeSpent: 0,
    lastActivity: Date.now(),
    achievements: new Set(),
    checkpoints: new Map(),
    activityLog: []
  };
};

/**
 * Export progress data for sharing/backup
 * @param {Object} progress - Progress data to export
 * @returns {Object} Export data
 */
export const exportProgress = progress => {
  const exportData = {
    learningProgress: {
      componentsExplored: Array.from(progress.componentsExplored),
      conceptsLearned: Array.from(progress.conceptsLearned),
      achievements: Array.from(progress.achievements),
      timeSpent: progress.timeSpent,
      activityLog: progress.activityLog
    },
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };

  // Create download
  const blob = new Blob(
    [JSON.stringify(exportData, null, JSON_INDENT_SPACES)],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bsb-learning-progress-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);
  debug.log('📤 Learning progress exported');

  return exportData;
};

/**
 * Clear all progress data
 */
export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    debug.log('🔄 Learning progress reset');
  } catch (error) {
    debug.warn('Failed to reset learning progress:', error);
  }
};