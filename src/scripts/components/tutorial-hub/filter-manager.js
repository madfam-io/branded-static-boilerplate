/**
 * Tutorial Hub Filter Manager
 * ===========================
 *
 * Manages filtering, sorting, and search functionality for tutorials
 */

// Filter constants
const FILTER_CONSTANTS = {
  SEARCH_DEBOUNCE_DELAY: 300
};

/**
 * Tutorial filter manager class
 */
export class FilterManager {
  constructor(tutorials, onFilterChange) {
    this.tutorials = tutorials || [];
    this.onFilterChange = onFilterChange;
    this.currentFilters = {
      difficulty: '',
      topic: '',
      sort: 'difficulty',
      search: ''
    };
    this.searchTimeout = null;

    this.init();
  }

  /**
   * Initialize filter manager
   */
  init() {
    this.setupFilterElements();
    this.restoreFilterStates();
    this.bindFilterEvents();
    this.applyFilters();
  }

  /**
   * Setup filter DOM elements
   */
  setupFilterElements() {
    this.difficultyFilter = document.getElementById('difficulty-filter') || document.getElementById('difficulty-select');
    this.topicFilter = document.getElementById('topic-filter') || document.getElementById('topic-select');
    this.sortSelect = document.getElementById('sort-select');
    this.searchInput = document.getElementById('search-input');
    this.resetButton = document.getElementById('reset-filters');
  }

  /**
   * Update filter input value
   * @param {HTMLElement} element - Filter element
   * @param {string} value - Value to set
   */
  updateFilterValue(element, value) {
    if (element) {
      element.value = value || '';
    }
  }

  /**
   * Restore filter states from localStorage
   */
  restoreFilterStates() {
    const savedFilters = localStorage.getItem('bsb-tutorial-filters');
    if (!savedFilters) {
      return;
    }

    try {
      const filters = JSON.parse(savedFilters);
      this.currentFilters = { ...this.currentFilters, ...filters };

      this.updateFilterValue(this.difficultyFilter, this.currentFilters.difficulty);
      this.updateFilterValue(this.topicFilter, this.currentFilters.topic);
      this.updateFilterValue(this.sortSelect, this.currentFilters.sort || 'difficulty');

      if (this.currentFilters.search) {
        this.updateFilterValue(this.searchInput, this.currentFilters.search);
      }
    } catch (error) {
      console.warn('Failed to restore filter state:', error);
    }
  }

  /**
   * Bind filter event listeners
   */
  bindFilterEvents() {
    if (this.difficultyFilter) {
      this.difficultyFilter.addEventListener('change', () => {
        this.updateFilter('difficulty', this.difficultyFilter.value);
      });
    }

    if (this.topicFilter) {
      this.topicFilter.addEventListener('change', () => {
        this.updateFilter('topic', this.topicFilter.value);
      });
    }

    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', () => {
        this.updateFilter('sort', this.sortSelect.value);
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.updateFilter('search', this.searchInput.value);
        }, FILTER_CONSTANTS.SEARCH_DEBOUNCE_DELAY); // Debounce search
      });
    }

    if (this.resetButton) {
      this.resetButton.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }

  /**
   * Save current filter states to localStorage
   */
  saveFilters() {
    try {
      localStorage.setItem('bsb-tutorial-filters', JSON.stringify(this.currentFilters));
    } catch (error) {
      console.warn('Failed to save filter state:', error);
    }
  }

  /**
   * Apply current filters to tutorials
   */
  applyFilters() {
    let filteredTutorials = this.filterTutorials(this.tutorials, this.currentFilters);
    filteredTutorials = this.sortTutorials(filteredTutorials, this.currentFilters.sort);

    if (typeof this.onFilterChange === 'function') {
      this.onFilterChange(filteredTutorials);
    }

    return filteredTutorials;
  }

  /**
   * Filter tutorials based on criteria
   * @param {Array} tutorials - Tutorials to filter
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered tutorials
   */
  filterTutorials(tutorials, filters) {
    let filtered = [...tutorials];

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'all' && filters.difficulty !== '') {
      filtered = filtered.filter(tutorial => tutorial.difficulty === filters.difficulty);
    }

    // Filter by topic
    if (filters.topic && filters.topic !== 'all' && filters.topic !== '') {
      filtered = filtered.filter(tutorial => tutorial.topic === filters.topic);
    }

    // Filter by search term
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchTerm) ||
        tutorial.topic.toLowerCase().includes(searchTerm) ||
        tutorial.difficulty.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Sort tutorials by specified criteria
   * @param {Array} tutorials - Tutorials to sort
   * @param {string} sortBy - Sort criteria
   * @returns {Array} Sorted tutorials
   */
  sortTutorials(tutorials, sortBy) {
    const sorted = [...tutorials];

    switch (sortBy) {
      case 'difficulty': {
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return sorted.sort((tutorialA, tutorialB) =>
          difficultyOrder[tutorialA.difficulty] - difficultyOrder[tutorialB.difficulty]
        );
      }

      case 'duration':
        return sorted.sort((tutorialA, tutorialB) =>
          tutorialA.duration - tutorialB.duration);

      case 'topic':
        return sorted.sort((tutorialA, tutorialB) =>
          tutorialA.topic.localeCompare(tutorialB.topic));

      case 'alphabetical':
        return sorted.sort((tutorialA, tutorialB) =>
          tutorialA.title.localeCompare(tutorialB.title));

      case 'recommended':
      default:
        // Keep original order for recommended
        return sorted;
    }
  }

  /**
   * Get current filter summary
   * @returns {Object} Current filter state
   */
  getCurrentFilters() {
    return { ...this.currentFilters };
  }

  /**
   * Reset all filters to default state
   */
  resetFilters() {
    this.currentFilters = {
      difficulty: '',
      topic: '',
      sort: 'difficulty',
      search: ''
    };

    // Update UI elements
    if (this.difficultyFilter) {
      this.difficultyFilter.value = '';
    }
    if (this.topicFilter) {
      this.topicFilter.value = '';
    }
    if (this.sortSelect) {
      this.sortSelect.value = 'difficulty';
    }
    if (this.searchInput) {
      this.searchInput.value = '';
    }

    this.saveFilters();
    this.applyFilters();
  }

  /**
   * Get available filter options
   * @returns {Object} Available filter options
   */
  getFilterOptions() {
    const difficulties = [...new Set(this.tutorials.map(tutorial => tutorial.difficulty))];
    const topics = [...new Set(this.tutorials.map(tutorial => tutorial.topic))];

    return {
      difficulties: difficulties.sort(),
      topics: topics.sort()
    };
  }

  /**
   * Update a specific filter
   * @param {string} filterType - Type of filter to update
   * @param {string} value - New value for the filter
   */
  updateFilter(filterType, value) {
    this.currentFilters[filterType] = value;

    // Update DOM elements if needed
    if (filterType === 'difficulty' && this.difficultyFilter) {
      this.difficultyFilter.value = value;
    } else if (filterType === 'topic' && this.topicFilter) {
      this.topicFilter.value = value;
    } else if (filterType === 'search' && this.searchInput) {
      this.searchInput.value = value;
    } else if (filterType === 'sort' && this.sortSelect) {
      this.sortSelect.value = value;
    }

    this.saveFilters();
    this.applyFilters();
  }

  /**
   * Get filtered count
   * @returns {number} Number of filtered tutorials
   */
  getFilteredCount() {
    const filtered = this.filterTutorials(this.tutorials, this.currentFilters);
    return filtered.length;
  }

  /**
   * Destroy filter manager and clean up
   */
  destroy() {
    // Clear timeout if exists
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
}