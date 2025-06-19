/**
 * Progress Manager Tests
 * ======================
 * 
 * Tests for the tutorial progress tracking and management functionality
 */

import { ProgressManager } from '../../src/scripts/components/tutorial-hub/progress-manager.js';

// Mock localStorage
const localStorageMock = {
  storage: {},
  getItem: jest.fn(key => localStorageMock.storage[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.storage[key] = value;
  }),
  removeItem: jest.fn(key => {
    delete localStorageMock.storage[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.storage = {};
  })
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ProgressManager', () => {
  let progressManager;
  let mockTutorials;
  let mockProgressContainer;
  let mockProgressCircle;
  let mockProgressText;
  let mockStatsContainer;

  beforeEach(() => {
    // Clear localStorage
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();

    // Create mock DOM elements
    document.body.innerHTML = `
      <div id="progress-container">
        <div class="progress-circle">
          <svg viewBox="0 0 100 100">
            <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
            <circle class="progress-bar" cx="50" cy="50" r="45"></circle>
          </svg>
          <div class="progress-text">
            <span class="percentage">0%</span>
            <span class="label">Complete</span>
          </div>
        </div>
        <div class="stats-container">
          <div class="stat" data-stat="completed">
            <span class="stat-value">0</span>
            <span class="stat-label">Completed</span>
          </div>
          <div class="stat" data-stat="inProgress">
            <span class="stat-value">0</span>
            <span class="stat-label">In Progress</span>
          </div>
          <div class="stat" data-stat="skillLevel">
            <span class="stat-value">Beginner</span>
            <span class="stat-label">Skill Level</span>
          </div>
        </div>
      </div>
    `;

    mockProgressContainer = document.getElementById('progress-container');
    mockProgressCircle = document.querySelector('.progress-circle');
    mockProgressText = document.querySelector('.progress-text');
    mockStatsContainer = document.querySelector('.stats-container');

    mockTutorials = [
      {
        id: 'tutorial-1',
        title: 'CSS Flexbox Basics',
        difficulty: 'beginner',
        topic: 'CSS',
        duration: '15 min'
      },
      {
        id: 'tutorial-2',
        title: 'Advanced JavaScript',
        difficulty: 'advanced',
        topic: 'JavaScript',
        duration: '45 min'
      },
      {
        id: 'tutorial-3',
        title: 'CSS Grid Layout',
        difficulty: 'intermediate',
        topic: 'CSS',
        duration: '30 min'
      }
    ];

    progressManager = new ProgressManager(mockProgressContainer, mockTutorials);
  });

  describe('constructor', () => {
    test('should initialize with provided parameters', () => {
      expect(progressManager.container).toBe(mockProgressContainer);
      expect(progressManager.tutorials).toBe(mockTutorials);
    });

    test('should initialize with empty progress data', () => {
      expect(progressManager.progress).toEqual({});
    });

    test('should load saved progress from localStorage', () => {
      const savedProgress = {
        'tutorial-1': { completed: true, progress: 100, lastAccessed: Date.now() },
        'tutorial-2': { completed: false, progress: 50, lastAccessed: Date.now() }
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedProgress));
      
      const newProgressManager = new ProgressManager(mockProgressContainer, mockTutorials);
      
      expect(newProgressManager.progress).toEqual(savedProgress);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('bsb-tutorial-progress');
    });

    test('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      expect(() => {
        new ProgressManager(mockProgressContainer, mockTutorials);
      }).not.toThrow();
    });

    test('should update UI after initialization', () => {
      const updateUISpy = jest.spyOn(ProgressManager.prototype, 'updateUI');
      new ProgressManager(mockProgressContainer, mockTutorials);
      expect(updateUISpy).toHaveBeenCalled();
      updateUISpy.mockRestore();
    });
  });

  describe('updateProgress', () => {
    test('should update progress for a tutorial', () => {
      progressManager.updateProgress('tutorial-1', 75);
      
      expect(progressManager.progress['tutorial-1']).toMatchObject({
        completed: false,
        progress: 75
      });
      expect(progressManager.progress['tutorial-1'].lastAccessed).toBeDefined();
    });

    test('should mark tutorial as completed when progress is 100', () => {
      progressManager.updateProgress('tutorial-1', 100);
      
      expect(progressManager.progress['tutorial-1'].completed).toBe(true);
      expect(progressManager.progress['tutorial-1'].progress).toBe(100);
    });

    test('should save progress to localStorage', () => {
      progressManager.updateProgress('tutorial-1', 50);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bsb-tutorial-progress',
        JSON.stringify(progressManager.progress)
      );
    });

    test('should update UI after progress change', () => {
      const updateUISpy = jest.spyOn(progressManager, 'updateUI');
      progressManager.updateProgress('tutorial-1', 50);
      expect(updateUISpy).toHaveBeenCalled();
      updateUISpy.mockRestore();
    });

    test('should handle invalid tutorial ID gracefully', () => {
      expect(() => {
        progressManager.updateProgress('invalid-id', 50);
      }).not.toThrow();
    });

    test('should handle invalid progress values', () => {
      progressManager.updateProgress('tutorial-1', -10);
      expect(progressManager.progress['tutorial-1'].progress).toBe(0);
      
      progressManager.updateProgress('tutorial-1', 150);
      expect(progressManager.progress['tutorial-1'].progress).toBe(100);
    });
  });

  describe('markCompleted', () => {
    test('should mark tutorial as completed', () => {
      progressManager.markCompleted('tutorial-1');
      
      expect(progressManager.progress['tutorial-1']).toMatchObject({
        completed: true,
        progress: 100
      });
    });

    test('should update completion timestamp', () => {
      const beforeTime = Date.now();
      progressManager.markCompleted('tutorial-1');
      const afterTime = Date.now();
      
      const completedTime = progressManager.progress['tutorial-1'].completedAt;
      expect(completedTime).toBeGreaterThanOrEqual(beforeTime);
      expect(completedTime).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('resetProgress', () => {
    test('should reset progress for a specific tutorial', () => {
      progressManager.updateProgress('tutorial-1', 75);
      progressManager.resetProgress('tutorial-1');
      
      expect(progressManager.progress['tutorial-1']).toBeUndefined();
    });

    test('should reset all progress when no ID provided', () => {
      progressManager.updateProgress('tutorial-1', 75);
      progressManager.updateProgress('tutorial-2', 50);
      
      progressManager.resetProgress();
      
      expect(progressManager.progress).toEqual({});
    });

    test('should save changes to localStorage', () => {
      progressManager.updateProgress('tutorial-1', 75);
      progressManager.resetProgress('tutorial-1');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bsb-tutorial-progress',
        JSON.stringify({})
      );
    });

    test('should update UI after reset', () => {
      const updateUISpy = jest.spyOn(progressManager, 'updateUI');
      progressManager.resetProgress();
      expect(updateUISpy).toHaveBeenCalled();
      updateUISpy.mockRestore();
    });
  });

  describe('getOverallProgress', () => {
    test('should return 0% when no tutorials completed', () => {
      const progress = progressManager.getOverallProgress();
      expect(progress).toBe(0);
    });

    test('should calculate correct percentage', () => {
      progressManager.markCompleted('tutorial-1');
      const progress = progressManager.getOverallProgress();
      expect(progress).toBeCloseTo(33.33, 1);
    });

    test('should return 100% when all tutorials completed', () => {
      progressManager.markCompleted('tutorial-1');
      progressManager.markCompleted('tutorial-2');
      progressManager.markCompleted('tutorial-3');
      
      const progress = progressManager.getOverallProgress();
      expect(progress).toBe(100);
    });

    test('should handle empty tutorials array', () => {
      const emptyProgressManager = new ProgressManager(mockProgressContainer, []);
      const progress = emptyProgressManager.getOverallProgress();
      expect(progress).toBe(0);
    });
  });

  describe('getCompletedCount', () => {
    test('should return 0 when no tutorials completed', () => {
      const count = progressManager.getCompletedCount();
      expect(count).toBe(0);
    });

    test('should return correct count of completed tutorials', () => {
      progressManager.markCompleted('tutorial-1');
      progressManager.markCompleted('tutorial-2');
      
      const count = progressManager.getCompletedCount();
      expect(count).toBe(2);
    });

    test('should not count partially completed tutorials', () => {
      progressManager.updateProgress('tutorial-1', 50);
      progressManager.markCompleted('tutorial-2');
      
      const count = progressManager.getCompletedCount();
      expect(count).toBe(1);
    });
  });

  describe('getInProgressCount', () => {
    test('should return 0 when no tutorials in progress', () => {
      const count = progressManager.getInProgressCount();
      expect(count).toBe(0);
    });

    test('should return correct count of in-progress tutorials', () => {
      progressManager.updateProgress('tutorial-1', 50);
      progressManager.updateProgress('tutorial-2', 25);
      progressManager.markCompleted('tutorial-3');
      
      const count = progressManager.getInProgressCount();
      expect(count).toBe(2);
    });

    test('should not count completed tutorials', () => {
      progressManager.updateProgress('tutorial-1', 50);
      progressManager.markCompleted('tutorial-2');
      
      const count = progressManager.getInProgressCount();
      expect(count).toBe(1);
    });
  });

  describe('getSkillLevel', () => {
    test('should return "Beginner" for low completion', () => {
      const skillLevel = progressManager.getSkillLevel();
      expect(skillLevel).toBe('Beginner');
    });

    test('should return "Intermediate" for moderate completion', () => {
      progressManager.markCompleted('tutorial-1');
      const skillLevel = progressManager.getSkillLevel();
      expect(skillLevel).toBe('Intermediate');
    });

    test('should return "Advanced" for high completion', () => {
      progressManager.markCompleted('tutorial-1');
      progressManager.markCompleted('tutorial-2');
      progressManager.markCompleted('tutorial-3');
      
      const skillLevel = progressManager.getSkillLevel();
      expect(skillLevel).toBe('Advanced');
    });

    test('should handle edge cases', () => {
      const emptyProgressManager = new ProgressManager(mockProgressContainer, []);
      const skillLevel = emptyProgressManager.getSkillLevel();
      expect(skillLevel).toBe('Beginner');
    });
  });

  describe('updateUI', () => {
    test('should update progress circle percentage', () => {
      progressManager.markCompleted('tutorial-1');
      progressManager.updateUI();
      
      const percentageText = document.querySelector('.percentage');
      expect(percentageText.textContent).toContain('33');
    });

    test('should update progress circle visual', () => {
      progressManager.markCompleted('tutorial-1');
      progressManager.updateUI();
      
      const progressBar = document.querySelector('.progress-bar');
      const strokeDashoffset = progressBar.style.strokeDashoffset;
      expect(strokeDashoffset).toBeDefined();
    });

    test('should update statistics', () => {
      progressManager.markCompleted('tutorial-1');
      progressManager.updateProgress('tutorial-2', 50);
      progressManager.updateUI();
      
      const completedStat = document.querySelector('[data-stat="completed"] .stat-value');
      const inProgressStat = document.querySelector('[data-stat="inProgress"] .stat-value');
      const skillLevelStat = document.querySelector('[data-stat="skillLevel"] .stat-value');
      
      expect(completedStat.textContent).toBe('1');
      expect(inProgressStat.textContent).toBe('1');
      expect(skillLevelStat.textContent).toBe('Intermediate');
    });

    test('should handle missing DOM elements gracefully', () => {
      document.body.innerHTML = '<div></div>';
      progressManager.container = document.body.firstChild;
      
      expect(() => {
        progressManager.updateUI();
      }).not.toThrow();
    });
  });

  describe('getTutorialProgress', () => {
    test('should return progress for specific tutorial', () => {
      progressManager.updateProgress('tutorial-1', 75);
      const tutorialProgress = progressManager.getTutorialProgress('tutorial-1');
      
      expect(tutorialProgress).toMatchObject({
        completed: false,
        progress: 75
      });
    });

    test('should return undefined for non-existent tutorial', () => {
      const tutorialProgress = progressManager.getTutorialProgress('invalid-id');
      expect(tutorialProgress).toBeUndefined();
    });
  });

  describe('exportProgress', () => {
    test('should return progress data as JSON string', () => {
      progressManager.updateProgress('tutorial-1', 75);
      progressManager.markCompleted('tutorial-2');
      
      const exported = progressManager.exportProgress();
      const parsed = JSON.parse(exported);
      
      expect(parsed).toHaveProperty('tutorial-1');
      expect(parsed).toHaveProperty('tutorial-2');
      expect(parsed['tutorial-1'].progress).toBe(75);
      expect(parsed['tutorial-2'].completed).toBe(true);
    });

    test('should include metadata in export', () => {
      const exported = progressManager.exportProgress();
      const parsed = JSON.parse(exported);
      
      expect(parsed).toHaveProperty('_metadata');
      expect(parsed._metadata).toHaveProperty('exportDate');
      expect(parsed._metadata).toHaveProperty('version');
    });
  });

  describe('importProgress', () => {
    test('should import valid progress data', () => {
      const progressData = {
        'tutorial-1': { completed: true, progress: 100, lastAccessed: Date.now() },
        'tutorial-2': { completed: false, progress: 50, lastAccessed: Date.now() },
        _metadata: { exportDate: Date.now(), version: '1.0' }
      };
      
      const success = progressManager.importProgress(JSON.stringify(progressData));
      
      expect(success).toBe(true);
      expect(progressManager.progress['tutorial-1'].completed).toBe(true);
      expect(progressManager.progress['tutorial-2'].progress).toBe(50);
    });

    test('should reject invalid JSON', () => {
      const success = progressManager.importProgress('invalid-json');
      expect(success).toBe(false);
    });

    test('should reject data without metadata', () => {
      const invalidData = {
        'tutorial-1': { completed: true, progress: 100 }
      };
      
      const success = progressManager.importProgress(JSON.stringify(invalidData));
      expect(success).toBe(false);
    });

    test('should update UI after successful import', () => {
      const updateUISpy = jest.spyOn(progressManager, 'updateUI');
      const validData = {
        'tutorial-1': { completed: true, progress: 100, lastAccessed: Date.now() },
        _metadata: { exportDate: Date.now(), version: '1.0' }
      };
      
      progressManager.importProgress(JSON.stringify(validData));
      expect(updateUISpy).toHaveBeenCalled();
      updateUISpy.mockRestore();
    });
  });

  describe('getRecommendations', () => {
    test('should recommend beginner tutorials for new users', () => {
      const recommendations = progressManager.getRecommendations();
      const beginnerTutorials = recommendations.filter(t => t.difficulty === 'beginner');
      expect(beginnerTutorials.length).toBeGreaterThan(0);
    });

    test('should recommend next level tutorials for progressing users', () => {
      // Complete a beginner tutorial
      progressManager.markCompleted('tutorial-1');
      
      const recommendations = progressManager.getRecommendations();
      expect(recommendations.length).toBeGreaterThan(0);
    });

    test('should limit number of recommendations', () => {
      const recommendations = progressManager.getRecommendations();
      expect(recommendations.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Error Handling', () => {
    test('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      expect(() => {
        progressManager.updateProgress('tutorial-1', 50);
      }).not.toThrow();
    });

    test('should handle null/undefined tutorials', () => {
      expect(() => {
        new ProgressManager(mockProgressContainer, null);
      }).not.toThrow();
    });

    test('should handle null container', () => {
      expect(() => {
        new ProgressManager(null, mockTutorials);
      }).not.toThrow();
    });
  });

  describe('Event Dispatching', () => {
    test('should dispatch progress update events', () => {
      const eventSpy = jest.spyOn(progressManager.container, 'dispatchEvent');
      
      progressManager.updateProgress('tutorial-1', 50);
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'progressUpdate',
          detail: expect.objectContaining({
            tutorialId: 'tutorial-1',
            progress: 50
          })
        })
      );
      
      eventSpy.mockRestore();
    });

    test('should dispatch completion events', () => {
      const eventSpy = jest.spyOn(progressManager.container, 'dispatchEvent');
      
      progressManager.markCompleted('tutorial-1');
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'tutorialCompleted',
          detail: expect.objectContaining({
            tutorialId: 'tutorial-1'
          })
        })
      );
      
      eventSpy.mockRestore();
    });
  });
});