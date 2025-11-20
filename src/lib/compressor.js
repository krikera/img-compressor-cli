/**
 * Main image compression module
 * Orchestrates the compression process
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const { applyQualityPreset } = require('./presets');
const { isSupportedImage, ensureDirectory, getOutputPath } = require('./utils/fileUtils');
const { calculateSavings } = require('./utils/statsUtils');
const { compressWithMozjpeg } = require('./engines/mozjpegEngine');
const { compressGIF } = require('./engines/gifsicleEngine');
const { compressSVG } = require('./engines/svgoEngine');
const { applyFormatOptions } = require('./formatters/sharpFormatter');
const { generateComparisonPreview } = require('./preview');

/**
 * Compress a single image
 * @param {string} inputPath - Input image path
 * @param {string} outputPath - Output directory path
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} Compression statistics
 */
async function compressImage(inputPath, outputPath, options = {}) {
  // Apply quality preset if specified
  options = applyQualityPreset(options);
  
  const {
    quality,
    compressionLevel,
    convertTo,
    inputFileName,
    generatePreview: shouldGeneratePreview,
    compressionType = 'lossy',
    resize,
    crop,
    useMozjpeg = true,
    stripMetadata = true,
    progressive = true
  } = options;

  if (!convertTo) {
    throw new Error("Please specify the output format using the 'convertTo' option.");
  }

  // Determine final quality
  const finalQuality = determineQuality(quality, compressionLevel, compressionType);

  // Get output file path
  const outputFilePath = getOutputPath(inputPath, outputPath, convertTo, inputFileName);
  const outputDir = path.dirname(outputFilePath);
  ensureDirectory(outputDir);

  const inputFile = inputFileName || path.basename(inputPath);
  const inputFileNameWithoutExt = path.basename(inputFile, path.extname(inputFile));
  const inputExt = path.extname(inputPath).toLowerCase();

  // Handle SVG separately
  if (inputExt === '.svg') {
    if (convertTo !== 'svg') {
      throw new Error('SVG files can only be converted to SVG format');
    }
    await compressSVG(inputPath, outputFilePath, options);
    const stats = calculateSavings(inputPath, outputFilePath);
    return { ...stats, inputFileName: inputFile };
  }

  // Handle GIF separately
  if (inputExt === '.gif') {
    await handleGIFCompression(inputPath, outputFilePath, convertTo, finalQuality, resize, crop, compressionType, progressive);
    const stats = calculateSavings(inputPath, outputFilePath);
    return { ...stats, inputFileName: inputFile };
  }

  // Handle standard formats with Sharp
  await handleSharpCompression(
    inputPath,
    outputFilePath,
    convertTo,
    finalQuality,
    resize,
    crop,
    stripMetadata,
    compressionType,
    progressive,
    useMozjpeg
  );

  const stats = calculateSavings(inputPath, outputFilePath);

  // Generate preview if requested
  if (shouldGeneratePreview) {
    await generateComparisonPreview(inputPath, outputFilePath, outputDir, inputFileNameWithoutExt);
  }

  return { ...stats, inputFileName: inputFile };
}

/**
 * Determine final quality from options
 * @private
 */
function determineQuality(quality, compressionLevel, compressionType) {
  if (quality) return quality;

  if (compressionLevel && compressionType === 'lossy') {
    const levels = {
      high: 90,
      medium: 70,
      low: 50,
    };
    const level = levels[compressionLevel.toLowerCase()];
    if (level === undefined) {
      throw new Error(`Unsupported compression level: ${compressionLevel}`);
    }
    return level;
  }

  return compressionType === 'lossy' ? 80 : 100;
}

/**
 * Handle GIF compression
 * @private
 */
async function handleGIFCompression(inputPath, outputFilePath, convertTo, quality, resize, crop, compressionType, progressive) {
  if (convertTo !== 'gif') {
    // Convert GIF to other format using Sharp (first frame only)
    let image = sharp(inputPath, { animated: false });
    
    if (resize) {
      image = image.resize(resize);
    }
    
    if (crop) {
      image = image.extract(crop);
    }
    
    image = applyFormatOptions(image, convertTo, quality, compressionType, progressive);
    await image.toFile(outputFilePath);
  } else {
    // Compress GIF as GIF
    await compressGIF(inputPath, outputFilePath, { quality });
  }
}

/**
 * Handle Sharp-based compression
 * @private
 */
async function handleSharpCompression(
  inputPath,
  outputFilePath,
  convertTo,
  quality,
  resize,
  crop,
  stripMetadata,
  compressionType,
  progressive,
  useMozjpeg
) {
  let image = sharp(inputPath);

  // Apply resize if specified
  if (resize) {
    image = image.resize(resize);
  }

  // Apply crop if specified
  if (crop) {
    image = image.extract(crop);
  }

  // Strip metadata if requested
  if (stripMetadata) {
    image = image.withMetadata({ orientation: undefined });
  }

  // For JPEG, optionally use mozjpeg for better compression
  if ((convertTo === 'jpeg' || convertTo === 'jpg') && useMozjpeg && compressionType === 'lossy') {
    const tempPath = outputFilePath + '.temp.jpg';
    await image.jpeg({ quality }).toFile(tempPath);
    await compressWithMozjpeg(tempPath, outputFilePath, quality);
    fs.unlinkSync(tempPath);
  } else {
    // Use Sharp for all other formats
    image = applyFormatOptions(image, convertTo, quality, compressionType, progressive);
    await image.toFile(outputFilePath);
  }
}

/**
 * Compress multiple images in batch
 * @param {string|string[]} inputPaths - Array of paths, directory, or glob pattern
 * @param {string} outputPath - Output directory path
 * @param {Object} options - Compression options
 * @returns {Promise<Array>} Array of compression results
 */
async function compressImages(inputPaths, outputPath, options = {}) {
  const { concurrency = 5 } = options;
  
  // Resolve input files
  const files = await resolveInputFiles(inputPaths);

  if (files.length === 0) {
    throw new Error('No images found matching the input criteria.');
  }

  // Process in batches with concurrency limit
  const results = [];
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const promises = batch.map(file => {
      const optionsWithInput = { ...options, inputFileName: path.basename(file) };
      return compressImage(file, outputPath, optionsWithInput).catch(err => ({
        error: err.message,
        inputFileName: path.basename(file)
      }));
    });
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Resolve input files from various input formats
 * @private
 */
async function resolveInputFiles(inputPaths) {
  if (Array.isArray(inputPaths)) {
    return inputPaths;
  }
  
  if (typeof inputPaths === 'string') {
    // Check if it's a glob pattern
    if (inputPaths.includes('*') || inputPaths.includes('?')) {
      const files = await glob(inputPaths, { absolute: true });
      return files.filter(file => isSupportedImage(file));
    }
    
    // It's a directory path
    const dirEntries = fs.readdirSync(inputPaths);
    return dirEntries
      .filter(file => isSupportedImage(file))
      .map(file => path.join(inputPaths, file));
  }
  
  throw new Error('Invalid inputPaths. Must be an array, directory path, or glob pattern.');
}

module.exports = {
  compressImage,
  compressImages
};

