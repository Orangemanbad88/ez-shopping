// AI Zone Detection via TensorFlow.js DeepLab segmentation
// Model and runtime are lazy-loaded to keep initial bundle small

let tf = null;
let deeplab = null;
let model = null;

// ADE20K class → app category mapping
const CLASS_TO_CATEGORY = {
  wall: { category: 'paint', label: 'Wall' },
  floor: { category: 'flooring', label: 'Floor' },
  flooring: { category: 'flooring', label: 'Floor' },
  ceiling: { category: 'lighting', label: 'Ceiling' },
  window: { category: 'blinds', label: 'Window' },
  'window-blind': { category: 'blinds', label: 'Window' },
  windowpane: { category: 'blinds', label: 'Window' },
  door: { category: 'doors', label: 'Door' },
  table: { category: 'furniture', label: 'Table' },
  chair: { category: 'furniture', label: 'Chair' },
  sofa: { category: 'furniture', label: 'Sofa' },
  bed: { category: 'furniture', label: 'Bed' },
  desk: { category: 'furniture', label: 'Desk' },
  cabinet: { category: 'cabinets', label: 'Cabinet' },
  counter: { category: 'countertops', label: 'Counter' },
  sink: { category: 'plumbing', label: 'Sink' },
  lamp: { category: 'lighting', label: 'Lamp' },
  chandelier: { category: 'lighting', label: 'Chandelier' },
  rug: { category: 'rugs', label: 'Rug' },
  curtain: { category: 'blinds', label: 'Curtain' },
  shelf: { category: 'furniture', label: 'Shelf' },
  plant: { category: 'outdoor', label: 'Plant' },
  stairway: { category: 'flooring', label: 'Stairs' },
};

export const loadSegmentationModel = async (onProgress) => {
  try {
    if (model) return model;

    if (onProgress) onProgress('Loading AI runtime...');
    tf = await import('@tensorflow/tfjs');

    if (onProgress) onProgress('Loading segmentation model...');
    deeplab = await import('@tensorflow-models/deeplab');

    model = await deeplab.load({
      base: 'pascal', // PASCAL VOC — good balance of accuracy and speed
      quantizationBytes: 2, // 2-byte quantization — smaller download
    });

    if (onProgress) onProgress('Ready');
    return model;
  } catch (err) {
    console.error('Failed to load segmentation model:', err);
    throw err;
  }
};

export const segmentFrame = async (videoElement) => {
  if (!model || !videoElement) return null;

  try {
    const result = await model.segment(videoElement);
    return result;
  } catch (err) {
    console.error('Segmentation error:', err);
    return null;
  }
};

export const extractZonesFromSegmentation = (result, frameWidth, frameHeight) => {
  if (!result || !result.segmentationMap) return [];

  const { segmentationMap, legend } = result;
  const width = result.width || frameWidth;
  const height = result.height || frameHeight;
  const zones = [];

  // For each detected class, compute bounding box
  for (const [className, classColor] of Object.entries(legend)) {
    const lowerName = className.toLowerCase().replace(/[_\s]+/g, '-');

    // Find matching category
    let mapping = null;
    for (const [key, val] of Object.entries(CLASS_TO_CATEGORY)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        mapping = val;
        break;
      }
    }
    if (!mapping) continue;

    // Compute bounding box from segmentation map
    let minX = width, maxX = 0, minY = height, maxY = 0;
    let pixelCount = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (
          segmentationMap[idx] === classColor[0] &&
          segmentationMap[idx + 1] === classColor[1] &&
          segmentationMap[idx + 2] === classColor[2]
        ) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          pixelCount++;
        }
      }
    }

    // Filter out tiny regions (< 3% of frame)
    const totalPixels = width * height;
    if (pixelCount < totalPixels * 0.03) continue;
    if (maxX <= minX || maxY <= minY) continue;

    zones.push({
      id: `ai-${lowerName}-${zones.length}`,
      category: mapping.category,
      label: mapping.label,
      x: (minX / width) * 100,
      y: (minY / height) * 100,
      width: ((maxX - minX) / width) * 100,
      height: ((maxY - minY) / height) * 100,
      confidence: pixelCount / totalPixels,
      className: lowerName,
    });
  }

  return zones;
};

export const isModelLoaded = () => model !== null;
