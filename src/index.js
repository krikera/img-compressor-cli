/**
 * img-compressor-com
 * Intelligent image compression with support for multiple formats
 * 
 * @module img-compressor-com
 */

const { compressImage, compressImages } = require('./lib/compressor');
const { QUALITY_PRESETS } = require('./lib/presets');

// Re-export main API
module.exports = {
  compressImage,
  compressImages,
  QUALITY_PRESETS
};
