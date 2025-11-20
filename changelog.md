# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-20

### 🚀 Major Feature Release

### Added
- **AVIF Format Support** - Modern image format with efficient compression
- **GIF Support** - Compress animated and static GIFs with gifsicle
- **SVG Support** - Optimize SVG files with SVGO
- **Mozjpeg Integration** - Improved JPEG compression with mozjpeg encoder
- **Resize/Crop Functionality** - Transform images during compression
- **Quality Presets** - Pre-configured settings (thumbnail, web-optimized, high-quality, print-quality)
- **Glob Pattern Support** - Process files with patterns like `src/**/*.{jpg,png}`
- **TypeScript Definitions** - Full type support for TypeScript projects
- **Progressive JPEG Option** - Enable/disable progressive rendering
- **Metadata Stripping Control** - Choose whether to keep or remove metadata
- **Enhanced Visual Comparison** - Improved HTML preview with modern UI and touch support

### Changed
- Updated Sharp to v0.33.5
- Updated Commander to v12.1.0
- Improved error handling with detailed messages
- Enhanced CLI output with emoji indicators and better formatting
- Better batch processing with error recovery
- Improved preview HTML with responsive design

### Performance
- Optimized concurrent processing
- Better memory management for large batches
- Faster JPEG compression with mozjpeg

## [1.0.2] - 2025-11-20

### Fixed
- Fixed CLI binary path in package.json (was pointing to wrong location)
- Fixed incorrect package name in README documentation
- Added missing batch test directory
- Completed MIT license file with full legal text

### Added
- Added comprehensive .gitignore file
- Added .npmignore for better npm package distribution
- Added npm badges to README (version, license, downloads)
- Added more descriptive keywords to package.json
- Added engines field to specify Node.js version requirements
- Added files field to control package contents
- Added prepublishOnly script to run tests before publishing
- Added contributing guidelines
- Added proper changelog documentation

### Changed
- Updated Sharp dependency to latest version (^0.33.5)
- Updated Commander dependency to latest version (^12.1.0)
- Updated Mocha and Chai to latest versions
- Enhanced README with support and acknowledgments sections

## [1.0.1] - Previous Release

### Added
- Initial release with core functionality
- Single image compression
- Batch image compression
- Lossy and lossless compression modes
- Multiple format support (JPEG, PNG, WebP, TIFF)
- HTML comparison preview generation
- Load time estimation
- CLI interface
- Programmatic API

## [1.0.0] - Initial Release

### Added
- Basic image compression functionality
- Command-line interface
- Sharp integration for image processing
