/**
 * Quality presets for different use cases
 * Provides pre-configured settings for common compression scenarios
 */

const QUALITY_PRESETS = {
  'thumbnail': {
    quality: 60,
    resize: { width: 300, height: 300, fit: 'inside' },
    description: 'Optimized for small thumbnails'
  },
  'web-optimized': {
    quality: 80,
    resize: null,
    description: 'Balanced quality and file size for web'
  },
  'high-quality': {
    quality: 92,
    resize: null,
    description: 'High quality with moderate compression'
  },
  'print-quality': {
    quality: 95,
    resize: null,
    description: 'Near-lossless quality for print'
  }
};

/**
 * Apply quality preset to options
 * @param {Object} options - Compression options
 * @returns {Object} Options with preset applied
 */
function applyQualityPreset(options) {
  if (options.preset && QUALITY_PRESETS[options.preset]) {
    const preset = QUALITY_PRESETS[options.preset];
    return {
      ...options,
      quality: options.quality || preset.quality,
      resize: options.resize || preset.resize
    };
  }
  return options;
}

module.exports = {
  QUALITY_PRESETS,
  applyQualityPreset
};

