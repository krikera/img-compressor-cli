/**
 * SVGO compression engine
 * Provides SVG optimization
 */

const fs = require('fs');
const { optimize: optimizeSVG } = require('svgo');

/**
 * Compress SVG using SVGO
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {Object} options - Compression options
 * @returns {Promise<void>}
 */
async function compressSVG(inputPath, outputPath, options = {}) {
  const svgContent = fs.readFileSync(inputPath, 'utf8');
  const { compressionType = 'lossy' } = options;
  
  const result = optimizeSVG(svgContent, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Remove viewBox only if lossless
            removeViewBox: compressionType === 'lossy',
            // Keep more precision for lossless
            cleanupNumericValues: {
              floatPrecision: compressionType === 'lossless' ? 5 : 2
            }
          }
        }
      }
    ]
  });
  
  fs.writeFileSync(outputPath, result.data, 'utf8');
}

module.exports = {
  compressSVG
};

