/**
 * File Data Aggregator
 * ====================
 */

import { rootDirectoryData } from './root-files.js';
import { sourceDirectoryData, componentsData, stylesData } from './source-files.js';
import { projectFilesData } from './project-files.js';

/**
 * Combine all file data into a single object
 * @returns {Object} Complete file data structure
 */
export const getAllFileData = () => ({
  ...rootDirectoryData,
  ...sourceDirectoryData,
  ...componentsData,
  ...stylesData,
  ...projectFilesData
});