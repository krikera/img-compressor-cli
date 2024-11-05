const sharp = require('sharp');
const fs = require('fs');
const path = require('path');


function estimateLoadTime(fileSizeBytes, networkSpeedMbps = 5) {
  const fileSizeMegabits = (fileSizeBytes * 8) / (1024 * 1024);
  return (fileSizeMegabits / networkSpeedMbps).toFixed(2);
}

async function compressImage(inputPath, outputPath, options = {}) {
  const {
    quality,
    compressionLevel,
    convertTo,
    inputFileName,
    generatePreview,
    compressionType = 'lossy'
  } = options;

  if (!convertTo) {
    throw new Error("Please specify the output format using the 'convertTo' option.");
  }


  let finalQuality = quality;
  if (compressionLevel && !quality && compressionType === 'lossy') {
    const levels = {
      high: 90,
      medium: 70,
      low: 50,
    };
    finalQuality = levels[compressionLevel.toLowerCase()];
    if (finalQuality === undefined) {
      throw new Error(`Unsupported compression level: ${compressionLevel}`);
    }
  }


  if (!finalQuality && compressionType === 'lossy') {
    finalQuality = 80;
  }


  const inputFile = inputFileName || path.basename(inputPath);
  const inputFileNameWithoutExt = path.basename(inputFile, path.extname(inputFile));
  const outputFilePath = path.join(outputPath, `${inputFileNameWithoutExt}.${convertTo}`);


  const outputDir = path.dirname(outputFilePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let image = sharp(inputPath);

  if (compressionType === 'lossless') {

    if (convertTo === 'png') {
      image = image.png({ compressionLevel: 9, quality: 100 });
    } else if (convertTo === 'webp') {
      image = image.webp({ lossless: true });
    } else if (convertTo === 'tiff') {
      image = image.tiff({ compression: 'none' });
    } else {
      throw new Error(`Lossless compression is not supported for format: ${convertTo}`);
    }
  } else {

    if (convertTo === 'jpeg' || convertTo === 'jpg') {
      image = image.jpeg({ quality: finalQuality });
    } else if (convertTo === 'png') {
      const pngCompressionLevel = Math.round((9 * (100 - finalQuality)) / 100);
      image = image.png({ compressionLevel: pngCompressionLevel, quality: finalQuality });
    } else if (convertTo === 'webp') {
      image = image.webp({ quality: finalQuality });
    } else {
      throw new Error(`Unsupported format for lossy compression: ${convertTo}`);
    }
  }

  await image.toFile(outputFilePath);

  const stats = calculateSavings(inputPath, outputFilePath);


  if (generatePreview) {
    await generateComparisonPreview(inputPath, outputFilePath, outputDir, inputFileNameWithoutExt);
  }

  return { ...stats, inputFileName: inputFile };
}

async function compressImages(inputPaths, outputPath, options = {}) {
  const { concurrency = 5 } = options;
  let files = [];

  if (Array.isArray(inputPaths)) {
    files = inputPaths;
  } else if (typeof inputPaths === 'string') {
    const dirEntries = fs.readdirSync(inputPaths);
    files = dirEntries
      .filter(file => isSupportedImage(file))
      .map(file => path.join(inputPaths, file));
  } else {
    throw new Error('Invalid inputPaths. Must be an array or directory path.');
  }

  const results = [];
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const promises = batch.map(file => {
      const optionsWithInput = { ...options, inputFileName: path.basename(file) };
      return compressImage(file, outputPath, optionsWithInput);
    });
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  return results;
}

function isSupportedImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.tiff'].includes(ext);
}

function calculateSavings(inputPath, outputPath) {
  const inputSize = fs.statSync(inputPath).size;
  const outputSize = fs.statSync(outputPath).size;
  const savings = (((inputSize - outputSize) / inputSize) * 100).toFixed(2);


  const averageNetworkSpeed = 5; // Mbps
  const originalLoadTime = estimateLoadTime(inputSize, averageNetworkSpeed);
  const compressedLoadTime = estimateLoadTime(outputSize, averageNetworkSpeed);
  const loadTimeImprovement = (originalLoadTime - compressedLoadTime).toFixed(2);

  return {
    inputSize,
    outputSize,
    savings,
    originalLoadTime,
    compressedLoadTime,
    loadTimeImprovement,
  };
}

async function generateComparisonPreview(originalPath, compressedPath, outputDir, baseName) {
  const previewDir = path.join(outputDir, 'previews');
  if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true });
  }

  const originalData = fs.readFileSync(originalPath);
  const compressedData = fs.readFileSync(compressedPath);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${baseName} - Before and After Comparison</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f7f7f7;
  }
  h2 {
    text-align: center;
  }
  .comparison-container {
    position: relative;
    max-width: 800px;
    margin: 20px auto;
    overflow: hidden;
  }
  .comparison-container img {
    display: block;
    width: 100%;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    overflow: hidden;
  }
  .overlay img {
    display: block;
    width: 100%;
  }
  .handle {
    position: absolute;
    top: 0;
    left: 50%;
    width: 3px;
    height: 100%;
    background-color: #fff;
    cursor: ew-resize;
    z-index: 2;
  }
  /* Aesthetic improvements */
  .handle:before {
    content: '';
    position: absolute;
    top: 50%;
    left: -10px;
    transform: translateY(-50%);
    border: 10px solid transparent;
    border-left-color: #333;
  }
  .handle:after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    transform: translateY(-50%);
    border: 10px solid transparent;
    border-right-color: #333;
  }
</style>
</head>
<body>
  <h2>${baseName} - Before and After Comparison</h2>
  <div class="comparison-container" id="comparisonContainer">
    <img src="data:image/jpeg;base64,${compressedData.toString('base64')}" alt="Compressed Image">
    <div class="overlay" id="overlay">
      <img src="data:image/jpeg;base64,${originalData.toString('base64')}" alt="Original Image">
    </div>
    <div class="handle" id="handle"></div>
  </div>
<script>
  const container = document.getElementById('comparisonContainer');
  const overlay = document.getElementById('overlay');
  const handle = document.getElementById('handle');
  let isDown = false;

  handle.addEventListener('mousedown', (e) => {
    isDown = true;
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    let rect = container.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    let percentage = (offsetX / rect.width) * 100;
    handle.style.left = percentage + '%';
    overlay.style.width = percentage + '%';
  });

  // Initialize positions
  window.addEventListener('load', () => {
    handle.style.left = '50%';
    overlay.style.width = '50%';
  });

  window.addEventListener('resize', () => {
    handle.style.left = '50%';
    overlay.style.width = '50%';
  });
</script>
</body>
</html>
  `;

  const previewFilePath = path.join(previewDir, `${baseName}-comparison.html`);
  fs.writeFileSync(previewFilePath, htmlContent, 'utf8');
}

module.exports = { compressImage, compressImages };