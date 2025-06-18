/**
 * Tutorial Hub Filter Manager
 * ===========================
 *
 * Manages filtering, sorting, and search functionality for tutorials
 */

/**
 * Tutorial filter manager class
 */
export class FilterManager {
  constructor(tutorials, onFilterChange) {
    this.tutorials = tutorials;
    this.onFilterChange = onFilterChange;
    this.currentFilters = {
      difficulty: 'all',
      topic: 'all',
      sort: 'recommended'
    };

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
    this.difficultyFilter = document.getElementById('difficulty-filter');
    this.topicFilter = document.getElementById('topic-filter');
    this.sortSelect = document.getElementById('sort-select');
    this.searchInput = document.getElementById('search-input');
  }

  /**
   * Restore filter states from localStorage
   */
  restoreFilterStates() {
    const savedFilters = localStorage.getItem('tutorial-hub-filters');

    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        this.currentFilters = { ...this.currentFilters, ...filters };

        if (this.difficultyFilter) {
          this.difficultyFilter.value = this.currentFilters.difficulty;
        }
        if (this.topicFilter) {
          this.topicFilter.value = this.currentFilters.topic;
        }
        if (this.sortSelect) {
          this.sortSelect.value = this.currentFilters.sort;
        }
      } catch (error) {
        console.warn('Failed to restore filter state:', error);
      }
    }
  }

  /**
   * Bind filter event listeners
   */
  bindFilterEvents() {
    if (this.difficultyFilter) {
      this.difficultyFilter.addEventListener('change', () => {
        this.currentFilters.difficulty = this.difficultyFilter.value;
        this.saveFilters();
        this.applyFilters();
      });
    }

    if (this.topicFilter) {
      this.topicFilter.addEventListener('change', () => {
        this.currentFilters.topic = this.topicFilter.value;
        this.saveFilters();
        this.applyFilters();
      });
    }

    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', () => {
        this.currentFilters.sort = this.sortSelect.value;
        this.saveFilters();
        this.applyFilters();
      });
    }

    if (this.searchInput) {
      let searchTimeout;
      this.searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.currentFilters.search = this.searchInput.value;
          this.applyFilters();
        }, 300); // Debounce search
      });
    }
  }

  /**
   * Save current filter states to localStorage
   */
  saveFilters() {
    try {
      localStorage.setItem('tutorial-hub-filters', JSON.stringify(this.currentFilters));
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

    if (this.onFilterChange) {
      this.onFilterChange(filteredTutorials);
    }
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
    if (filters.difficulty && filters.difficulty !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.difficulty === filters.difficulty);
    }

    // Filter by topic
    if (filters.topic && filters.topic !== 'all') {
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
      case 'difficulty':
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return sorted.sort((a, b) =>
          difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        );

      case 'duration':
        return sorted.sort((a, b) => a.duration - b.duration);

      case 'topic':
        return sorted.sort((a, b) => a.topic.localeCompare(b.topic));

      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));

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
      difficulty: 'all',
      topic: 'all',
      sort: 'recommended',
      search: ''
    };

    // Update UI elements
    if (this.difficultyFilter) {this.difficultyFilter.value = 'all';}
    if (this.topicFilter) {this.topicFilter.value = 'all';}
    if (this.sortSelect) {this.sortSelect.value = 'recommended';}
    if (this.searchInput) {this.searchInput.value = '';}

    this.saveFilters();
    this.applyFilters();
  }

  /**
   * Get available filter options
   * @returns {Object} Available filter options
   */
  getFilterOptions() {
    const difficulties = [...new Set(this.tutorials.map(t => t.difficulty))];
    const topics = [...new Set(this.tutorials.map(t => t.topic))];

    return {
      difficulties: difficulties.sort(),
      topics: topics.sort()
    };
  }
}