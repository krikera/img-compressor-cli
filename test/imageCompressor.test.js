const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { compressImage, compressImages } = require('../src/index');

describe('Image Compressor', function () {
  this.timeout(10000);

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
      const outputImagePath = path.join(outputDir, 'test-image.webp');

      try {
        const result = await compressImage(inputImagePath, outputDir, {
          compressionLevel: 'medium',
          convertTo: 'webp',
          compressionType: 'lossy',
        });

        expect(result).to.have.property('inputSize').that.is.a('number');
        expect(result).to.have.property('outputSize').that.is.a('number');
        expect(parseFloat(result.savings)).to.be.greaterThan(0);
        expect(fs.existsSync(outputImagePath)).to.be.true;
      } catch (error) {
        console.error('Error during lossy compression test:', error);
        throw error;
      }
    });

    it('should compress an image with lossless compression', async () => {
      const inputImagePath = path.join(inputDir, 'img1.jpg');
      const outputImagePath = path.join(outputDir, 'test-image1.png');

      try {
        const result = await compressImage(inputImagePath, outputDir, {
          convertTo: 'png',
          compressionType: 'lossless',
        });

        expect(result).to.have.property('inputSize').that.is.a('number');
        expect(result).to.have.property('outputSize').that.is.a('number');
        expect(fs.existsSync(outputImagePath)).to.be.true;
      } catch (error) {
        console.error('Error during lossless compression test:', error);
        throw error;
      }
    });
  });

  describe('compressImages()', () => {
    it('should batch compress images in a directory', async () => {
      const batchOutputDir = path.join(outputDir, 'batch');
      const result = await compressImages(
        path.join(inputDir, 'batch'),
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
        expect(fs.existsSync(path.join(batchOutputDir, res.inputFileName))).to.be.true;
      });
    });
  });
});