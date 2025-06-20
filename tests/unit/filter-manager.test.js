/**
 * Filter Manager Tests
 * ====================
 * 
 * Tests for the tutorial filtering and search functionality
 */

import { FilterManager } from '../../src/scripts/components/tutorial-hub/filter-manager.js';

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

describe('FilterManager', () => {
  let filterManager;
  let mockTutorials;
  let mockContainer;
  let mockSearchInput;
  let mockDifficultySelect;
  let mockTopicSelect;
  let mockSortSelect;
  let mockResetButton;
  let mockUpdateCallback;

  beforeEach(() => {
    // Clear localStorage
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();

    // Create mock DOM elements
    document.body.innerHTML = `
      <div id="tutorial-container"></div>
      <input id="search-input" type="text">
      <select id="difficulty-select">
        <option value="">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select id="topic-select">
        <option value="">All Topics</option>
        <option value="CSS">CSS</option>
        <option value="JavaScript">JavaScript</option>
      </select>
      <select id="sort-select">
        <option value="difficulty">Difficulty</option>
        <option value="duration">Duration</option>
        <option value="topic">Topic</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
      <button id="reset-filters">Reset</button>
    `;

    mockContainer = document.getElementById('tutorial-container');
    mockSearchInput = document.getElementById('search-input');
    mockDifficultySelect = document.getElementById('difficulty-select');
    mockTopicSelect = document.getElementById('topic-select');
    mockSortSelect = document.getElementById('sort-select');
    mockResetButton = document.getElementById('reset-filters');

    mockTutorials = [
      {
        id: 'tutorial-1',
        title: 'CSS Flexbox Basics',
        difficulty: 'beginner',
        topic: 'CSS',
        duration: '15 min',
        url: '/tutorials/flexbox'
      },
      {
        id: 'tutorial-2',
        title: 'Advanced JavaScript',
        difficulty: 'advanced',
        topic: 'JavaScript',
        duration: '45 min',
        url: '/tutorials/js-advanced'
      },
      {
        id: 'tutorial-3',
        title: 'CSS Grid Layout',
        difficulty: 'intermediate',
        topic: 'CSS',
        duration: '30 min',
        url: '/tutorials/css-grid'
      }
    ];

    mockUpdateCallback = jest.fn();

    filterManager = new FilterManager(
      mockTutorials,
      mockUpdateCallback
    );
  });

  afterEach(() => {
    if (filterManager && typeof filterManager.destroy === 'function') {
      filterManager.destroy();
    }
  });

  describe('constructor', () => {
    test('should initialize with provided parameters', () => {
      expect(filterManager.tutorials).toBe(mockTutorials);
      expect(filterManager.onFilterChange).toBe(mockUpdateCallback);
    });

    test('should initialize with default filters', () => {
      expect(filterManager.currentFilters).toEqual({
        difficulty: '',
        topic: '',
        sort: 'difficulty',
        search: ''
      });
    });

    test('should setup event listeners', () => {
      const addEventListenerSpy = jest.spyOn(mockSearchInput, 'addEventListener');
      
      new FilterManager(mockTutorials, mockUpdateCallback);
      
      expect(addEventListenerSpy).toHaveBeenCalled();
      addEventListenerSpy.mockRestore();
    });

    test('should load saved filters from localStorage', () => {
      const savedFilters = {
        difficulty: 'beginner',
        topic: 'CSS',
        search: 'flex',
        sort: 'alphabetical'
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));
      
      const newFilterManager = new FilterManager(
        mockTutorials,
        mockUpdateCallback
      );
      
      expect(newFilterManager.currentFilters).toEqual(savedFilters);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('bsb-tutorial-filters');
    });

    test('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      expect(() => {
        new FilterManager(mockTutorials, mockUpdateCallback);
      }).not.toThrow();
    });
  });

  describe('applyFilters', () => {
    test('should filter tutorials by difficulty', () => {
      filterManager.currentFilters.difficulty = 'beginner';
      const result = filterManager.applyFilters();
      
      expect(result.length).toBe(1);
      expect(result[0].difficulty).toBe('beginner');
    });

    test('should filter tutorials by topic', () => {
      filterManager.currentFilters.topic = 'CSS';
      const result = filterManager.applyFilters();
      
      expect(result.length).toBe(2);
      expect(result.every(t => t.topic === 'CSS')).toBe(true);
    });

    test('should filter tutorials by search term', () => {
      filterManager.currentFilters.search = 'flex';
      const result = filterManager.applyFilters();
      
      expect(result.length).toBe(1);
      expect(result[0].title.toLowerCase()).toContain('flex');
    });

    test('should combine multiple filters', () => {
      filterManager.currentFilters.difficulty = 'beginner';
      filterManager.currentFilters.topic = 'CSS';
      const result = filterManager.applyFilters();
      
      expect(result.length).toBe(1);
      expect(result[0].difficulty).toBe('beginner');
      expect(result[0].topic).toBe('CSS');
    });

    test('should sort results by difficulty', () => {
      filterManager.currentFilters.sort = 'difficulty';
      const result = filterManager.applyFilters();
      
      const difficulties = result.map(t => t.difficulty);
      expect(difficulties.indexOf('beginner')).toBeLessThan(difficulties.indexOf('intermediate'));
    });

    test('should sort results alphabetically', () => {
      filterManager.currentFilters.sort = 'alphabetical';
      const result = filterManager.applyFilters();
      
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].title.localeCompare(result[i].title)).toBeLessThanOrEqual(0);
      }
    });

    test('should return all tutorials when no filters applied', () => {
      const result = filterManager.applyFilters();
      expect(result.length).toBe(mockTutorials.length);
    });

    test('should call updateCallback with filtered results', () => {
      filterManager.applyFilters();
      expect(mockUpdateCallback).toHaveBeenCalled();
    });
  });

  describe('updateFilter', () => {
    test('should update filter value and apply filters', () => {
      filterManager.updateFilter('difficulty', 'beginner');
      
      expect(filterManager.currentFilters.difficulty).toBe('beginner');
      expect(mockUpdateCallback).toHaveBeenCalled();
    });

    test('should save filters to localStorage', () => {
      filterManager.updateFilter('topic', 'CSS');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bsb-tutorial-filters',
        JSON.stringify(filterManager.currentFilters)
      );
    });

    test('should update DOM element values', () => {
      filterManager.updateFilter('difficulty', 'beginner');
      expect(mockDifficultySelect.value).toBe('beginner');
      
      filterManager.updateFilter('topic', 'CSS');
      expect(mockTopicSelect.value).toBe('CSS');
      
      filterManager.updateFilter('search', 'test');
      expect(mockSearchInput.value).toBe('test');
      
      filterManager.updateFilter('sort', 'alphabetical');
      expect(mockSortSelect.value).toBe('alphabetical');
    });

    test('should handle invalid filter types gracefully', () => {
      expect(() => {
        filterManager.updateFilter('invalid', 'value');
      }).not.toThrow();
    });
  });

  describe('resetFilters', () => {
    test('should reset all filters to defaults', () => {
      // Set some filters first
      filterManager.updateFilter('difficulty', 'beginner');
      filterManager.updateFilter('topic', 'CSS');
      filterManager.updateFilter('search', 'test');
      
      filterManager.resetFilters();
      
      expect(filterManager.currentFilters).toEqual({
        difficulty: '',
        topic: '',
        search: '',
        sort: 'difficulty'
      });
    });

    test('should update DOM elements to default values', () => {
      filterManager.updateFilter('difficulty', 'beginner');
      filterManager.resetFilters();
      
      expect(mockDifficultySelect.value).toBe('');
      expect(mockTopicSelect.value).toBe('');
      expect(mockSearchInput.value).toBe('');
      expect(mockSortSelect.value).toBe('difficulty');
    });

    test('should save reset filters to localStorage', () => {
      filterManager.resetFilters();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bsb-tutorial-filters',
        expect.any(String)
      );
      
      const savedFilters = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedFilters).toEqual({
        difficulty: '',
        topic: '',
        search: '',
        sort: 'difficulty'
      });
    });

    test('should call updateCallback after reset', () => {
      mockUpdateCallback.mockClear();
      filterManager.resetFilters();
      expect(mockUpdateCallback).toHaveBeenCalled();
    });
  });

  describe('Event Listeners', () => {
    test('should handle search input changes', () => {
      const updateFilterSpy = jest.spyOn(filterManager, 'updateFilter');
      
      mockSearchInput.value = 'flex';
      mockSearchInput.dispatchEvent(new Event('input'));
      
      // Allow for debouncing
      setTimeout(() => {
        expect(updateFilterSpy).toHaveBeenCalledWith('search', 'flex');
      }, 350);
      
      updateFilterSpy.mockRestore();
    });

    test('should handle difficulty select changes', () => {
      const updateFilterSpy = jest.spyOn(filterManager, 'updateFilter');
      
      mockDifficultySelect.value = 'beginner';
      mockDifficultySelect.dispatchEvent(new Event('change'));
      
      expect(updateFilterSpy).toHaveBeenCalledWith('difficulty', 'beginner');
      updateFilterSpy.mockRestore();
    });

    test('should handle topic select changes', () => {
      const updateFilterSpy = jest.spyOn(filterManager, 'updateFilter');
      
      mockTopicSelect.value = 'CSS';
      mockTopicSelect.dispatchEvent(new Event('change'));
      
      expect(updateFilterSpy).toHaveBeenCalledWith('topic', 'CSS');
      updateFilterSpy.mockRestore();
    });

    test('should handle sort select changes', () => {
      const updateFilterSpy = jest.spyOn(filterManager, 'updateFilter');
      
      mockSortSelect.value = 'alphabetical';
      mockSortSelect.dispatchEvent(new Event('change'));
      
      expect(updateFilterSpy).toHaveBeenCalledWith('sort', 'alphabetical');
      updateFilterSpy.mockRestore();
    });

    test('should handle reset button clicks', () => {
      const resetFiltersSpy = jest.spyOn(filterManager, 'resetFilters');
      
      mockResetButton.click();
      
      expect(resetFiltersSpy).toHaveBeenCalled();
      resetFiltersSpy.mockRestore();
    });
  });

  describe('Search Debouncing', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    test('should debounce search input', () => {
      const updateFilterSpy = jest.spyOn(filterManager, 'updateFilter');
      
      // Simulate rapid typing
      mockSearchInput.value = 'f';
      mockSearchInput.dispatchEvent(new Event('input'));
      
      mockSearchInput.value = 'fl';
      mockSearchInput.dispatchEvent(new Event('input'));
      
      mockSearchInput.value = 'flex';
      mockSearchInput.dispatchEvent(new Event('input'));
      
      // Should not be called immediately
      expect(updateFilterSpy).not.toHaveBeenCalled();
      
      // Fast forward time to trigger debounce
      jest.advanceTimersByTime(300);
      
      // Should be called after debounce delay
      expect(updateFilterSpy).toHaveBeenCalledWith('search', 'flex');
      expect(updateFilterSpy).toHaveBeenCalledTimes(1);
      updateFilterSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing DOM elements gracefully', () => {
      document.body.innerHTML = '';
      
      expect(() => {
        new FilterManager(mockTutorials, mockUpdateCallback);
      }).not.toThrow();
    });

    test('should handle null tutorials array', () => {
      expect(() => {
        new FilterManager(null, mockUpdateCallback);
      }).not.toThrow();
    });

    test('should handle localStorage errors', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      expect(() => {
        filterManager.updateFilter('difficulty', 'beginner');
      }).not.toThrow();
    });

    test('should handle invalid callback', () => {
      const invalidFilterManager = new FilterManager(
        mockTutorials,
        'not-a-function'
      );
      
      expect(() => {
        invalidFilterManager.applyFilters();
      }).not.toThrow();
    });
  });

  describe('getFilteredCount', () => {
    test('should return count of filtered tutorials', () => {
      filterManager.currentFilters.difficulty = 'beginner';
      const count = filterManager.getFilteredCount();
      expect(count).toBe(1);
    });

    test('should return total count when no filters applied', () => {
      const count = filterManager.getFilteredCount();
      expect(count).toBe(mockTutorials.length);
    });
  });

  describe('getCurrentFilters', () => {
    test('should return current filter state', () => {
      filterManager.currentFilters.difficulty = 'beginner';
      const filters = filterManager.getCurrentFilters();
      
      expect(filters).toEqual({
        difficulty: 'beginner',
        topic: '',
        search: '',
        sort: 'difficulty'
      });
    });

    test('should return a copy, not reference', () => {
      const filters = filterManager.getCurrentFilters();
      filters.difficulty = 'advanced';
      
      expect(filterManager.currentFilters.difficulty).toBe('');
    });
  });
});