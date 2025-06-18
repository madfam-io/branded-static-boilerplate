/**
 * Web Accessibility Interactive Tutorial
 * =====================================
 *
 * Learn web accessibility principles with hands-on examples and live testing.
 */

import { allLessons } from './accessibility/lessons.js';
import { advancedLessons } from './accessibility/advanced-lessons.js';

export const accessibilityTutorial = {
  id: 'accessibility',
  title: 'Web Accessibility Essentials',
  description: 'Build inclusive web experiences that work for everyone',
  difficulty: 'intermediate',
  estimatedTime: '25 minutes',

  lessons: [...allLessons, ...advancedLessons],

  resources: [
    {
      title: 'WCAG 2.1 Guidelines',
      url: 'https://www.w3.org/WAI/WCAG21/quickref/',
      description: 'Official Web Content Accessibility Guidelines'
    },
    {
      title: 'ARIA Authoring Practices',
      url: 'https://www.w3.org/WAI/ARIA/apg/',
      description: 'Best practices for ARIA implementation'
    },
    {
      title: 'WebAIM Contrast Checker',
      url: 'https://webaim.org/resources/contrastchecker/',
      description: 'Professional color contrast testing tool'
    },
    {
      title: 'Screen Reader Testing Guide',
      url: 'https://webaim.org/articles/screenreader_testing/',
      description: 'How to test with different screen readers'
    }
  ],

  prerequisites: [
    'Basic HTML knowledge',
    'Understanding of CSS',
    'Familiarity with JavaScript events'
  ],

  learningObjectives: [
    'Understand and implement semantic HTML',
    'Use ARIA labels and roles correctly',
    'Create keyboard-navigable interfaces',
    'Meet WCAG color contrast requirements',
    'Build accessible forms with proper validation',
    'Test with screen readers and assistive technologies'
  ],

  assessment: {
    questions: [
      {
        question: 'What is the minimum contrast ratio for normal text in WCAG AA?',
        options: ['3:1', '4.5:1', '7:1', '10:1'],
        correct: 1,
        explanation: 'WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.'
      },
      {
        question: 'Which ARIA attribute should you use for a loading spinner?',
        options: [
          'role="status"',
          'role="alert"',
          'role="progressbar"',
          'role="timer"'
        ],
        correct: 2,
        explanation: 'role="progressbar" with aria-valuenow, aria-valuemin, and aria-valuemax is best for loading indicators.'
      },
      {
        question: 'What\'s the correct way to hide decorative images from screen readers?',
        options: [
          'display: none',
          'visibility: hidden',
          'alt=""',
          'aria-hidden="true"'
        ],
        correct: 2,
        explanation: 'Empty alt text (alt="") tells screen readers the image is decorative and can be ignored.'
      }
    ]
  }
};