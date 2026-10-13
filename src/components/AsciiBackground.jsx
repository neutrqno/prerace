import React, { useEffect, useRef } from 'react';

/**
 * 3D Simplex Noise Implementation (Deterministic & High Performance)
 */
const GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];

// Deterministic seed permutation table
const P_SEED = [
  151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
  8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
  35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,
  134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,
  55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,
  18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,
  250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,
  189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,
  172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,
  228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,
  107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
];

const PERM = new Uint8Array(512);
const PERM_MOD12 = new Uint8Array(512);
for (let i = 0; i < 512; i++) {
  const v = P_SEED[i & 255];
  PERM[i] = v;
  PERM_MOD12[i] = v % 12;
}

function simplex3D(xin, yin, zin) {
  const F3 = 1.0 / 3.0;
  const G3 = 1.0 / 6.0;

  const s = (xin + yin + zin) * F3;
  const i = Math.floor(xin + s);
  const j = Math.floor(yin + s);
  const k = Math.floor(zin + s);

  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;

  const x0 = xin - X0;
  const y0 = yin - Y0;
  const z0 = zin - Z0;

  let i1, j1, k1;
  let i2, j2, k2;

  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    } else if (x0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
    } else {
      i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
    }
  } else {
    if (y0 < z0) {
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
    } else if (x0 < z0) {
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
    } else {
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    }
  }

  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;

  const x2 = x0 - i2 + 2.0 * G3;
  const y2 = y0 - j2 + 2.0 * G3;
  const z2 = z0 - k2 + 2.0 * G3;

  const x3 = x0 - 1.0 + 3.0 * G3;
  const y3 = y0 - 1.0 + 3.0 * G3;
  const z3 = z0 - 1.0 + 3.0 * G3;

  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;

  let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 > 0) {
    t0 *= t0;
    const gi0 = PERM_MOD12[ii + PERM[jj + PERM[kk]]];
    n0 = t0 * t0 * (GRAD3[gi0][0] * x0 + GRAD3[gi0][1] * y0 + GRAD3[gi0][2] * z0);
  }

  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 > 0) {
    t1 *= t1;
    const gi1 = PERM_MOD12[ii + i1 + PERM[jj + j1 + PERM[kk + k1]]];
    n1 = t1 * t1 * (GRAD3[gi1][0] * x1 + GRAD3[gi1][1] * y1 + GRAD3[gi1][2] * z1);
  }

  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 > 0) {
    t2 *= t2;
    const gi2 = PERM_MOD12[ii + i2 + PERM[jj + j2 + PERM[kk + k2]]];
    n2 = t2 * t2 * (GRAD3[gi2][0] * x2 + GRAD3[gi2][1] * y2 + GRAD3[gi2][2] * z2);
  }

  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 > 0) {
    t3 *= t3;
    const gi3 = PERM_MOD12[ii + 1 + PERM[jj + 1 + PERM[kk + 1]]];
    n3 = t3 * t3 * (GRAD3[gi3][0] * x3 + GRAD3[gi3][1] * y3 + GRAD3[gi3][2] * z3);
  }

  // Raw noise scaled to [-1, 1] range
  return 32.0 * (n0 + n1 + n2 + n3);
}

/**
 * AsciiBackground Component
 * Reusable full-screen animated ASCII noise field
 * 
 * Props:
 * - chars: String sequence of characters from sparse to dense (default: " .:-=+*%#@")
 * - color: Foreground character color (default: "#e8e8ea")
 * - bgColor: Background canvas color (default: "#0b0b0d")
 * - speed: Time drift velocity (default: 0.15)
 * - density: Noise blob cluster threshold (0-1, default: 0.45)
 * - vignette: Whether to render subtle radial edge darkening (default: true)
 */
