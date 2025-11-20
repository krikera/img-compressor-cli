/**
 * Example usage of img-compressor-com package
 * 
 * This file demonstrates various ways to use the image compression API
 * including new features: AVIF, GIF, SVG, resize, crop, presets, and glob patterns
 */

const { compressImage, compressImages, QUALITY_PRESETS } = require('img-compressor-com');
const path = require('path');

// Example 1: Basic AVIF compression (modern format)
async function avifCompression() {
  console.log('\n=== Example 1: AVIF Compression ===');
  
  try {
    const result = await compressImage(
      path.join(__dirname, '../test/assets/img.jpg'),
      path.join(__dirname, 'output'),
      {
        convertTo: 'avif',
        quality: 80
      }
    );
    
    console.log('✅ AVIF compression successful!');
    console.log(`Input: ${(result.inputSize / 1024).toFixed(2)} KB`);
    console.log(`Output: ${(result.outputSize / 1024).toFixed(2)} KB`);
    console.log(`💾 Savings: ${result.savings}%`);
    console.log(`⚡ Load time improvement: ${result.loadTimeImprovement}s`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: Using quality presets
async function qualityPresets() {
  console.log('\n=== Example 2: Quality Presets ===');
  
  console.log('Available presets:', Object.keys(QUALITY_PRESETS));
  
  try {
    const result = await compressImage(
      path.join(__dirname, '../test/assets/img.jpg'),
      path.join(__dirname, 'output'),
      {
        convertTo: 'webp',
        preset: 'web-optimized',  // Use preset instead of manual quality
        inputFileName: 'img-preset.jpg'
      }
    );
    
    console.log('✅ Preset compression successful!');
    console.log(`Preset used: web-optimized (${QUALITY_PRESETS['web-optimized'].quality}% quality)`);
    console.log(`Savings: ${result.savings}%`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 3: Resize during compression
async function resizeAndCompress() {
  console.log('\n=== Example 3: Resize + Compress ===');
  
  try {
    const result = await compressImage(
      path.join(__dirname, '../test/assets/img.jpg'),
      path.join(__dirname, 'output'),
      {
        convertTo: 'webp',
        quality: 85,
        resize: {
          width: 1920,
          height: 1080,
          fit: 'inside'  // Maintains aspect ratio
        },
        inputFileName: 'img-resized.jpg'
      }
    );
    
    console.log('✅ Resized and compressed!');
    console.log(`Resized to max 1920x1080`);
    console.log(`Savings: ${result.savings}%`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 4: Crop during compression
async function cropAndCompress() {
  console.log('\n=== Example 4: Crop + Compress ===');
  
  try {
    const result = await compressImage(
      path.join(__dirname, '../test/assets/img.jpg'),
      path.join(__dirname, 'output'),
      {
        convertTo: 'jpeg',
        quality: 90,
        crop: {
          left: 100,
          top: 100,
          width: 800,
          height: 600
        },
        useMozjpeg: true,  // Use superior mozjpeg compression
        inputFileName: 'img-cropped.jpg'
      }
    );
    
    console.log('✅ Cropped and compressed with mozjpeg!');
    console.log(`Cropped to 800x600`);
    console.log(`Savings: ${result.savings}%`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 5: Batch compression with glob pattern
async function batchWithGlob() {
  console.log('\n=== Example 5: Batch with Glob Pattern ===');
  
  try {
    // Compress all JPG files in assets directory
    const results = await compressImages(
      path.join(__dirname, '../test/assets/*.jpg'),
      path.join(__dirname, 'output/batch-glob'),
      {
        convertTo: 'avif',
        quality: 80,
        concurrency: 3
      }
    );
    
    console.log(`✅ Compressed ${results.length} images using glob pattern!`);
    
    const totalSavings = results.reduce((sum, r) => 
      sum + (r.error ? 0 : parseFloat(r.savings)), 0
    );
    console.log(`Average savings: ${(totalSavings / results.length).toFixed(2)}%`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 6: Visual comparison preview
async function withVisualComparison() {
  console.log('\n=== Example 6: With Visual Comparison ===');
  
  try {
    const result = await compressImage(
      path.join(__dirname, '../test/assets/img.jpg'),
      path.join(__dirname, 'output'),
      {
        convertTo: 'webp',
        quality: 75,
        generatePreview: true,  // Generate interactive HTML comparison
        inputFileName: 'img-preview.jpg'
      }
    );
    
    console.log('✅ Compressed with preview generated!');
    console.log(`Check: ${path.join(__dirname, 'output/previews/img-preview-comparison.html')}`);
    console.log(`Open the HTML file to see the interactive comparison slider!`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 7: Thumbnail generation
async function generateThumbnails() {
  console.log('\n=== Example 7: Generate Thumbnails ===');
  
  try {
    const result = await compressImage(
      path.join(__dirname, '../test/assets/img.jpg'),
      path.join(__dirname, 'output'),
      {
        convertTo: 'webp',
        preset: 'thumbnail',  // Auto-resizes to 300x300 with 60% quality
        inputFileName: 'img-thumb.jpg'
      }
    );
    
    console.log('✅ Thumbnail generated!');
    console.log(`Optimized for thumbnail use`);
    console.log(`Savings: ${result.savings}%`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 8: Convert multiple formats at once
async function multiFormatConversion() {
  console.log('\n=== Example 8: Multi-Format Conversion ===');
  
  const formats = ['jpeg', 'png', 'webp', 'avif'];
  const inputPath = path.join(__dirname, '../test/assets/img.jpg');
  
  for (const format of formats) {
    try {
      const result = await compressImage(
        inputPath,
        path.join(__dirname, `output/${format}`),
        {
          convertTo: format,
          quality: 80,
          useMozjpeg: format === 'jpeg'
        }
      );
      
      console.log(`✅ ${format.toUpperCase()}: ${(result.outputSize / 1024).toFixed(2)} KB (${result.savings}% savings)`);
    } catch (error) {
      console.error(`❌ ${format}:`, error.message);
    }
  }
}

// Example 9: Lossless compression
async function losslessCompression() {
  console.log('\n=== Example 9: Lossless Compression ===');
  
  try {
    const result = await compressImage(
      path.join(__dirname, '../test/assets/img.jpg'),
      path.join(__dirname, 'output'),
      {
        convertTo: 'png',
        compressionType: 'lossless',  // No quality loss
        inputFileName: 'img-lossless.jpg'
      }
    );
    
    console.log('✅ Lossless compression completed!');
    console.log(`No quality loss, size: ${(result.outputSize / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 10: Advanced batch processing
async function advancedBatch() {
  console.log('\n=== Example 10: Advanced Batch Processing ===');
  
  try {
    const results = await compressImages(
      path.join(__dirname, '../test/assets'),
      path.join(__dirname, 'output/advanced'),
      {
        convertTo: 'webp',
        preset: 'web-optimized',
        resize: {
          width: 1920,
          fit: 'inside'
        },
        generatePreview: true,
        concurrency: 5,
        stripMetadata: true
      }
    );
    
    console.log(`✅ Processed ${results.length} images`);
    
    const successful = results.filter(r => !r.error);
    const failed = results.filter(r => r.error);
    
    console.log(`   ✅ Successful: ${successful.length}`);
    console.log(`   ❌ Failed: ${failed.length}`);
    
    if (successful.length > 0) {
      const avgSavings = successful.reduce((sum, r) => 
        sum + parseFloat(r.savings), 0) / successful.length;
      console.log(`   💾 Average savings: ${avgSavings.toFixed(2)}%`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run all examples
async function runAllExamples() {
  console.log('🚀 Running all img-compressor-com v2.0 examples...\n');
  console.log('Note: Make sure test assets exist before running.\n');
  
  await avifCompression();
  await qualityPresets();
  await resizeAndCompress();
  await cropAndCompress();
  await batchWithGlob();
  await withVisualComparison();
  await generateThumbnails();
  await multiFormatConversion();
  await losslessCompression();
  await advancedBatch();
  
  console.log('\n✅ All examples completed!');
  console.log('📁 Check the examples/output folder for results.');
  console.log('🎨 Open HTML files in previews folder to see comparisons!');
}

// Uncomment to run
// runAllExamples().catch(console.error);

// Export examples so they can be run individually
module.exports = {
  avifCompression,
  qualityPresets,
  resizeAndCompress,
  cropAndCompress,
  batchWithGlob,
  withVisualComparison,
  generateThumbnails,
  multiFormatConversion,
  losslessCompression,
  advancedBatch,
  runAllExamples
};
