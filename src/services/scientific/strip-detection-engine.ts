/**
 * Strip Detection Engine
 *
 * Determines whether a camera frame or uploaded image contains an H₂S
 * dosimeter / sensing strip, as opposed to a random photo (face, wall,
 * document, outdoor scene, etc.).
 *
 * Current implementation: canvas pixel-sampling + CIELAB colour statistics.
 * Works well against clearly wrong images (blue sky, green vegetation,
 * pure-white walls, dark scenes). False-positive rate is higher for images
 * that share the dosimeter's beige/tan colour range (cardboard, skin, paper).
 *
 * ─── Scope for real replacement ────────────────────────────────────────────
 * Replace `classifyByColour()` with a TensorFlow.js binary classifier:
 *
 *   import * as tf from '@tensorflow/tfjs';
 *   const model = await tf.loadLayersModel('/models/strip-classifier/model.json');
 *   const tensor = tf.browser.fromPixels(canvas).expandDims(0);
 *   const [prob] = model.predict(tensor) as tf.Tensor[];
 *   const confidence = (await prob.data())[0]; // P(is_dosimeter)
 *
 * Training data requirement: ~500 positive (dosimeter) + ~500 negative images,
 * labelled with strip bounding boxes.  MobileNetV2 fine-tune is sufficient.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { ColorAnalysisEngine } from './color-analysis-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StripDetectionResult {
  /** Whether this image plausibly contains an H₂S dosimeter strip */
  isStrip: boolean;
  /** Confidence in the decision, 0–1 */
  confidence: number;
  /** Human-readable reason for rejection, null when accepted */
  rejectionReason: string | null;
  /**
   * Diagnostic colour statistics — useful for debugging and future
   * calibration of the rule thresholds.
   */
  diagnostics: {
    meanL: number;
    meanA: number;
    meanB: number;
    /** Average pixel-to-pixel ΔE (colour entropy proxy) */
    colourEntropy: number;
    /** Fraction of sampled pixels whose hue is in the dosimeter range */
    dosimeterHueFraction: number;
  };
}

// ---------------------------------------------------------------------------
// Colour-range constants (prototype values — adjust from lab experiments)
// ---------------------------------------------------------------------------

/**
 * Dosimeter sensing-patch colour envelope in CIELAB.
 *
 * Unexposed Cu-PAN strip: pale yellow/cream  L≈90 a≈0  b≈+8
 * Highly exposed strip:   deep brown/orange  L≈50 a≈+15 b≈+30
 *
 * We accept anything in this envelope as plausibly a dosimeter.
 */
const STRIP_L_MIN = 35;   // Darkest acceptable (heavily exposed)
const STRIP_L_MAX = 97;   // Brightest acceptable (fresh/unexposed)
const STRIP_A_MIN = -8;   // Slight green allowed (humidity artifacts)
const STRIP_A_MAX = 22;   // Max red-orange shift
const STRIP_B_MIN = 2;    // Minimum yellow shift expected
const STRIP_B_MAX = 45;   // Max yellow-brown shift

/**
 * Minimum fraction of sampled pixels that must fall in the strip colour
 * envelope for the image to be accepted.
 */
const MIN_STRIP_HUE_FRACTION = 0.30;

/**
 * Minimum colour entropy (mean inter-pixel ΔE) to reject a pure solid-colour
 * surface (blank wall, white paper, phone screen, etc.).
 */
const MIN_COLOUR_ENTROPY = 1.5;

/**
 * Pixel sampling grid — we sample this many points in each axis from the
 * centre 60% of the image (where the strip should be if framed correctly).
 */
const SAMPLE_GRID = 20; // 20×20 = 400 samples

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Analyse a JPEG/PNG data-URI to determine whether it likely contains
 * an H₂S dosimeter strip.
 *
 * Must be called in a browser context (uses HTMLCanvasElement / Image).
 */
