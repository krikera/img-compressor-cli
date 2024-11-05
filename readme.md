# Intelligent Image Compressor with Quality Comparison

An efficient CLI and API tool for compressing images, with options for lossy and lossless compression, format conversion, batch processing, and interactive visual comparisons. 

## Features

- **Multi-Format Support**: Supports popular image formats like JPEG, PNG, WebP, and TIFF.
- **Format Conversion**: Convert images to different formats, such as PNG to WebP or JPEG.
- **Compression Options**:
  - **Lossless Compression**: Retains original quality.
  - **Lossy Compression**: Allows customizable compression levels and quality.
- **Compression Levels**: Use preset compression levels (`high`, `medium`, `low`) for convenient lossy compression.
- **Custom Quality Setting**: Define specific quality (1-100) for finer control.
- **Batch Processing**: Compress multiple images in one command.
- **Savings Report**: Displays original size, compressed size, size reduction, and estimated load time improvements.
- **Before and After Visual Comparison**: Generates an HTML preview with a slider to compare compressed and original images.
- **Command-Line Interface (CLI)**: Accessible through the command line for seamless integration into workflows.
- **Programmatic API**: Can be integrated into Node.js projects for automated image optimization.

## Installation

### For CLI Usage

Install the package globally:

```bash
npm install -g img-compressor-cli
```

### For Programmatic Use

Install the package locally to use it as a library in your Node.js project:

```bash
npm install img-compressor-cli
```

## CLI Usage

After installation, the CLI can be used with the following commands:

### Compress a Single Image

```bash
img-compressor-cli compress <input> <output> [options]
```

Arguments:
- `<input>`: Path to the input image.
- `<output>`: Path where the compressed image will be saved.

Options:
- `-c, --convert-to <format>`: Convert to a specific format (jpeg, png, webp, tiff). Default is jpeg.
- `-t, --compression-type <type>`: Compression type (lossy or lossless). Default is lossy.
- `-l, --compression-level <level>`: Compression level (high, medium, low).
- `-q, --quality <quality>`: Quality level for compression (1-100).
- `-p, --generate-preview`: Generates a before-and-after preview HTML file.

Example:
```bash
img-compressor-cli compress input.jpg output_folder/ -c webp -t lossy -l high -q 80 -p
```

### Batch Compress Images

```bash
img-compressor-cli compress-batch <input> <output> [options]
```

Arguments:
- `<input>`: Path to the input directory or a comma-separated list of file paths.
- `<output>`: Path where the compressed images will be saved.

Options:
- `-c, --convert-to <format>`: Format to convert the images to (e.g., jpeg, png, webp, tiff).
- `-t, --compression-type <type>`: Compression type (lossy or lossless).
- `-l, --compression-level <level>`: Compression level (high, medium, low).
- `-q, --quality <quality>`: Quality level for compression (1-100).
- `-p, --generate-preview`: Generates HTML comparison previews for each image.
- `-y, --concurrency <number>`: Number of concurrent compression tasks. Default is 5.

Example:
```bash
img-compressor-cli compress-batch input_folder output_folder -c png -t lossless -y 10 -p
```

## Programmatic API Usage

### Importing and Using in Code

You can also use the compression functions directly in your JavaScript or TypeScript code.

```javascript
const { compressImage, compressImages } = require('img-compressor-cli');

// Compress a single image
compressImage('path/to/input.jpg', 'path/to/output', {
  convertTo: 'webp',
  compressionType: 'lossy',
  quality: 80,
  generatePreview: true,
})
  .then(stats => console.log('Compression stats:', stats))
  .catch(error => console.error('Error:', error));

// Compress multiple images in batch
compressImages('path/to/input/folder', 'path/to/output/folder', {
  convertTo: 'jpeg',
  compressionType: 'lossless',
  concurrency: 5,
})
  .then(results => console.log('Batch compression results:', results))
  .catch(error => console.error('Error:', error));
```

## Output Statistics

Each compression operation returns statistics such as:

- Original Size: Size of the original file in KB.
- Compressed Size: Size of the compressed file in KB.
- Size Reduced By: Percentage reduction in size.
- Estimated Load Time Improvements: Estimated load time improvements based on compressed file size.

## License

This project is licensed under the MIT License.