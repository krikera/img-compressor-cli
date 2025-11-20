/**
 * File utility functions
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if file is a supported image format
 * @param {string} filename - Filename to check
 * @returns {boolean} True if supported
 */
function isSupportedImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.avif', '.gif', '.svg'].includes(ext);
}

/**
 * Ensure directory exists, create if it doesn't
 * @param {string} dirPath - Directory path
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get output file path
 * @param {string} inputPath - Input file path
 * @param {string} outputDir - Output directory
 * @param {string} format - Output format
 * @param {string} [inputFileName] - Optional input filename override
 * @returns {string} Output file path
 */
function getOutputPath(inputPath, outputDir, format, inputFileName) {
  const inputFile = inputFileName || path.basename(inputPath);
  const inputFileNameWithoutExt = path.basename(inputFile, path.extname(inputFile));
  return path.join(outputDir, `${inputFileNameWithoutExt}.${format}`);
}

module.exports = {
  isSupportedImage,
  ensureDirectory,
  getOutputPath
};