export async function detectStrip(dataUrl: string): Promise<StripDetectionResult> {
  // ── Load image onto canvas ─────────────────────────────────────────────
  let pixels: ImageData;
  let imgWidth: number;
  let imgHeight: number;

  try {
    ({ pixels, width: imgWidth, height: imgHeight } = await loadImagePixels(dataUrl));
  } catch {
    return rejected('Could not decode image for analysis.', 0, {
      meanL: 0, meanA: 0, meanB: 0, colourEntropy: 0, dosimeterHueFraction: 0,
    });
  }

  // ── Sample pixel grid from centre 60% of image ────────────────────────
  const marginX = Math.floor(imgWidth * 0.20);
  const marginY = Math.floor(imgHeight * 0.20);
  const roiW = imgWidth - 2 * marginX;
  const roiH = imgHeight - 2 * marginY;

  const labSamples: Array<{ L: number; a: number; b: number }> = [];

  for (let sy = 0; sy < SAMPLE_GRID; sy++) {
    for (let sx = 0; sx < SAMPLE_GRID; sx++) {
      const px = marginX + Math.floor((sx / (SAMPLE_GRID - 1)) * (roiW - 1));
      const py = marginY + Math.floor((sy / (SAMPLE_GRID - 1)) * (roiH - 1));
      const idx = (py * imgWidth + px) * 4;
      const r = pixels.data[idx];
      const g = pixels.data[idx + 1];
      const b = pixels.data[idx + 2];
      labSamples.push(ColorAnalysisEngine.rgbToLab(r, g, b));
    }
  }

  // ── Compute statistics ─────────────────────────────────────────────────
  const n = labSamples.length;
  const meanL = labSamples.reduce((s, p) => s + p.L, 0) / n;
  const meanA = labSamples.reduce((s, p) => s + p.a, 0) / n;
  const meanB = labSamples.reduce((s, p) => s + p.b, 0) / n;

  // Colour entropy: average ΔE of each sample vs the mean colour
  const colourEntropy =
    labSamples.reduce(
      (s, p) =>
        s + ColorAnalysisEngine.calculateDeltaE(meanL, meanA, meanB, p.L, p.a, p.b),
      0,
    ) / n;

  // Fraction of pixels in the dosimeter colour envelope
  const dosimeterHueFraction =
    labSamples.filter(
      (p) =>
        p.L >= STRIP_L_MIN &&
        p.L <= STRIP_L_MAX &&
        p.a >= STRIP_A_MIN &&
        p.a <= STRIP_A_MAX &&
        p.b >= STRIP_B_MIN &&
        p.b <= STRIP_B_MAX,
    ).length / n;

  const diagnostics = {
    meanL: Math.round(meanL * 10) / 10,
    meanA: Math.round(meanA * 10) / 10,
    meanB: Math.round(meanB * 10) / 10,
    colourEntropy: Math.round(colourEntropy * 10) / 10,
    dosimeterHueFraction: Math.round(dosimeterHueFraction * 100) / 100,
  };

  // ── ⚙ SCOPE: Replace the block below with a TF.js classifier call ─────
  return classifyByColour(diagnostics);
  // ────────────────────────────────────────────────────────────────────────
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Rule-based strip/non-strip classifier using only colour statistics.
 *
 * SCOPE: This entire function is the swap point for a TF.js classifier.
 * When a trained model is available, call it here and map the probability
 * output to StripDetectionResult.
 */
function classifyByColour(
  diag: StripDetectionResult['diagnostics'],
): StripDetectionResult {
  const { meanL, meanA, meanB, colourEntropy, dosimeterHueFraction } = diag;

  // ── Rule 1: Image too dark → not a dosimeter (or unlit scan) ──────────
  if (meanL < 25) {
    return rejected(
      'Image is too dark. Ensure good lighting and re-scan.',
      0.85,
      diag,
    );
  }

  // ── Rule 2: Solid colour / blank surface → no strip present ───────────
  if (colourEntropy < MIN_COLOUR_ENTROPY) {
    return rejected(
      'No dosimeter patch detected. Position the wristband inside the frame.',
      0.80,
      diag,
    );
  }

  // ── Rule 3: Strongly blue/cyan dominant → outdoor sky, screen, etc. ───
  if (meanB < -10 && meanA < 0) {
    return rejected(
      'Image does not appear to be a dosimeter. Point camera at the wristband patch.',
      0.88,
      diag,
    );
  }

  // ── Rule 4: Strongly green dominant → vegetation, painted surface ──────
  if (meanA < -15) {
    return rejected(
      'Image does not appear to be a dosimeter. Point camera at the wristband patch.',
      0.82,
      diag,
    );
  }

  // ── Rule 5: Not enough dosimeter-hue pixels in the centre crop ─────────
  if (dosimeterHueFraction < MIN_STRIP_HUE_FRACTION) {
    return rejected(
      'Dosimeter patch not clearly visible. Centre the patch in the frame and re-scan.',
      0.70,
      diag,
    );
  }

  // ── Accept ─────────────────────────────────────────────────────────────
  // Confidence is higher when the dosimeter-hue fraction is higher
  const confidence = Math.min(0.95, 0.55 + dosimeterHueFraction * 0.8);
  return {
    isStrip: true,
    confidence: Math.round(confidence * 100) / 100,
    rejectionReason: null,
    diagnostics: diag,
  };
}

function rejected(
  reason: string,
  confidence: number,
  diagnostics: StripDetectionResult['diagnostics'],
): StripDetectionResult {
  return { isStrip: false, confidence, rejectionReason: reason, diagnostics };
}

/**
 * Load a data-URI image onto an off-screen canvas and return its pixel data.
 * Browser-only.
 */
function loadImagePixels(
  dataUrl: string,
): Promise<{ pixels: ImageData; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      // Downscale to max 400px wide for performance (colour stats don't need full res)
      const scale = Math.min(1, 400 / img.width);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas 2D unavailable')); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve({ pixels: ctx.getImageData(0, 0, w, h), width: w, height: h });
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
}
