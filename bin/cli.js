#!/usr/bin/env node

const { Command } = require('commander');
const { compressImage, compressImages, QUALITY_PRESETS } = require('../src/index');
const packageJson = require('../package.json');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('img-compressor-com')
  .version(packageJson.version)
  .description('Intelligent image compressor with support for JPEG, PNG, WebP, AVIF, GIF, SVG and more.');

program
  .command('compress <input> <output>')
  .description('Compress a single image.')
  .option('-c, --convert-to <format>', 'Format to convert (jpeg, png, webp, avif, gif, svg, tiff).', 'jpeg')
  .option('-t, --compression-type <type>', 'Compression type (lossy or lossless).', 'lossy')
  .option('-l, --compression-level <level>', 'Compression level (high, medium, low).')
  .option('-q, --quality <quality>', 'Compression quality (1-100).', parseInt)
  .option('--preset <preset>', `Quality preset (${Object.keys(QUALITY_PRESETS).join(', ')}).`)
  .option('-p, --generate-preview', 'Generate before-and-after comparison preview.')
  .option('--no-mozjpeg', 'Disable mozjpeg for JPEG compression.')
  .option('--no-strip-metadata', 'Keep image metadata.')
  .option('--no-progressive', 'Disable progressive JPEG.')
  .option('--resize-width <width>', 'Resize width in pixels.', parseInt)
  .option('--resize-height <height>', 'Resize height in pixels.', parseInt)
  .option('--resize-fit <fit>', 'Resize fit mode (cover, contain, fill, inside, outside).', 'inside')
  .option('--crop-left <left>', 'Crop left offset.', parseInt)
  .option('--crop-top <top>', 'Crop top offset.', parseInt)
  .option('--crop-width <width>', 'Crop width.', parseInt)
  .option('--crop-height <height>', 'Crop height.', parseInt)
  .action(async (input, output, options) => {
    try {
      // Build compression options
      const compressionOptions = {
        convertTo: options.convertTo,
        compressionType: options.compressionType,
        compressionLevel: options.compressionLevel,
        quality: options.quality,
        preset: options.preset,
        generatePreview: options.generatePreview || false,
        useMozjpeg: options.mozjpeg !== false,
        stripMetadata: options.stripMetadata !== false,
        progressive: options.progressive !== false
      };

      // Add resize options if specified
      if (options.resizeWidth || options.resizeHeight) {
        compressionOptions.resize = {
          fit: options.resizeFit
        };
        if (options.resizeWidth) compressionOptions.resize.width = options.resizeWidth;
        if (options.resizeHeight) compressionOptions.resize.height = options.resizeHeight;
      }

      // Add crop options if all crop parameters are specified
      if (options.cropLeft !== undefined && options.cropTop !== undefined && 
          options.cropWidth && options.cropHeight) {
        compressionOptions.crop = {
          left: options.cropLeft,
          top: options.cropTop,
          width: options.cropWidth,
          height: options.cropHeight
        };
      }

      const result = await compressImage(input, output, compressionOptions);

      console.log(`\n✅ Compressed ${result.inputFileName}:`);
      console.log(`   Original Size: ${(result.inputSize / 1024).toFixed(2)} KB`);
      console.log(`   Compressed Size: ${(result.outputSize / 1024).toFixed(2)} KB`);
      console.log(`   💾 Size Reduced By: ${result.savings}%`);
      console.log(`   ⚡ Original Load Time: ${result.originalLoadTime}s`);
      console.log(`   ⚡ Compressed Load Time: ${result.compressedLoadTime}s`);
      console.log(`   🚀 Load Time Improvement: ${result.loadTimeImprovement}s`);

      if (options.generatePreview) {
        console.log(`   🎨 Comparison preview generated in ${path.join(output, 'previews')}`);
      }
    } catch (err) {
      console.error('\n❌ Error compressing image:', err.message);
      process.exit(1);
    }
  });

