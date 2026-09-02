/**
 * OCR Engine — Demo Code Extraction
 *
 * Uses Tesseract.js (in-browser WASM OCR) to read short alphanumeric codes
 * printed on physical H₂S dosimeter wristbands.  The expected format is
 * a 3-character code matching [A-Z][0-9]{2}, e.g. "H01", "N01", "E01".
 *
 * Tesseract.js is lazy-loaded on first call (≈3–5 MB WASM download), then
 * cached for the session.  Subsequent calls take 500 ms–2 s depending on
 * device performance.
 *
 * ─── Image pre-processing ──────────────────────────────────────────────────
 * Before OCR we:
 *   1. Crop to the centre 40 % of the image (where the code is expected).
 *   2. Convert to greyscale.
 *   3. Stretch contrast (histogram normalisation).
 *   4. Upscale 2× (Tesseract accuracy improves with larger text).
 * These steps are done on an off-screen <canvas> — no server round-trip.
 *
 * ─── Limitations ──────────────────────────────────────────────────────────
 *   • Printed codes on clean labels:   ~90 % accuracy
 *   • Bold handwriting (pen, marker):  ~65 % accuracy
 *   • Light pencil / cursive:          not reliable
 *
 * ─── Scope for replacement ─────────────────────────────────────────────────
 * To handle arbitrary handwriting, replace `runTesseract()` with:
 *   a) Google Cloud Vision handwriting API (network call), or
 *   b) An on-device HTR (Handwritten Text Recognition) TF.js model.
 * The rest of this file (preprocessing, pattern matching, caching) stays.
 * ────────────────────────────────────────────────────────────────────────────
 */

// Tesseract.js is dynamically imported to keep the initial bundle small.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tesseractWorker: any = null;
let workerReady = false;
let workerInitialising = false;
const workerReadyPromise: { resolve?: () => void; reject?: (e: unknown) => void } = {};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OcrResult {
  /** Extracted code (e.g. "H01"), null if not found */
  code: string | null;
  /** Raw OCR text (useful for debugging) */
  rawText: string;
  /** OCR confidence for the recognised code, 0–100 */
  confidence: number;
  /** Whether Tesseract was actually run (false = fast-path skip) */
  ocrRan: boolean;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extract a demo code from a captured/uploaded image data-URI.
 *
 * @param dataUrl - JPEG or PNG data-URI from camera or file upload.
 * @param timeoutMs - Maximum time to wait for OCR (default 8 000 ms).
 * @returns OcrResult with the extracted code or null.
 */
export async function extractCodeFromImage(
  dataUrl: string,
  timeoutMs = 8_000,
): Promise<OcrResult> {
  // ── Pre-process: crop + greyscale + contrast-stretch ─────────────────
  let processedUrl: string;
  try {
    processedUrl = await preprocessImageForOcr(dataUrl);
  } catch {
    return { code: null, rawText: '', confidence: 0, ocrRan: false };
  }

  // ── Run Tesseract with timeout ─────────────────────────────────────────
  try {
    const result = await Promise.race([
      runTesseract(processedUrl),
      timeout<OcrResult>(timeoutMs, { code: null, rawText: '', confidence: 0, ocrRan: true }),
    ]);
    return result;
  } catch {
    return { code: null, rawText: '', confidence: 0, ocrRan: true };
  }
}

/**
 * Release the Tesseract worker.  Call when the scan page unmounts.
 */
export async function disposeOcrEngine(): Promise<void> {
  if (tesseractWorker) {
    try { await tesseractWorker.terminate(); } catch { /* ignore */ }
    tesseractWorker = null;
    workerReady = false;
    workerInitialising = false;
  }
}

// ---------------------------------------------------------------------------
// Internal: Tesseract runner
// ---------------------------------------------------------------------------

/**
 * ⚙ SCOPE: This function is the swap point for alternative OCR backends.
 *
 * To use Google Cloud Vision:
 *   const response = await fetch('/api/ocr', { method: 'POST', body: JSON.stringify({ image: dataUrl }) });
 *   const { text } = await response.json();
 *   return matchCode(text, 100);
 *
 * To use a TF.js HTR model:
 *   const tensor = tf.browser.fromPixels(canvas);
 *   const decoded = await htrModel.recognise(tensor);
 *   return matchCode(decoded, 80);
 */
async function runTesseract(processedUrl: string): Promise<OcrResult> {
  const worker = await getOrCreateWorker();

  // Tesseract.js v4 API
  const { data } = await worker.recognize(processedUrl);
  const rawText: string = (data.text ?? '').trim();
  const confidence: number = data.confidence ?? 0;

  return matchCode(rawText, confidence);
}

async function getOrCreateWorker() {
  if (workerReady && tesseractWorker) return tesseractWorker;

  if (!workerInitialising) {
    workerInitialising = true;
    // Lazy import — only loaded when OCR is first needed
    const { createWorker } = await import('tesseract.js');

    tesseractWorker = await createWorker('eng', 1, {
      // Use the public CDN for WASM + trained data (no self-hosting required)
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5',
      logger: () => {}, // Silence progress logs
    });

    // Restrict to uppercase letters + digits for speed and accuracy
    await tesseractWorker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      tessedit_pageseg_mode: '8', // PSM_SINGLE_WORD — short codes
    });

    workerReady = true;
    workerInitialising = false;
    if (workerReadyPromise.resolve) workerReadyPromise.resolve();
  }

  // If another call triggered init, wait for it
  if (!workerReady) {
    await new Promise<void>((res, rej) => {
      workerReadyPromise.resolve = res;
      workerReadyPromise.reject = rej;
    });
  }

  return tesseractWorker;
}

