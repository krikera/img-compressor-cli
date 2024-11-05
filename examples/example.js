const { compressImage } = require('../src/index');

// Lossy compression example
compressImage('assets/img.jpg', 'assets/output', {
  compressionLevel: 'medium',
  convertTo: 'webp',
  compressionType: 'lossy', // Specify 'lossy' compression
  generatePreview: false,
})
  .then(result => {
    console.log(`Lossy Compression - ${result.inputFileName}:`);
    console.log(`- Original Size: ${(result.inputSize / 1024).toFixed(2)} KB`);
    console.log(`- Compressed Size: ${(result.outputSize / 1024).toFixed(2)} KB`);
    console.log(`- Size Reduced By: ${result.savings}%`);
    console.log(`- Original Estimated Load Time: ${result.originalLoadTime} seconds`);
    console.log(`- Compressed Estimated Load Time: ${result.compressedLoadTime} seconds`);
    console.log(`- Load Time Improvement: ${result.loadTimeImprovement} seconds`);
    console.log('Comparison preview generated.');
  })
  .catch(err => {
    console.error('Error with lossy compression:', err);
  });

// Lossless compression example
compressImage('assets/img.jpg', 'assets/output', {
  convertTo: 'png',
  compressionType: 'lossless', // Specify 'lossless' compression
  generatePreview: true,
})
  .then(result => {
    console.log(`Lossless Compression - ${result.inputFileName}:`);
    console.log(`- Original Size: ${(result.inputSize / 1024).toFixed(2)} KB`);
    console.log(`- Compressed Size: ${(result.outputSize / 1024).toFixed(2)} KB`);
    console.log(`- Size Reduced By: ${result.savings}%`);
    console.log(`- Original Estimated Load Time: ${result.originalLoadTime} seconds`);
    console.log(`- Compressed Estimated Load Time: ${result.compressedLoadTime} seconds`);
    console.log(`- Load Time Improvement: ${result.loadTimeImprovement} seconds`);
    console.log('Comparison preview generated.');
  })
  .catch(err => {
    console.error('Error with lossless compression:', err);
  });