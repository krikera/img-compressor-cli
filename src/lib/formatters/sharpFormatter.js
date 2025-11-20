/**
 * Sharp format handler
 * Applies format-specific options to Sharp instance
 */

/**
 * Apply format-specific options to Sharp image instance
 * @param {Object} image - Sharp image instance
 * @param {string} convertTo - Target format
 * @param {number} quality - Quality level
 * @param {string} compressionType - Compression type (lossy/lossless)
 * @param {boolean} progressive - Use progressive encoding
 * @returns {Object} Configured Sharp instance
 */
function applyFormatOptions(image, convertTo, quality, compressionType, progressive) {
  if (compressionType === 'lossless') {
    // Lossless compression
    if (convertTo === 'png') {
      return image.png({ compressionLevel: 9, quality: 100 });
    } else if (convertTo === 'webp') {
      return image.webp({ lossless: true });
    } else if (convertTo === 'avif') {
      return image.avif({ lossless: true });
    } else if (convertTo === 'tiff') {
      return image.tiff({ compression: 'lzw' });
    } else {
      throw new Error(`Lossless compression is not supported for format: ${convertTo}`);
    }
  } else {
    // Lossy compression
    if (convertTo === 'jpeg' || convertTo === 'jpg') {
      return image.jpeg({ quality, progressive });
    } else if (convertTo === 'png') {
      const pngCompressionLevel = Math.round((9 * (100 - quality)) / 100);
      return image.png({ compressionLevel: pngCompressionLevel, quality });
    } else if (convertTo === 'webp') {
      return image.webp({ quality });
    } else if (convertTo === 'avif') {
      return image.avif({ quality });
    } else if (convertTo === 'tiff') {
      return image.tiff({ quality, compression: 'jpeg' });
    } else {
      throw new Error(`Unsupported format for lossy compression: ${convertTo}`);
    }
  }
}

module.exports = {
  applyFormatOptions
};

