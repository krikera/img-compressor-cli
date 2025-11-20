/**
 * Mozjpeg compression engine
 * Provides superior JPEG compression
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Optional dependencies - will fallback if not available
let imagemin, imageminMozjpeg;
try {
  imagemin = require('imagemin');
  imageminMozjpeg = require('imagemin-mozjpeg');
} catch (e) {
  // Will use Sharp fallback
}

/**
 * Compress JPEG using mozjpeg
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {number} quality - Quality level (1-100)
 * @returns {Promise<void>}
 */
async function compressWithMozjpeg(inputPath, outputPath, quality) {
  if (imagemin && imageminMozjpeg) {
    try {
      const mozjpeg = typeof imageminMozjpeg === 'function' ? imageminMozjpeg : imageminMozjpeg.default;
      const result = await imagemin([inputPath], {
        destination: path.dirname(outputPath),
        plugins: [
          mozjpeg({
            quality: quality,
            progressive: true
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
  
  // Use Sharp with mozjpeg option as fallback
  await sharp(inputPath).jpeg({ quality, progressive: true, mozjpeg: true }).toFile(outputPath);
}

/**
 * Check if mozjpeg is available
 * @returns {boolean}
 */
function isMozjpegAvailable() {
  return !!(imagemin && imageminMozjpeg);
}

module.exports = {
  compressWithMozjpeg,
  isMozjpegAvailable
};

