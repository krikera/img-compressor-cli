/**
 * Preview generation module
 * Creates interactive HTML comparison previews
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate interactive comparison preview
 * @param {string} originalPath - Original image path
 * @param {string} compressedPath - Compressed image path
 * @param {string} outputDir - Output directory
 * @param {string} baseName - Base filename
 * @returns {Promise<void>}
 */
async function generateComparisonPreview(originalPath, compressedPath, outputDir, baseName) {
  const previewDir = path.join(outputDir, 'previews');
  if (!fs.existsSync(previewDir)) {
    fs.mkdirSync(previewDir, { recursive: true });
  }

  const originalData = fs.readFileSync(originalPath);
  const compressedData = fs.readFileSync(compressedPath);

  // Detect MIME type
  const ext = path.extname(compressedPath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif'
  };
  const mimeType = mimeTypes[ext] || 'image/jpeg';

  const htmlContent = generateHTMLTemplate(baseName, mimeType, originalData, compressedData);

  const previewFilePath = path.join(previewDir, `${baseName}-comparison.html`);
  fs.writeFileSync(previewFilePath, htmlContent, 'utf8');
}

/**
 * Generate HTML template for comparison
 * @private
 */
function generateHTMLTemplate(baseName, mimeType, originalData, compressedData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${baseName} - Before and After Comparison</title>
<style>
  * {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  h1 {
    text-align: center;
    color: white;
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  .subtitle {
    text-align: center;
    color: rgba(255,255,255,0.9);
    margin-bottom: 30px;
    font-size: 1.1rem;
  }
  .comparison-container {
    position: relative;
    max-width: 100%;
    margin: 20px auto;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    background: white;
  }
  .comparison-container img {
    display: block;
    width: 100%;
    height: auto;
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .handle {
    position: absolute;
    top: 0;
    left: 50%;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #667eea, #764ba2);
    cursor: ew-resize;
    z-index: 3;
    transform: translateX(-2px);
  }
  .handle:before,
  .handle:after {
    content: '';
    position: absolute;
    top: 50%;
    width: 0;
    height: 0;
    border-style: solid;
  }
  .handle:before {
    left: -12px;
    transform: translateY(-50%);
    border-width: 15px 15px 15px 0;
    border-color: transparent white transparent transparent;
  }
  .handle:after {
    right: -12px;
    transform: translateY(-50%);
    border-width: 15px 0 15px 15px;
    border-color: transparent transparent transparent white;
  }
  .handle-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .handle-circle::before,
  .handle-circle::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border: solid #667eea;
    border-width: 0 3px 3px 0;
  }
  .handle-circle::before {
    left: 12px;
    transform: rotate(135deg);
  }
  .handle-circle::after {
    right: 12px;
    transform: rotate(-45deg);
  }
  .labels {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 2;
    pointer-events: none;
  }
  .label {
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }
  .instructions {
    text-align: center;
    color: white;
    margin-top: 20px;
    font-size: 14px;
    opacity: 0.9;
  }
  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    .subtitle {
      font-size: 1rem;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <h1>🎨 Image Comparison</h1>
    <p class="subtitle">${baseName}</p>
    
    <div class="comparison-container" id="comparisonContainer">
      <div class="labels">
        <div class="label">📸 Original</div>
        <div class="label">⚡ Compressed</div>
      </div>
      <img src="data:${mimeType};base64,${compressedData.toString('base64')}" alt="Compressed Image">
      <div class="overlay" id="overlay">
        <img src="data:${mimeType};base64,${originalData.toString('base64')}" alt="Original Image">
      </div>
      <div class="handle" id="handle">
        <div class="handle-circle"></div>
      </div>
    </div>
    
    <p class="instructions">👆 Drag the slider to compare original vs compressed quality</p>
  </div>

<script>
  const container = document.getElementById('comparisonContainer');
  const overlay = document.getElementById('overlay');
  const handle = document.getElementById('handle');
  let isDown = false;

  function updateSlider(clientX) {
    let rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    let percentage = (offsetX / rect.width) * 100;
    handle.style.left = percentage + '%';
    overlay.style.width = percentage + '%';
  }

  handle.addEventListener('mousedown', (e) => {
    isDown = true;
    e.preventDefault();
  });

  handle.addEventListener('touchstart', (e) => {
    isDown = true;
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
  });

  document.addEventListener('touchend', () => {
    isDown = false;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    updateSlider(e.clientX);
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    updateSlider(e.touches[0].clientX);
  });

  container.addEventListener('click', (e) => {
    if (e.target === container || e.target.tagName === 'IMG') {
      updateSlider(e.clientX);
    }
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
}

module.exports = {
  generateComparisonPreview
};

