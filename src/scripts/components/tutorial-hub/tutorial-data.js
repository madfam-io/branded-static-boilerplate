/**
 * Tutorial Data Definitions
 * ========================
 *
 * All tutorial metadata and configurations
 */

/**
 * Get beginner tutorials
 * @returns {Array} Array of beginner tutorial objects
 */
const getBeginnerTutorials = () => [
  {
    id: 'component-development',
    title: 'Component Development Mastery',
    difficulty: 'beginner',
    topic: 'html-css',
    duration: '6h',
    url: './component-development.html'
  },
  {
    id: 'theming',
    title: 'CSS Theming & Design Systems',
    difficulty: 'beginner',
    topic: 'html-css',
    duration: '4h',
    url: './theming.html'
  }
];

/**
 * Get intermediate tutorials
 * @returns {Array} Array of intermediate tutorial objects
 */
const getIntermediateTutorials = () => [
  {
    id: 'build-process',
    title: 'Modern Build Process Mastery',
    difficulty: 'intermediate',
    topic: 'tooling',
    duration: '5h',
    url: './build-process.html'
  },
  {
    id: 'deployment',
    title: 'Deployment & CI/CD Excellence',
    difficulty: 'intermediate',
    topic: 'deployment',
    duration: '5h',
    url: './deployment.html'
  },
  {
    id: 'performance',
    title: 'Performance Optimization Mastery',
    difficulty: 'intermediate',
    topic: 'optimization',
    duration: '8h',
    url: './performance.html'
  },
  {
    id: 'accessibility',
    title: 'Accessibility Best Practices',
    difficulty: 'intermediate',
    topic: 'optimization',
    duration: '7h',
    url: './accessibility.html'
  }
];

/**
 * Get advanced tutorials
 * @returns {Array} Array of advanced tutorial objects
 */
const getAdvancedTutorials = () => [
  {
    id: 'seo',
    title: 'SEO Optimization Mastery',
    difficulty: 'advanced',
    topic: 'optimization',
    duration: '6h',
    url: './seo.html'
  }
];

/**
 * Get all tutorial definitions
 * @returns {Array} Array of tutorial objects
 */
export const getTutorialData = () => [
  ...getBeginnerTutorials(),
  ...getIntermediateTutorials(),
  ...getAdvancedTutorials()
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
    name: 'Beginner',
    label: 'Beginner',
    color: '#28a745',
    order: 1
  },
  'intermediate': {
    name: 'Intermediate',
    label: 'Intermediate',
    color: '#ffc107',
    order: 2
  },
  'advanced': {
    name: 'Advanced',
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
export const getTutorialById = tutorialId => {
  if (!tutorialId) {
    return null;
  }
  return getTutorialData().find(tutorial => tutorial.id === tutorialId) || null;
};

/**
 * Filter tutorials by criteria
 * @param {Array} tutorials - Tutorial array to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered tutorials
 */
export const filterTutorials = (tutorials, filters = {}) => {
  if (!tutorials || !Array.isArray(tutorials)) {
    return [];
  }
  if (!filters || typeof filters !== 'object') {
    return [...tutorials];
  }

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
      tutorial.title.toLowerCase().includes(searchTerm) ||
      tutorial.topic.toLowerCase().includes(searchTerm)
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
  if (!tutorials || !Array.isArray(tutorials)) {
    return [];
  }
  const sorted = [...tutorials];

  switch (sortBy) {
    case 'difficulty': {
      const difficultyOrder = getDifficultyLevels();
      return sorted.sort((firstTutorial, secondTutorial) =>
        difficultyOrder[firstTutorial.difficulty].order -
        difficultyOrder[secondTutorial.difficulty].order
      );
    }

    case 'duration':
      return sorted.sort((firstTutorial, secondTutorial) => {
        const getDurationHours = duration => {
          const match = duration.match(/(?<hours>\d+)h/u);
          return match ? parseInt(match.groups.hours, 10) : 0;
        };
        return getDurationHours(firstTutorial.duration) -
          getDurationHours(secondTutorial.duration);
      });

    case 'topic':
      return sorted.sort((firstTutorial, secondTutorial) =>
        firstTutorial.topic.localeCompare(secondTutorial.topic));

    case 'title':
      return sorted.sort((firstTutorial, secondTutorial) =>
        firstTutorial.title.localeCompare(secondTutorial.title));

    default:
      return sorted;
  }
};