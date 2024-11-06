#!/usr/bin/env node

const { Command } = require('commander');
const { compressImage, compressImages } = require('./src/index');
const packageJson = require('./package.json');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('img-compressor-com')
  .version(packageJson.version)
  .description('Compress images with options for lossy and lossless compression.');

program
  .command('compress <input> <output>')
  .description('Compress a single image.')
  .option('-c, --convert-to <format>', 'Format to convert the image to (jpeg, png, webp, tiff).', 'jpeg')
  .option('-t, --compression-type <type>', 'Compression type (lossy or lossless).', 'lossy')
  .option('-l, --compression-level <level>', 'Compression level (high, medium, low).')
  .option('-q, --quality <quality>', 'Compression quality (1-100).', parseInt)
  .option('-p, --generate-preview', 'Generate a before-and-after comparison preview.')
  .action(async (input, output, options) => {
    try {
      const result = await compressImage(input, output, {
        convertTo: options.convertTo,
        compressionType: options.compressionType,
        compressionLevel: options.compressionLevel,
        quality: options.quality,
        generatePreview: options.generatePreview || false,
      });

      console.log(`Compressed ${result.inputFileName}:`);
      console.log(`- Original Size: ${(result.inputSize / 1024).toFixed(2)} KB`);
      console.log(`- Compressed Size: ${(result.outputSize / 1024).toFixed(2)} KB`);
      console.log(`- Size Reduced By: ${result.savings}%`);
      console.log(`- Original Estimated Load Time: ${result.originalLoadTime} seconds`);
      console.log(`- Compressed Estimated Load Time: ${result.compressedLoadTime} seconds`);
      console.log(`- Load Time Improvement: ${result.loadTimeImprovement} seconds`);

      if (options.generatePreview) {
        console.log('Comparison preview generated.');
      }
    } catch (err) {
      console.error('Error compressing image:', err.message);
    }
  });

program
  .command('compress-batch <input> <output>')
  .description('Compress multiple images in batch.')
  .option('-c, --convert-to <format>', 'Format to convert the images to (jpeg, png, webp, tiff).', 'jpeg')
  .option('-t, --compression-type <type>', 'Compression type (lossy or lossless).', 'lossy')
  .option('-l, --compression-level <level>', 'Compression level (high, medium, low).')
  .option('-q, --quality <quality>', 'Compression quality (1-100).', parseInt)
  .option('-p, --generate-preview', 'Generate before-and-after comparison previews.')
  .option('-y, --concurrency <number>', 'Number of concurrent image processing tasks.', parseInt, 5)
  .action(async (input, output, options) => {
    try {
      let inputPaths;
      const inputStat = fs.statSync(input);
      if (inputStat.isDirectory()) {
        inputPaths = input;
      } else {
        inputPaths = input.split(',');
      }

      const results = await compressImages(inputPaths, output, {
        convertTo: options.convertTo,
        compressionType: options.compressionType,
        compressionLevel: options.compressionLevel,
        quality: options.quality,
        generatePreview: options.generatePreview || false,
        concurrency: options.concurrency,
      });

      results.forEach(result => {
        console.log(`Compressed ${result.inputFileName}:`);
        console.log(`- Original Size: ${(result.inputSize / 1024).toFixed(2)} KB`);
        console.log(`- Compressed Size: ${(result.outputSize / 1024).toFixed(2)} KB`);
        console.log(`- Size Reduced By: ${result.savings}%`);
        console.log(`- Original Estimated Load Time: ${result.originalLoadTime} seconds`);
        console.log(`- Compressed Estimated Load Time: ${result.compressedLoadTime} seconds`);
        console.log(`- Load Time Improvement: ${result.loadTimeImprovement} seconds`);
      });

      if (options.generatePreview) {
        console.log('Comparison previews generated for batch images.');
      }
    } catch (err) {
      console.error('Error compressing images:', err.message);
    }
  });

program.parse(process.argv);