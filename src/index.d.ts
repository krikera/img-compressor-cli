declare module 'img-compressor-com' {
  /**
   * Resize options for image transformation
   */
  export interface ResizeOptions {
    /** Width in pixels */
    width?: number;
    /** Height in pixels */
    height?: number;
    /** How the image should be resized to fit both provided dimensions */
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    /** Position when using fit cover or contain */
    position?: string | number;
    /** Background color when using fit contain */
    background?: string;
    /** Do not enlarge if the width or height are already less than the specified dimensions */
    withoutEnlargement?: boolean;
  }

  /**
   * Crop options for extracting a region
   */
  export interface CropOptions {
    /** Zero-indexed offset from left edge */
    left: number;
    /** Zero-indexed offset from top edge */
    top: number;
    /** Width of region to extract */
    width: number;
    /** Height of region to extract */
    height: number;
  }

  /**
   * Quality preset names
   */
  export type QualityPreset = 'thumbnail' | 'web-optimized' | 'high-quality' | 'print-quality';

  /**
   * Compression type
   */
  export type CompressionType = 'lossy' | 'lossless';

  /**
   * Compression level
   */
  export type CompressionLevel = 'high' | 'medium' | 'low';

  /**
   * Supported output formats
   */
  export type OutputFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif' | 'svg';

  /**
   * Options for image compression
   */
  export interface CompressionOptions {
    /** Output format for the compressed image */
    convertTo: OutputFormat;
    /** Quality level (1-100) for lossy compression */
    quality?: number;
    /** Compression level preset (high, medium, low) */
    compressionLevel?: CompressionLevel;
    /** Compression type (lossy or lossless) */
    compressionType?: CompressionType;
    /** Quality preset to use */
    preset?: QualityPreset;
    /** Resize options */
    resize?: ResizeOptions;
    /** Crop options */
    crop?: CropOptions;
    /** Generate HTML comparison preview */
    generatePreview?: boolean;
    /** Use mozjpeg for JPEG compression (better quality) */
    useMozjpeg?: boolean;
    /** Strip image metadata */
    stripMetadata?: boolean;
    /** Create progressive JPEG */
    progressive?: boolean;
    /** Input filename (for internal use) */
    inputFileName?: string;
  }

  /**
   * Options for batch compression
   */
  export interface BatchCompressionOptions extends CompressionOptions {
    /** Number of concurrent compression operations */
    concurrency?: number;
  }

  /**
   * Statistics returned after compression
   */
  export interface CompressionStats {
    /** Original file size in bytes */
    inputSize: number;
    /** Compressed file size in bytes */
    outputSize: number;
    /** Percentage of size reduction */
    savings: string;
    /** Estimated load time for original image (seconds) */
    originalLoadTime: string;
    /** Estimated load time for compressed image (seconds) */
    compressedLoadTime: string;
    /** Load time improvement in seconds */
    loadTimeImprovement: string;
    /** Name of the input file */
    inputFileName: string;
  }

  /**
   * Result of compression (can be stats or error)
   */
  export type CompressionResult = CompressionStats | { error: string; inputFileName: string };

  /**
   * Quality preset configuration
   */
  export interface QualityPresetConfig {
    quality: number;
    resize: ResizeOptions | null;
    description: string;
  }

  /**
   * Available quality presets
   */
  export const QUALITY_PRESETS: {
    [key in QualityPreset]: QualityPresetConfig;
  };

  /**
   * Compress a single image
   * 
   * @param inputPath - Path to the input image file
   * @param outputPath - Directory path where the compressed image will be saved
   * @param options - Compression options
   * @returns Promise resolving to compression statistics
   * 
   * @example
   * ```typescript
   * import { compressImage } from 'img-compressor-com';
   * 
   * const stats = await compressImage('input.jpg', 'output/', {
   *   convertTo: 'webp',
   *   quality: 80,
   *   resize: { width: 1920, height: 1080, fit: 'inside' }
   * });
   * 
   * console.log(`Saved ${stats.savings}% of file size`);
   * ```
   */
  export function compressImage(
    inputPath: string,
    outputPath: string,
    options: CompressionOptions
  ): Promise<CompressionStats>;

  /**
   * Compress multiple images in batch
   * 
   * @param inputPaths - Array of file paths, directory path, or glob pattern
   * @param outputPath - Directory path where compressed images will be saved
   * @param options - Batch compression options
   * @returns Promise resolving to array of compression results
   * 
   * @example
   * ```typescript
   * import { compressImages } from 'img-compressor-com';
   * 
   * // Using glob pattern
   * const results = await compressImages('src/images/**\/*.{jpg,png}', 'dist/images/', {
   *   convertTo: 'webp',
   *   preset: 'web-optimized',
   *   concurrency: 10
   * });
   * 
   * console.log(`Compressed ${results.length} images`);
   * ```
   */
  export function compressImages(
    inputPaths: string | string[],
    outputPath: string,
    options: BatchCompressionOptions
  ): Promise<CompressionResult[]>;
}