// ---------------------------------------------------------------------------
// Internal: image pre-processing
// ---------------------------------------------------------------------------

/**
 * Crops centre 40 % of the image, converts to greyscale,
 * stretches contrast, and upscales 2× for better OCR accuracy.
 */
async function preprocessImageForOcr(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      // ── Crop centre 40% ──────────────────────────────────────────────
      const cropX = Math.floor(img.width * 0.30);
      const cropY = Math.floor(img.height * 0.30);
      const cropW = Math.floor(img.width * 0.40);
      const cropH = Math.floor(img.height * 0.40);

      // Upscale 2× and at least 200×200 for Tesseract
      const outW = Math.max(200, cropW * 2);
      const outH = Math.max(200, cropH * 2);

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas unavailable')); return; }

      // Draw cropped+upscaled
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

      // ── Greyscale + contrast stretch ─────────────────────────────────
      const imageData = ctx.getImageData(0, 0, outW, outH);
      const d = imageData.data;
      let minV = 255; let maxV = 0;

      // First pass: compute luminance range
      for (let i = 0; i < d.length; i += 4) {
        const lum = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
        if (lum < minV) minV = lum;
        if (lum > maxV) maxV = lum;
      }

      const range = maxV - minV || 1;

      // Second pass: greyscale + stretch
      for (let i = 0; i < d.length; i += 4) {
        const lum = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
        const stretched = Math.round(((lum - minV) / range) * 255);
        d[i] = d[i + 1] = d[i + 2] = stretched;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
}

// ---------------------------------------------------------------------------
// Internal: pattern matching
// ---------------------------------------------------------------------------

/** Extract the first [A-Z][0-9]{2} token from OCR text */
function matchCode(rawText: string, confidence: number): OcrResult {
  // Strip whitespace and common OCR noise characters
  const cleaned = rawText.replace(/[^A-Z0-9\s]/g, '').toUpperCase();

  // Look for the canonical 3-char demo code pattern
  const match = cleaned.match(/\b([A-Z][0-9]{2})\b/);
  if (match) {
    return {
      code: match[1],
      rawText,
      confidence,
      ocrRan: true,
    };
  }

  // Secondary: looser match without word boundaries (handles OCR spacing errors)
  const looseMatch = cleaned.replace(/\s+/g, '').match(/([A-Z][0-9]{2})/);
  if (looseMatch) {
    return {
      code: looseMatch[1],
      rawText,
      confidence: confidence * 0.75, // Reduced confidence for loose match
      ocrRan: true,
    };
  }

  return { code: null, rawText, confidence, ocrRan: true };
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function timeout<T>(ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(fallback), ms));
}
