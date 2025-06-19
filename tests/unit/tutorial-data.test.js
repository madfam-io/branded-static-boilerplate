/**
 * Tutorial Data Tests
 * ===================
 * 
 * Tests for the tutorial data management and utility functions
 */

import {
  getTutorialData,
  getTutorialCategories,
  getDifficultyLevels,
  getTutorialById,
  filterTutorials,
  sortTutorials
} from '../../src/scripts/components/tutorial-hub/tutorial-data.js';

describe('Tutorial Data', () => {
  let tutorialData;

  beforeEach(() => {
    tutorialData = getTutorialData();
  });

  describe('getTutorialData', () => {
    test('should return an array of tutorials', () => {
      expect(Array.isArray(tutorialData)).toBe(true);
      expect(tutorialData.length).toBeGreaterThan(0);
    });

    test('should return tutorials with required properties', () => {
      tutorialData.forEach(tutorial => {
        expect(tutorial).toHaveProperty('id');
        expect(tutorial).toHaveProperty('title');
        expect(tutorial).toHaveProperty('difficulty');
        expect(tutorial).toHaveProperty('topic');
        expect(tutorial).toHaveProperty('duration');
        expect(tutorial).toHaveProperty('url');
        
        expect(typeof tutorial.id).toBe('string');
        expect(typeof tutorial.title).toBe('string');
        expect(typeof tutorial.difficulty).toBe('string');
        expect(typeof tutorial.topic).toBe('string');
        expect(typeof tutorial.duration).toBe('string');
        expect(typeof tutorial.url).toBe('string');
      });
    });

    test('should return tutorials with unique ids', () => {
      const ids = tutorialData.map(tutorial => tutorial.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    test('should return tutorials with valid difficulty levels', () => {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      tutorialData.forEach(tutorial => {
        expect(validDifficulties).toContain(tutorial.difficulty);
      });
    });
  });

  describe('getTutorialCategories', () => {
    test('should return an object with category mappings', () => {
      const categories = getTutorialCategories();
      expect(typeof categories).toBe('object');
      expect(categories).not.toBeNull();
    });

    test('should include all tutorial topics in categories', () => {
      const categories = getTutorialCategories();
      const tutorialTopics = [...new Set(tutorialData.map(t => t.topic))];
      
      tutorialTopics.forEach(topic => {
        expect(Object.values(categories)).toContain(topic);
      });
    });

    test('should have string values for all category keys', () => {
      const categories = getTutorialCategories();
      Object.values(categories).forEach(category => {
        expect(typeof category).toBe('string');
      });
    });
  });

  describe('getDifficultyLevels', () => {
    test('should return an object with difficulty level configurations', () => {
      const levels = getDifficultyLevels();
      expect(typeof levels).toBe('object');
      expect(levels).not.toBeNull();
    });

    test('should include all difficulty levels from tutorials', () => {
      const levels = getDifficultyLevels();
      const tutorialDifficulties = [...new Set(tutorialData.map(t => t.difficulty))];
      
      tutorialDifficulties.forEach(difficulty => {
        expect(levels).toHaveProperty(difficulty);
      });
    });

    test('should have valid configuration for each difficulty level', () => {
      const levels = getDifficultyLevels();
      Object.entries(levels).forEach(([key, config]) => {
        expect(typeof config).toBe('object');
        expect(config).toHaveProperty('name');
        expect(config).toHaveProperty('color');
        expect(typeof config.name).toBe('string');
        expect(typeof config.color).toBe('string');
      });
    });
  });

  describe('getTutorialById', () => {
    test('should return tutorial for valid id', () => {
      const firstTutorial = tutorialData[0];
      const foundTutorial = getTutorialById(firstTutorial.id);
      
      expect(foundTutorial).toEqual(firstTutorial);
    });

    test('should return undefined for invalid id', () => {
      const foundTutorial = getTutorialById('non-existent-id');
      expect(foundTutorial).toBeUndefined();
    });

    test('should return undefined for null/undefined id', () => {
      expect(getTutorialById(null)).toBeUndefined();
      expect(getTutorialById(undefined)).toBeUndefined();
      expect(getTutorialById('')).toBeUndefined();
    });

    test('should handle string and number ids', () => {
      const firstTutorial = tutorialData[0];
      const foundTutorial = getTutorialById(firstTutorial.id);
      
      expect(foundTutorial).toBeTruthy();
      expect(foundTutorial.id).toBe(firstTutorial.id);
    });
  });

  describe('filterTutorials', () => {
    test('should return all tutorials when no filters provided', () => {
      const filtered = filterTutorials(tutorialData, {});
      expect(filtered).toEqual(tutorialData);
    });

    test('should filter by difficulty', () => {
      const beginner = filterTutorials(tutorialData, { difficulty: 'beginner' });
      expect(beginner.every(t => t.difficulty === 'beginner')).toBe(true);
      
      const intermediate = filterTutorials(tutorialData, { difficulty: 'intermediate' });
      expect(intermediate.every(t => t.difficulty === 'intermediate')).toBe(true);
    });

    test('should filter by topic', () => {
      const topics = [...new Set(tutorialData.map(t => t.topic))];
      if (topics.length > 0) {
        const filtered = filterTutorials(tutorialData, { topic: topics[0] });
        expect(filtered.every(t => t.topic === topics[0])).toBe(true);
      }
    });

    test('should filter by search term in title', () => {
      const tutorialWithSpecificTitle = tutorialData.find(t => t.title.length > 5);
      if (tutorialWithSpecificTitle) {
        const searchTerm = tutorialWithSpecificTitle.title.substring(0, 3);
        const filtered = filterTutorials(tutorialData, { search: searchTerm });
        
        expect(filtered.some(t => t.id === tutorialWithSpecificTitle.id)).toBe(true);
        filtered.forEach(t => {
          expect(t.title.toLowerCase()).toContain(searchTerm.toLowerCase());
        });
      }
    });

    test('should filter by search term in topic', () => {
      const tutorialWithSpecificTopic = tutorialData.find(t => t.topic.length > 3);
      if (tutorialWithSpecificTopic) {
        const searchTerm = tutorialWithSpecificTopic.topic.substring(0, 3);
        const filtered = filterTutorials(tutorialData, { search: searchTerm });
        
        expect(filtered.length).toBeGreaterThan(0);
      }
    });

    test('should handle case-insensitive search', () => {
      const tutorialWithTitle = tutorialData.find(t => t.title.includes('C'));
      if (tutorialWithTitle) {
        const upperCase = filterTutorials(tutorialData, { search: 'CSS' });
        const lowerCase = filterTutorials(tutorialData, { search: 'css' });
        
        expect(upperCase.length).toBe(lowerCase.length);
      }
    });

    test('should combine multiple filters', () => {
      const beginnerTutorials = tutorialData.filter(t => t.difficulty === 'beginner');
      if (beginnerTutorials.length > 0) {
        const filtered = filterTutorials(tutorialData, {
          difficulty: 'beginner',
          search: beginnerTutorials[0].title.substring(0, 2)
        });
        
        expect(filtered.every(t => t.difficulty === 'beginner')).toBe(true);
      }
    });

    test('should return empty array when no matches found', () => {
      const filtered = filterTutorials(tutorialData, { search: 'nonexistentsearchterm123' });
      expect(filtered).toEqual([]);
    });

    test('should handle null/undefined input gracefully', () => {
      expect(filterTutorials(null, {})).toEqual([]);
      expect(filterTutorials(undefined, {})).toEqual([]);
      expect(filterTutorials([], {})).toEqual([]);
    });

    test('should handle invalid filter object', () => {
      expect(filterTutorials(tutorialData, null)).toEqual(tutorialData);
      expect(filterTutorials(tutorialData, undefined)).toEqual(tutorialData);
    });
  });

  describe('sortTutorials', () => {
    test('should sort by difficulty (beginner first)', () => {
      const sorted = sortTutorials([...tutorialData], 'difficulty');
      const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
      
      for (let i = 1; i < sorted.length; i++) {
        const prevIndex = difficultyOrder.indexOf(sorted[i - 1].difficulty);
        const currIndex = difficultyOrder.indexOf(sorted[i].difficulty);
        expect(prevIndex).toBeLessThanOrEqual(currIndex);
      }
    });

    test('should sort by duration (shortest first)', () => {
      const sorted = sortTutorials([...tutorialData], 'duration');
      
      // Convert duration strings to minutes for comparison
      const getDurationMinutes = (duration) => {
        const match = duration.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      
      for (let i = 1; i < sorted.length; i++) {
        const prevDuration = getDurationMinutes(sorted[i - 1].duration);
        const currDuration = getDurationMinutes(sorted[i].duration);
        expect(prevDuration).toBeLessThanOrEqual(currDuration);
      }
    });

    test('should sort by topic alphabetically', () => {
      const sorted = sortTutorials([...tutorialData], 'topic');
      
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].topic.localeCompare(sorted[i].topic)).toBeLessThanOrEqual(0);
      }
    });

    test('should sort by title alphabetically', () => {
      const sorted = sortTutorials([...tutorialData], 'alphabetical');
      
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].title.localeCompare(sorted[i].title)).toBeLessThanOrEqual(0);
      }
    });

    test('should return original array for invalid sort type', () => {
      const original = [...tutorialData];
      const sorted = sortTutorials(original, 'invalid-sort-type');
      expect(sorted).toEqual(original);
    });

    test('should handle null/undefined input gracefully', () => {
      expect(sortTutorials(null, 'difficulty')).toEqual([]);
      expect(sortTutorials(undefined, 'difficulty')).toEqual([]);
      expect(sortTutorials([], 'difficulty')).toEqual([]);
    });

    test('should not mutate original array', () => {
      const original = [...tutorialData];
      const originalCopy = [...tutorialData];
      const sorted = sortTutorials(original, 'difficulty');
      
      expect(original).toEqual(originalCopy);
      expect(sorted).not.toBe(original);
    });

    test('should handle single tutorial array', () => {
      const singleTutorial = [tutorialData[0]];
      const sorted = sortTutorials(singleTutorial, 'difficulty');
      expect(sorted).toEqual(singleTutorial);
    });

    test('should preserve tutorial object structure after sorting', () => {
      const sorted = sortTutorials([...tutorialData], 'difficulty');
      
      sorted.forEach(tutorial => {
        expect(tutorial).toHaveProperty('id');
        expect(tutorial).toHaveProperty('title');
        expect(tutorial).toHaveProperty('difficulty');
        expect(tutorial).toHaveProperty('topic');
        expect(tutorial).toHaveProperty('duration');
        expect(tutorial).toHaveProperty('url');
      });
    });
  });

  describe('Data Consistency', () => {
    test('should have consistent data structure across all functions', () => {
      const data = getTutorialData();
      const categories = getTutorialCategories();
      const levels = getDifficultyLevels();
      
      // Check that all tutorial topics exist in categories
      const tutorialTopics = [...new Set(data.map(t => t.topic))];
      const categoryValues = Object.values(categories);
      
      tutorialTopics.forEach(topic => {
        expect(categoryValues).toContain(topic);
      });
      
      // Check that all tutorial difficulties exist in levels
      const tutorialDifficulties = [...new Set(data.map(t => t.difficulty))];
      
      tutorialDifficulties.forEach(difficulty => {
        expect(levels).toHaveProperty(difficulty);
      });
    });

    test('should have valid URLs for all tutorials', () => {
      tutorialData.forEach(tutorial => {
        expect(tutorial.url).toBeTruthy();
        expect(typeof tutorial.url).toBe('string');
        expect(tutorial.url.length).toBeGreaterThan(0);
      });
    });

    test('should have reasonable duration formats', () => {
      tutorialData.forEach(tutorial => {
        expect(tutorial.duration).toMatch(/\d+\s*(min|hour|hr)/i);
      });
    });

    test('should have non-empty titles', () => {
      tutorialData.forEach(tutorial => {
        expect(tutorial.title.trim().length).toBeGreaterThan(0);
      });
    });
  });
});