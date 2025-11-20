/**
 * Gifsicle compression engine
 * Provides GIF optimization
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Optional dependencies - will fallback if not available
let imagemin, imageminGifsicle;
try {
  imagemin = require('imagemin');
  imageminGifsicle = require('imagemin-gifsicle');
} catch (e) {
  // Will use Sharp fallback
}

/**
 * Compress GIF using gifsicle
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {Object} options - Compression options
 * @returns {Promise<void>}
 */
async function compressGIF(inputPath, outputPath, options = {}) {
  const { quality = 80 } = options;
  
  if (imagemin && imageminGifsicle) {
    try {
      // Use imagemin with gifsicle for GIF compression
      const optimizationLevel = Math.round((100 - quality) / 33); // Convert quality to 0-3 level
      const gifsicle = typeof imageminGifsicle === 'function' ? imageminGifsicle : imageminGifsicle.default;
      
      const result = await imagemin([inputPath], {
        destination: path.dirname(outputPath),
        plugins: [
          gifsicle({
            optimizationLevel: Math.max(1, Math.min(3, optimizationLevel)),
            colors: quality > 80 ? 256 : quality > 60 ? 128 : 64
          })
        ]
      });
      
      if (result && result[0]) {
        const tempOutput = result[0].destinationPath;
        if (tempOutput !== outputPath) {
          fs.renameSync(tempOutput, outputPath);
        }
      }
      return;
    } catch (error) {
      // Fall through to Sharp
    }
  }
  
  // Use Sharp as fallback (takes first frame of GIF)
  await sharp(inputPath, { animated: false })
    .gif()
    .toFile(outputPath);
}

/**
 * Check if gifsicle is available
 * @returns {boolean}
 */
function isGifsicleAvailable() {
  return !!(imagemin && imageminGifsicle);
}

module.exports = {
  compressGIF,
  isGifsicleAvailable
};

