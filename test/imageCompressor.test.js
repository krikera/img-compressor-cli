const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { compressImage, compressImages, QUALITY_PRESETS } = require('../src/index');

describe('Image Compressor', function () {
  this.timeout(15000);

  const outputDir = path.resolve(__dirname, 'output');
  const inputDir = path.resolve(__dirname, 'assets');

  before(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  after(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
  });

  describe('compressImage()', () => {
    it('should compress an image with lossy compression', async () => {
      const inputImagePath = path.join(inputDir, 'img.jpg');
      const outputImagePath = path.join(outputDir, 'img.webp');

      const result = await compressImage(inputImagePath, outputDir, {
        compressionLevel: 'medium',
        convertTo: 'webp',
        compressionType: 'lossy',
      });

      expect(result).to.have.property('inputSize').that.is.a('number');
      expect(result).to.have.property('outputSize').that.is.a('number');
      expect(parseFloat(result.savings)).to.be.greaterThan(0);
      expect(fs.existsSync(outputImagePath)).to.be.true;
    });

    it('should compress an image with lossless compression', async () => {
      const inputImagePath = path.join(inputDir, 'img1.jpg');
      const outputImagePath = path.join(outputDir, 'img1.png');

      const result = await compressImage(inputImagePath, outputDir, {
        convertTo: 'png',
        compressionType: 'lossless',
      });

      expect(result).to.have.property('inputSize').that.is.a('number');
      expect(result).to.have.property('outputSize').that.is.a('number');
      expect(fs.existsSync(outputImagePath)).to.be.true;
    });

    it('should compress to AVIF format', async () => {
      const inputImagePath = path.join(inputDir, 'img.jpg');
      const outputImagePath = path.join(outputDir, 'img-avif.avif');

      const result = await compressImage(inputImagePath, outputDir, {
        convertTo: 'avif',
        quality: 75,
        inputFileName: 'img-avif.jpg'
      });

      expect(result).to.have.property('inputSize').that.is.a('number');
      expect(result).to.have.property('outputSize').that.is.a('number');
      expect(fs.existsSync(outputImagePath)).to.be.true;
    });

    it('should apply quality presets', async () => {
      const inputImagePath = path.join(inputDir, 'img.jpg');
      const outputImagePath = path.join(outputDir, 'img-preset.webp');

      const result = await compressImage(inputImagePath, outputDir, {
        convertTo: 'webp',
        preset: 'web-optimized',
        inputFileName: 'img-preset.jpg'
      });

      expect(result).to.have.property('inputSize').that.is.a('number');
      expect(result).to.have.property('outputSize').that.is.a('number');
      expect(fs.existsSync(outputImagePath)).to.be.true;
    });

    it('should resize image during compression', async () => {
      const inputImagePath = path.join(inputDir, 'img.jpg');
      const outputImagePath = path.join(outputDir, 'img-resized.jpeg');

      const result = await compressImage(inputImagePath, outputDir, {
        convertTo: 'jpeg',
        quality: 80,
        resize: {
          width: 800,
          height: 600,
          fit: 'inside'
        },
        inputFileName: 'img-resized.jpg'
      });

      expect(result).to.have.property('inputSize').that.is.a('number');
      expect(result).to.have.property('outputSize').that.is.a('number');
      expect(fs.existsSync(outputImagePath)).to.be.true;
    });

    it('should use mozjpeg for JPEG compression', async () => {
      const inputImagePath = path.join(inputDir, 'img.jpg');
      const outputImagePath = path.join(outputDir, 'img-mozjpeg.jpeg');

      const result = await compressImage(inputImagePath, outputDir, {
        convertTo: 'jpeg',
        quality: 85,
        useMozjpeg: true,
        inputFileName: 'img-mozjpeg.jpg'
      });

      expect(result).to.have.property('inputSize').that.is.a('number');
      expect(result).to.have.property('outputSize').that.is.a('number');
      expect(fs.existsSync(outputImagePath)).to.be.true;
    });
  });

  describe('compressImages()', () => {
    it('should batch compress images in a directory', async () => {
      const batchInputDir = path.join(inputDir, 'batch');
      const batchOutputDir = path.join(outputDir, 'batch');
      
      const result = await compressImages(
        batchInputDir,
        batchOutputDir,
        {
          compressionLevel: 'low',
          convertTo: 'jpeg',
          compressionType: 'lossy',
        }
      );

      expect(result).to.be.an('array').that.is.not.empty;
      result.forEach(res => {
        expect(res).to.have.property('inputFileName');
        if (!res.error) {
          const outputFileName = path.basename(res.inputFileName, path.extname(res.inputFileName)) + '.jpeg';
          expect(fs.existsSync(path.join(batchOutputDir, outputFileName))).to.be.true;
        }
      });
    });

    it('should batch compress using glob pattern', async () => {
      const globPattern = path.join(inputDir, '*.jpg');
      const batchOutputDir = path.join(outputDir, 'glob');
      
      const result = await compressImages(
        globPattern,
        batchOutputDir,
        {
          convertTo: 'webp',
          quality: 80,
        }
      );

      expect(result).to.be.an('array').that.is.not.empty;
      result.forEach(res => {
        expect(res).to.have.property('inputFileName');
      });
    });

    it('should batch compress array of files', async () => {
      const files = [
        path.join(inputDir, 'img.jpg'),
        path.join(inputDir, 'img1.jpg')
      ];
      const batchOutputDir = path.join(outputDir, 'array');
      
      const result = await compressImages(
        files,
        batchOutputDir,
        {
          convertTo: 'png',
          quality: 85,
          concurrency: 2
        }
      );

      expect(result).to.be.an('array').with.lengthOf(2);
      result.forEach(res => {
        expect(res).to.have.property('inputFileName');
      });
    });
  });

  describe('Quality Presets', () => {
    it('should export QUALITY_PRESETS', () => {
      expect(QUALITY_PRESETS).to.be.an('object');
      expect(QUALITY_PRESETS).to.have.property('thumbnail');
      expect(QUALITY_PRESETS).to.have.property('web-optimized');
      expect(QUALITY_PRESETS).to.have.property('high-quality');
      expect(QUALITY_PRESETS).to.have.property('print-quality');
    });

    it('should have valid preset configurations', () => {
      Object.values(QUALITY_PRESETS).forEach(preset => {
        expect(preset).to.have.property('quality').that.is.a('number');
        expect(preset).to.have.property('description').that.is.a('string');
      });
    });
  });
});