program
  .command('compress-batch <input> <output>')
  .description('Compress multiple images in batch. Input can be a directory or glob pattern (e.g., "src/**/*.{jpg,png}").')
  .option('-c, --convert-to <format>', 'Format to convert (jpeg, png, webp, avif, gif, svg, tiff).', 'jpeg')
  .option('-t, --compression-type <type>', 'Compression type (lossy or lossless).', 'lossy')
  .option('-l, --compression-level <level>', 'Compression level (high, medium, low).')
  .option('-q, --quality <quality>', 'Compression quality (1-100).', parseInt)
  .option('--preset <preset>', `Quality preset (${Object.keys(QUALITY_PRESETS).join(', ')}).`)
  .option('-p, --generate-preview', 'Generate before-and-after comparison previews.')
  .option('--no-mozjpeg', 'Disable mozjpeg for JPEG compression.')
  .option('--no-strip-metadata', 'Keep image metadata.')
  .option('--no-progressive', 'Disable progressive JPEG.')
  .option('--resize-width <width>', 'Resize width in pixels.', parseInt)
  .option('--resize-height <height>', 'Resize height in pixels.', parseInt)
  .option('--resize-fit <fit>', 'Resize fit mode (cover, contain, fill, inside, outside).', 'inside')
  .option('-y, --concurrency <number>', 'Number of concurrent processing tasks.', parseInt, 5)
  .action(async (input, output, options) => {
    try {
      let inputPaths;
      
      // Check if input contains glob patterns
      if (input.includes('*') || input.includes('?')) {
        inputPaths = input;
        console.log(`\n📂 Processing images matching pattern: ${input}`);
      } else {
        // Check if it's a directory or comma-separated list
        try {
          const inputStat = fs.statSync(input);
          if (inputStat.isDirectory()) {
            inputPaths = input;
            console.log(`\n📂 Processing directory: ${input}`);
          } else {
            inputPaths = [input];
          }
        } catch (err) {
          // Treat as comma-separated list
          inputPaths = input.split(',').map(p => p.trim());
          console.log(`\n📂 Processing ${inputPaths.length} specified files`);
        }
      }

      // Build compression options
      const compressionOptions = {
        convertTo: options.convertTo,
        compressionType: options.compressionType,
        compressionLevel: options.compressionLevel,
        quality: options.quality,
        preset: options.preset,
        generatePreview: options.generatePreview || false,
        useMozjpeg: options.mozjpeg !== false,
        stripMetadata: options.stripMetadata !== false,
        progressive: options.progressive !== false,
        concurrency: options.concurrency
      };

      // Add resize options if specified
      if (options.resizeWidth || options.resizeHeight) {
        compressionOptions.resize = {
          fit: options.resizeFit
        };
        if (options.resizeWidth) compressionOptions.resize.width = options.resizeWidth;
        if (options.resizeHeight) compressionOptions.resize.height = options.resizeHeight;
      }

      const results = await compressImages(inputPaths, output, compressionOptions);

      let successCount = 0;
      let errorCount = 0;
      let totalSavings = 0;

      console.log('\n📊 Results:\n');
      
      results.forEach(result => {
        if (result.error) {
          errorCount++;
          console.log(`   ❌ ${result.inputFileName}: ${result.error}`);
        } else {
          successCount++;
          totalSavings += parseFloat(result.savings);
          console.log(`   ✅ ${result.inputFileName}:`);
          console.log(`      ${(result.inputSize / 1024).toFixed(2)} KB → ${(result.outputSize / 1024).toFixed(2)} KB (${result.savings}% savings)`);
        }
      });

      console.log(`\n📈 Summary:`);
      console.log(`   ✅ Successfully compressed: ${successCount}`);
      if (errorCount > 0) {
        console.log(`   ❌ Failed: ${errorCount}`);
      }
      if (successCount > 0) {
        console.log(`   💾 Average savings: ${(totalSavings / successCount).toFixed(2)}%`);
      }

      if (options.generatePreview) {
        console.log(`   🎨 Comparison previews generated in ${path.join(output, 'previews')}`);
      }
    } catch (err) {
      console.error('\n❌ Error compressing images:', err.message);
      process.exit(1);
    }
  });

program
  .command('presets')
  .description('List available quality presets.')
  .action(() => {
    console.log('\n🎯 Available Quality Presets:\n');
    Object.entries(QUALITY_PRESETS).forEach(([name, config]) => {
      console.log(`   ${name}:`);
      console.log(`      Quality: ${config.quality}`);
      console.log(`      Description: ${config.description}`);
      if (config.resize) {
        console.log(`      Resize: ${config.resize.width}x${config.resize.height}`);
      }
      console.log('');
    });
  });

program.parse(process.argv);
