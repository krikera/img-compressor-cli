# Image Compressor

[![npm version](https://img.shields.io/npm/v/img-compressor-com.svg)](https://www.npmjs.com/package/img-compressor-com)
[![license](https://img.shields.io/npm/l/img-compressor-com.svg)](https://github.com/krikera/img-compressor-cli/blob/main/license)
[![node version](https://img.shields.io/node/v/img-compressor-com.svg)](https://nodejs.org)
[![downloads](https://img.shields.io/npm/dm/img-compressor-com.svg)](https://www.npmjs.com/package/img-compressor-com)

A CLI and API tool for compressing images with support for AVIF, WebP, GIF, SVG, mozjpeg integration, resize/crop capabilities, and interactive visual comparisons.

## Features

- **Multi-Format Support**: JPEG, PNG, WebP, AVIF, GIF, SVG, and TIFF
- **Format Conversion**: Convert images to modern formats like AVIF and WebP
- **Compression Options**:
  - Lossless Compression: Retains original quality
  - Lossy Compression: Customizable quality levels
  - Mozjpeg Integration: Enhanced JPEG compression
- **Image Transformation**: Resize and crop images during compression
- **Quality Presets**: Pre-configured settings (thumbnail, web-optimized, high-quality, print-quality)
- **Glob Pattern Support**: Process multiple files with patterns like `src/**/*.{jpg,png}`
- **Batch Processing**: Compress multiple images concurrently
- **Savings Report**: Detailed statistics including load time improvements
- **Visual Comparison**: Interactive HTML preview with slider to compare quality
- **CLI + API**: Use via command-line or integrate into Node.js projects
- **TypeScript Support**: Full type definitions included

## Installation

### For CLI Usage

Install globally:

```bash
npm install -g img-compressor-com
```

### For Programmatic Use

Install locally:

```bash
npm install img-compressor-com
```

## CLI Usage

### Compress a Single Image

```bash
img-compressor-com compress <input> <output> [options]
```

#### Options:

- `-c, --convert-to <format>`: Output format (jpeg, png, webp, avif, gif, svg, tiff)
- `-t, --compression-type <type>`: Compression type (lossy or lossless)
- `-l, --compression-level <level>`: Level (high, medium, low)
- `-q, --quality <quality>`: Quality (1-100)
- `--preset <preset>`: Quality preset (see below)
- `-p, --generate-preview`: Generate interactive HTML comparison
- `--no-mozjpeg`: Disable mozjpeg for JPEG
- `--no-strip-metadata`: Keep image metadata
- `--no-progressive`: Disable progressive JPEG
- `--resize-width <width>`: Resize width in pixels
- `--resize-height <height>`: Resize height in pixels
- `--resize-fit <fit>`: Fit mode (cover, contain, fill, inside, outside)
- `--crop-left/top/width/height`: Crop parameters

#### Examples:

```bash
# Convert to AVIF with high quality
img-compressor-com compress input.jpg output/ -c avif -q 85

# Use web-optimized preset
img-compressor-com compress input.png output/ -c webp --preset web-optimized

# Resize and compress
img-compressor-com compress input.jpg output/ -c webp --resize-width 1920 --resize-height 1080

# Generate visual comparison
img-compressor-com compress input.jpg output/ -c webp -q 80 -p
```

### Batch Compress Images

```bash
img-compressor-com compress-batch <input> <output> [options]
```

#### Input can be:
- Directory path: `./images`
- Glob pattern: `src/**/*.{jpg,png,gif}`
- Comma-separated files: `img1.jpg,img2.png`

#### Examples:

```bash
# Compress entire directory
img-compressor-com compress-batch ./images ./output -c webp --preset web-optimized

# Use glob pattern
img-compressor-com compress-batch "src/**/*.{jpg,png}" dist/images/ -c avif -q 80

# Process with higher concurrency
img-compressor-com compress-batch ./images ./output -c webp -y 10
```

### View Quality Presets

```bash
img-compressor-com presets
```

## Quality Presets

| Preset | Quality | Use Case |
|--------|---------|----------|
| `thumbnail` | 60 | Small thumbnails (auto-resizes to 300x300) |
| `web-optimized` | 80 | Balanced for web (recommended) |
| `high-quality` | 92 | High quality with moderate compression |
| `print-quality` | 95 | Near-lossless for print |

## Programmatic API Usage

### TypeScript/JavaScript

```typescript
import { compressImage, compressImages, QUALITY_PRESETS } from 'img-compressor-com';

// Compress single image with AVIF
const stats = await compressImage('input.jpg', 'output/', {
  convertTo: 'avif',
  quality: 80,
  generatePreview: true
});

console.log(`Saved ${stats.savings}% • ${stats.loadTimeImprovement}s faster`);

// Resize during compression
await compressImage('large.jpg', 'output/', {
  convertTo: 'webp',
  preset: 'web-optimized',
  resize: {
    width: 1920,
    height: 1080,
    fit: 'inside'
  }
});

// Batch compress with glob pattern
const results = await compressImages('src/images/**/*.{jpg,png}', 'dist/', {
  convertTo: 'webp',
  quality: 85,
  concurrency: 10,
  useMozjpeg: true
});

console.log(`Compressed ${results.length} images`);

// Crop and compress
await compressImage('input.jpg', 'output/', {
  convertTo: 'jpeg',
  crop: {
    left: 100,
    top: 100,
    width: 800,
    height: 600
  },
  quality: 90
});
```

### Advanced Options

```typescript
interface CompressionOptions {
  convertTo: 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'svg' | 'tiff';
  quality?: number;                    // 1-100
  compressionLevel?: 'high' | 'medium' | 'low';
  compressionType?: 'lossy' | 'lossless';
  preset?: 'thumbnail' | 'web-optimized' | 'high-quality' | 'print-quality';
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  crop?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  generatePreview?: boolean;
  useMozjpeg?: boolean;               // Default: true for JPEG
  stripMetadata?: boolean;            // Default: true
  progressive?: boolean;              // Default: true for JPEG
  concurrency?: number;               // Batch only, default: 5
}
```

## Output Statistics

Each compression returns detailed statistics:

```typescript
{
  inputSize: number;           // Original size in bytes
  outputSize: number;          // Compressed size in bytes
  savings: string;             // Percentage reduction
  originalLoadTime: string;    // Estimated load time (original)
  compressedLoadTime: string;  // Estimated load time (compressed)
  loadTimeImprovement: string; // Time saved in seconds
  inputFileName: string;       // Filename
}
```

## Visual Comparison Feature

The `--generate-preview` or `generatePreview: true` option creates an interactive HTML file with a draggable slider to compare original vs compressed images side-by-side.

This feature helps you:
- Visually assess compression quality
- Make informed decisions about quality settings
- Share comparisons with stakeholders

## Key Features

This package combines several useful features in one tool:

| Feature | Included |
|---------|----------|
| AVIF, WebP, GIF, SVG Support | ✅ |
| Mozjpeg Integration | ✅ |
| Interactive Visual Comparison | ✅ |
| Glob Pattern Support | ✅ |
| Quality Presets | ✅ |
| Resize/Crop | ✅ |
| TypeScript Definitions | ✅ |
| CLI + Programmatic API | ✅ |
| Load Time Statistics | ✅ |

## Examples

Check out the [examples](examples/) directory for more use cases:

```bash
node examples/example.js
```

## Supported Formats

| Format | Read | Write | Lossy | Lossless | Notes |
|--------|------|-------|-------|----------|-------|
| JPEG | ✅ | ✅ | ✅ | ❌ | Mozjpeg support |
| PNG | ✅ | ✅ | ✅ | ✅ | |
| WebP | ✅ | ✅ | ✅ | ✅ | |
| AVIF | ✅ | ✅ | ✅ | ✅ | Modern format |
| GIF | ✅ | ✅ | ✅ | ❌ | Gifsicle integration |
| SVG | ✅ | ✅ | ✅ | ✅ | SVGO optimization |
| TIFF | ✅ | ✅ | ✅ | ✅ | |

## Performance Tips

1. **Use AVIF or WebP** for modern format compression (typically smaller than JPEG)
2. **Enable mozjpeg** for improved JPEG compression (default: enabled)
3. **Adjust concurrency** based on your CPU cores
4. **Use glob patterns** for efficient batch processing
5. **Apply quality presets** for consistent results

## Contributing

Contributions are welcome! Please read our [contributing guidelines](contributing.md) before submitting a pull request.

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## Changelog

See [changelog.md](changelog.md) for version history and updates.

## License

This project is licensed under the MIT License. See the [license](license) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/krikera/img-compressor-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/krikera/img-compressor-cli/discussions)

## Acknowledgments

Built with:
- [Sharp](https://sharp.pixelplumbing.com/) - High performance image processing
- [Mozjpeg](https://github.com/imagemin/imagemin-mozjpeg) - Improved JPEG compression
- [SVGO](https://github.com/svg/svgo) - SVG optimization
- [Gifsicle](https://www.lcdf.org/gifsicle/) - GIF optimization

---

**Made with ❤️ by Krishna** • [npm](https://www.npmjs.com/package/img-compressor-com) • [GitHub](https://github.com/krikera/img-compressor-cli)
