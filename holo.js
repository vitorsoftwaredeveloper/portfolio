const GLYPHS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ<>[]{}/\\|=+*#$%&';
const LEVELS = 8;
const CELL_CSS = 5;
const FRAME_MS = 45;

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);

function buildPalette(light) {
    const ramp = [];
    for (let i = 0; i < LEVELS; i += 1) {
        const t = (i + 1) / LEVELS;
        if (light) {
            ramp.push(
                `rgba(${Math.round(28 - t * 14)}, ${Math.round(128 - t * 44)}, ${Math.round(102 - t * 34)}, ${(
                    0.2 + t * 0.8
                ).toFixed(3)})`
            );
        } else {
            ramp.push(
                `rgba(${Math.round(52 + t * 90)}, ${Math.round(190 + t * 62)}, ${Math.round(150 + t * 80)}, ${(
                    0.14 + t * 0.86
                ).toFixed(3)})`
            );
        }
    }
    return ramp;
}

const isLightTheme = () => document.documentElement.dataset.theme === 'light';

export function initHolo(figure) {
    const canvas = figure.querySelector('.holo-canvas');
    const image = figure.querySelector('img');
    if (!canvas || !image) return;

    const context = canvas.getContext('2d');
    const sampler = document.createElement('canvas');
    const samplerContext = sampler.getContext('2d', { willReadFrequently: true });
    const palettes = { dark: buildPalette(false), light: buildPalette(true) };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let palette = palettes[isLightTheme() ? 'light' : 'dark'];
    let highlightColor = isLightTheme() ? 'rgba(6, 62, 46, 0.95)' : 'rgba(226, 255, 242, 0.92)';

    let cols = 0;
    let rows = 0;
    let cell = CELL_CSS;
    let luminance = null;
    let glyphs = null;
    let drops = null;
    let sweep = 0;
    let running = false;
    let rafId = 0;
    let lastFrame = 0;

    const sampleImage = () => {
        const rect = figure.getBoundingClientRect();
        if (!rect.width || !rect.height || !image.naturalWidth) return false;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cols = Math.max(24, Math.round(rect.width / CELL_CSS));
        rows = Math.max(24, Math.round(rect.height / CELL_CSS));
        cell = (rect.width / cols) * dpr;

        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        sampler.width = cols;
        sampler.height = rows;
        samplerContext.clearRect(0, 0, cols, rows);

        const scale = Math.max(cols / image.naturalWidth, rows / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        samplerContext.drawImage(image, (cols - drawWidth) / 2, (rows - drawHeight) * 0.26, drawWidth, drawHeight);

        const pixels = samplerContext.getImageData(0, 0, cols, rows).data;
        luminance = new Float32Array(cols * rows);
        glyphs = new Uint8Array(cols * rows);
        drops = new Float32Array(cols);

        for (let x = 0; x < cols; x += 1) {
            drops[x] = Math.random() * rows * -1;
        }

        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < cols; x += 1) {
                const index = (y * cols + x) * 4;
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const lum = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
                const coolness = clamp01((blue - red) / 62);
                const raw = clamp01(lum * (1 - coolness * 0.92));

                const nx = (x / cols - 0.5) * 2;
                const ny = (y / rows - 0.42) * 1.7;
                const distance = Math.sqrt(nx * nx * 0.85 + ny * ny);
                const vignette = clamp01(1 - (distance - 0.58) / 0.46);

                const crushed = clamp01((raw * (0.2 + 0.8 * vignette) - 0.015) / 0.44);
                luminance[y * cols + x] = Math.pow(crushed, 1.5);
                glyphs[y * cols + x] = (Math.random() * GLYPHS.length) | 0;
            }
        }

        sharpen();
        return true;
    };

    const sharpen = () => {
        const total = cols * rows;
        const blurred = new Float32Array(total);

        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < cols; x += 1) {
                const left = luminance[y * cols + Math.max(0, x - 1)];
                const right = luminance[y * cols + Math.min(cols - 1, x + 1)];
                blurred[y * cols + x] = (left + luminance[y * cols + x] * 2 + right) / 4;
            }
        }

        for (let x = 0; x < cols; x += 1) {
            for (let y = 0; y < rows; y += 1) {
                const up = blurred[Math.max(0, y - 1) * cols + x];
                const down = blurred[Math.min(rows - 1, y + 1) * cols + x];
                const mid = blurred[y * cols + x];
                const soft = (up + mid * 2 + down) / 4;
                const base = luminance[y * cols + x];
                luminance[y * cols + x] = clamp01(base * 0.95 + Math.abs(base - soft) * 1.3);
            }
        }
    };

    const paint = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = `${cell * 1.18}px 'JetBrains Mono', ui-monospace, monospace`;
        context.textBaseline = 'top';

        const buckets = Array.from({ length: LEVELS }, () => []);
        const highlights = [];

        for (let y = 0; y < rows; y += 1) {
            const sweepBoost = Math.max(0, 1 - Math.abs(y - sweep) / 5) * 0.5;
            for (let x = 0; x < cols; x += 1) {
                const base = luminance[y * cols + x];
                if (base < 0.035) continue;

                const head = drops[x];
                const trail = head - y;
                let value = base + sweepBoost * base;

                if (trail >= 0 && trail < 9) {
                    value += (1 - trail / 9) * 0.55;
                    if (trail < 1) highlights.push(x, y);
                }

                const level = Math.min(LEVELS - 1, (clamp01(value) * LEVELS) | 0);
                buckets[level].push(x, y);
            }
        }

        for (let level = 0; level < LEVELS; level += 1) {
            const bucket = buckets[level];
            if (!bucket.length) continue;
            context.fillStyle = palette[level];
            for (let i = 0; i < bucket.length; i += 2) {
                const x = bucket[i];
                const y = bucket[i + 1];
                context.fillText(GLYPHS[glyphs[y * cols + x]], x * cell, y * cell);
            }
        }

        if (highlights.length) {
            context.fillStyle = highlightColor;
            for (let i = 0; i < highlights.length; i += 2) {
                const x = highlights[i];
                const y = highlights[i + 1];
                context.fillText(GLYPHS[glyphs[y * cols + x]], x * cell, y * cell);
            }
        }
    };

    const advance = () => {
        for (let x = 0; x < cols; x += 1) {
            drops[x] += 0.35 + (x % 7) * 0.045;
            if (drops[x] > rows + 12) drops[x] = -Math.random() * rows * 0.8;
        }

        sweep += 0.5;
        if (sweep > rows + 8) sweep = -8;

        const total = cols * rows;
        for (let i = 0; i < total * 0.012; i += 1) {
            const index = (Math.random() * total) | 0;
            glyphs[index] = (Math.random() * GLYPHS.length) | 0;
        }
    };

    const loop = (time) => {
        if (!running) return;
        rafId = requestAnimationFrame(loop);
        if (time - lastFrame < FRAME_MS) return;
        lastFrame = time;
        advance();
        paint();
    };

    const start = () => {
        if (running || !luminance) return;
        running = true;
        rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
        running = false;
        cancelAnimationFrame(rafId);
    };

    const build = () => {
        if (!sampleImage()) return;
        figure.classList.add('is-scanning');
        if (reduced.matches) {
            stop();
            paint();
        } else {
            start();
        }
    };

    const ready = () => {
        build();

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (reduced.matches) return;
                        if (entry.isIntersecting) start();
                        else stop();
                    });
                },
                { threshold: 0 }
            ).observe(figure);
        }

        if ('ResizeObserver' in window) {
            let resizeTimer = 0;
            new ResizeObserver(() => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(build, 180);
            }).observe(figure);
        }

        reduced.addEventListener('change', build);

        new MutationObserver(() => {
            const light = isLightTheme();
            palette = palettes[light ? 'light' : 'dark'];
            highlightColor = light ? 'rgba(6, 62, 46, 0.95)' : 'rgba(226, 255, 242, 0.92)';
            if (!running) paint();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    };

    if (image.complete && image.naturalWidth) ready();
    else image.addEventListener('load', ready, { once: true });
}
