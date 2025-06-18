/**
 * Tutorial Data Definitions
 * ========================
 *
 * All tutorial metadata and configurations
 */

/**
 * Get all tutorial definitions
 * @returns {Array} Array of tutorial objects
 */
export const getTutorialData = () => [
  {
    id: 'component-development',
    title: 'Component Development Mastery',
    difficulty: 'beginner',
    topic: 'html-css',
    duration: 6,
    url: './component-development.html'
  },
  {
    id: 'theming',
    title: 'CSS Theming & Design Systems',
    difficulty: 'beginner',
    topic: 'html-css',
    duration: 4,
    url: './theming.html'
  },
  {
    id: 'build-process',
    title: 'Modern Build Process Mastery',
    difficulty: 'intermediate',
    topic: 'tooling',
    duration: 5,
    url: './build-process.html'
  },
  {
    id: 'deployment',
    title: 'Deployment & CI/CD Excellence',
    difficulty: 'intermediate',
    topic: 'deployment',
    duration: 5,
    url: './deployment.html'
  },
  {
    id: 'performance',
    title: 'Performance Optimization Mastery',
    difficulty: 'intermediate',
    topic: 'optimization',
    duration: 8,
    url: './performance.html'
  },
  {
    id: 'accessibility',
    title: 'Accessibility Best Practices',
    difficulty: 'intermediate',
    topic: 'optimization',
    duration: 7,
    url: './accessibility.html'
  },
  {
    id: 'seo',
    title: 'SEO Optimization Mastery',
    difficulty: 'advanced',
    topic: 'optimization',
    duration: 6,
    url: './seo.html'
  }
];

/**
 * Get tutorial categories and their display names
 * @returns {Object} Category mappings
 */
export const getTutorialCategories = () => ({
  'html-css': 'HTML & CSS',
  'tooling': 'Build Tools',
  'deployment': 'Deployment',
  'optimization': 'Optimization'
});

/**
 * Get difficulty levels and their properties
 * @returns {Object} Difficulty level configurations
 */
export const getDifficultyLevels = () => ({
  'beginner': {
    label: 'Beginner',
    color: '#28a745',
    order: 1
  },
  'intermediate': {
    label: 'Intermediate',
    color: '#ffc107',
    order: 2
  },
  'advanced': {
    label: 'Advanced',
    color: '#dc3545',
    order: 3
  }
});

/**
 * Get tutorial by ID
 * @param {string} tutorialId - Tutorial identifier
 * @returns {Object|null} Tutorial object or null if not found
 */
export const getTutorialById = tutorialId => getTutorialData().find(tutorial => tutorial.id === tutorialId) || null;

/**
 * Filter tutorials by criteria
 * @param {Array} tutorials - Tutorial array to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered tutorials
 */
export const filterTutorials = (tutorials, filters = {}) => {
  let filtered = [...tutorials];

  if (filters.difficulty && filters.difficulty !== 'all') {
    filtered = filtered.filter(tutorial => tutorial.difficulty === filters.difficulty);
  }

  if (filters.topic && filters.topic !== 'all') {
    filtered = filtered.filter(tutorial => tutorial.topic === filters.topic);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(tutorial =>
      tutorial.title.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
};

/**
 * Sort tutorials by specified criteria
 * @param {Array} tutorials - Tutorials to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted tutorials
 */
export const sortTutorials = (tutorials, sortBy = 'title') => {
  const sorted = [...tutorials];

  switch (sortBy) {
    case 'difficulty':
      const difficultyOrder = getDifficultyLevels();
      return sorted.sort((a, b) =>
        difficultyOrder[a.difficulty].order - difficultyOrder[b.difficulty].order
      );

    case 'duration':
      return sorted.sort((a, b) => a.duration - b.duration);

    case 'topic':
      return sorted.sort((a, b) => a.topic.localeCompare(b.topic));

    case 'title':
    default:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
};