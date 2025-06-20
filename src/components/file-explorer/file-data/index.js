/**
 * File Data Aggregator
 * ====================
 */

import { rootDirectoryData } from './root-files.js';
import { sourceDirectoryData, componentsData, stylesData } from './source-files.js';
import { projectFilesData } from './project-files.js';

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Deep cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

/**
 * Combine all file data into a single object
 * @returns {Object} Complete file data structure
 */
export const getAllFileData = () => deepClone({
  ...rootDirectoryData,
  ...sourceDirectoryData,
  ...componentsData,
  ...stylesData,
  ...projectFilesData
});