export default function AsciiBackground({
  chars = " .:-=+*%#@",
  color = "#e8e8ea",
  bgColor = "#0b0b0d",
  speed = 0.14,
  density = 0.42,
  vignette = true,
  cellWidth = 20,
  cellHeight = 24,
  fontSize = 17,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId = null;
    let lastFrameTime = performance.now();
    const targetFps = 30;
    const fpsInterval = 1000 / targetFps;

    // Simulation time accumulator
    let simTime = 0;

    // Device Pixel Ratio & Window Resize Handling
    let width = window.innerWidth;
    let height = window.innerHeight;
    let cols = Math.ceil(width / cellWidth);
    let rows = Math.ceil(height / cellHeight);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / cellWidth);
      rows = Math.ceil(height / cellHeight);
    };

    resize();
    window.addEventListener('resize', resize);

    // Reduced motion preference check
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        drawFrame(simTime);
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Frame drawing routine
    const drawFrame = (t) => {
      // Background fill
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Monospace typography setup
      ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = 'top';

      // Parse user chars ramp into array
      const ramp = Array.from(chars);
      const rampLen = ramp.length;

      // Thresholding: higher density means more characters emerge
      // Lower density means larger empty dark voids
      const threshold = Math.max(0.08, Math.min(0.92, 1.0 - density * 0.78));

      // Spatial frequency tuned for enlarged cells: broad, smooth, majestic drifting clouds
      const freq = 0.032;
      const timeZ = t * speed * 0.75;
      const driftX = t * speed * 0.18;
      const driftY = t * speed * 0.10;

      for (let r = 0; r < rows; r++) {
        const y = r * cellHeight;
        for (let c = 0; c < cols; c++) {
          const x = c * cellWidth;

          // 3D Simplex noise sample (two gentle octaves for rich fluid structure)
          const nx = (c + driftX) * freq;
          const ny = (r + driftY) * freq;
          const n1 = simplex3D(nx, ny, timeZ);
          const n2 = simplex3D(nx * 2.0, ny * 2.0, timeZ * 1.3) * 0.32;
          const rawVal = (n1 + n2) / 1.32; // approx [-1, 1]

          // Normalized 0 to 1
          const normVal = (rawVal + 1.0) * 0.5;

          // Apply threshold so field is mostly empty with organic clusters
          if (normVal < threshold) {
            continue; // Leave blank/empty void
          }

          // Remap above threshold to [0, 1]
          const blobVal = Math.min(1.0, (normVal - threshold) / (1.0 - threshold));

          // Map to ramp characters
          const charIdx = Math.floor(blobVal * (rampLen - 1));
          const charToDraw = ramp[charIdx];

          if (!charToDraw || charToDraw === ' ') {
            continue;
          }

          // Opacity mapping: ~0.22 for sparse/edge characters up to ~0.55 for dense (@, #)
          const alpha = 0.20 + blobVal * 0.36;

          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.fillText(charToDraw, x, y);
        }
      }

      ctx.globalAlpha = 1.0;

      // Optional subtle radial vignette darkening the edges
      if (vignette) {
        const cx = width * 0.5;
        const cy = height * 0.5;
        const maxRadius = Math.max(width, height) * 0.8;
        const grad = ctx.createRadialGradient(cx, cy, maxRadius * 0.15, cx, cy, maxRadius);
        grad.addColorStop(0, 'rgba(11, 11, 13, 0)');
        grad.addColorStop(0.65, 'rgba(11, 11, 13, 0.4)');
        grad.addColorStop(1, 'rgba(11, 11, 13, 0.9)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
    };

    // Animation loop capped at ~30 FPS
    const tick = (now) => {
      if (prefersReducedMotion) return;

      const elapsed = now - lastFrameTime;
      if (elapsed >= fpsInterval) {
        // Step forward simulation time based on real elapsed time
        const dt = Math.min(elapsed / 1000, 0.1);
        simTime += dt;
        lastFrameTime = now - (elapsed % fpsInterval);

        drawFrame(simTime);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    // Tab visibility handling: pause when hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!prefersReducedMotion && !animationFrameId) {
          lastFrameTime = performance.now();
          animationFrameId = requestAnimationFrame(tick);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial render
    drawFrame(simTime);

    if (!prefersReducedMotion && !document.hidden) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      motionQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [chars, color, bgColor, speed, density, vignette, cellWidth, cellHeight, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      id="ascii-background-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: bgColor,
      }}
    />
  );
}
