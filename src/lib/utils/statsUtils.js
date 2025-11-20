/**
 * Statistics calculation utilities
 */

const fs = require('fs');

/**
 * Estimate load time for a file
 * @param {number} fileSizeBytes - File size in bytes
 * @param {number} networkSpeedMbps - Network speed in Mbps
 * @returns {string} Estimated load time in seconds
 */
function estimateLoadTime(fileSizeBytes, networkSpeedMbps = 5) {
  const fileSizeMegabits = (fileSizeBytes * 8) / (1024 * 1024);
  return (fileSizeMegabits / networkSpeedMbps).toFixed(2);
}

/**
 * Calculate compression savings and statistics
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @returns {Object} Statistics object
 */
function calculateSavings(inputPath, outputPath) {
  const inputSize = fs.statSync(inputPath).size;
  const outputSize = fs.statSync(outputPath).size;
  const savings = (((inputSize - outputSize) / inputSize) * 100).toFixed(2);

  const averageNetworkSpeed = 5; // Mbps
  const originalLoadTime = estimateLoadTime(inputSize, averageNetworkSpeed);
  const compressedLoadTime = estimateLoadTime(outputSize, averageNetworkSpeed);
  const loadTimeImprovement = (originalLoadTime - compressedLoadTime).toFixed(2);

  return {
    inputSize,
    outputSize,
    savings,
    originalLoadTime,
    compressedLoadTime,
    loadTimeImprovement,
  };
}

module.exports = {
  estimateLoadTime,
  calculateSavings
};

