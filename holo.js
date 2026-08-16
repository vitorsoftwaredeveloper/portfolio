const RAMP = ['.,\'', ':;-', '=+ｱ', '*ｷｻ', '#ﾂﾈ', '%ﾎﾑ', '&8ﾜ', '@WM'];
const LEVELS = RAMP.length;
const CELL_CSS = 5;
const FRAME_MS = 50;

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);

const smoothstep = (edge0, edge1, value) => {
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
};

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
    const video = figure.querySelector('.holo-source');
    if (!canvas || !video) return;

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
    let subjectMask = null;
    let luminance = null;
    let blurred = null;
    let glyphs = null;
    let drops = null;
    let sweep = 0;
    let running = false;
    let rafId = 0;
    let lastFrame = 0;

    const resize = () => {
        const rect = figure.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;

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

        const total = cols * rows;
        luminance = new Float32Array(total);
        blurred = new Float32Array(total);
        glyphs = new Uint8Array(total);
        subjectMask = new Float32Array(total);
        drops = new Float32Array(cols);

        for (let x = 0; x < cols; x += 1) drops[x] = Math.random() * rows * -1;
        for (let i = 0; i < total; i += 1) glyphs[i] = (Math.random() * 255) | 0;

        const blobs = [
            [0.66, 0.17, 0.2, 0.19],
            [0.63, 0.47, 0.28, 0.32],
            [0.5, 0.68, 0.36, 0.2],
            [0.31, 0.83, 0.3, 0.17]
        ];

        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < cols; x += 1) {
                const nx = x / cols;
                const ny = y / rows;
                let coverage = 0;
                for (let b = 0; b < blobs.length; b += 1) {
                    const [cx, cy, rx, ry] = blobs[b];
                    const dx = (nx - cx) / rx;
                    const dy = (ny - cy) / ry;
                    coverage += 1 - smoothstep(0.68, 1.32, Math.sqrt(dx * dx + dy * dy));
                }
                subjectMask[y * cols + x] = clamp01(coverage);
            }
        }

        return true;
    };

    const sample = () => {
        samplerContext.drawImage(video, 0, 0, cols, rows);
        const pixels = samplerContext.getImageData(0, 0, cols, rows).data;
        const total = cols * rows;

        for (let i = 0; i < total; i += 1) {
            const index = i * 4;
            luminance[i] = (pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722) / 255;
        }

        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < cols; x += 1) {
                const left = luminance[y * cols + Math.max(0, x - 1)];
                const right = luminance[y * cols + Math.min(cols - 1, x + 1)];
                blurred[y * cols + x] = (left + luminance[y * cols + x] * 2 + right) / 4;
            }
        }

        for (let x = 0; x < cols; x += 1) {
            for (let y = 0; y < rows; y += 1) {
                const index = y * cols + x;
                const up = blurred[Math.max(0, y - 1) * cols + x];
                const down = blurred[Math.min(rows - 1, y + 1) * cols + x];
                const soft = (up + blurred[index] * 2 + down) / 4;
                const raw = luminance[index];
                const detail = Math.abs(raw - soft);

                const fill = Math.pow(clamp01((raw - 0.12) / 0.72), 1.3);
                const flatBright = smoothstep(0.6, 0.82, raw) * (1 - smoothstep(0.015, 0.075, detail));
                const value = clamp01(fill * 0.9 + detail * 3);

                luminance[index] = clamp01(value * subjectMask[index] * (1 - 0.6 * flatBright));
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

                const trail = drops[x] - y;
                let value = base + sweepBoost * base;

                if (trail >= 0 && trail < 9) {
                    value += (1 - trail / 9) * 0.55;
                    if (trail < 1) highlights.push(x, y);
                }

                const level = Math.min(LEVELS - 1, (Math.pow(clamp01(value), 0.72) * LEVELS) | 0);
                buckets[level].push(x, y);
            }
        }

        for (let level = 0; level < LEVELS; level += 1) {
            const bucket = buckets[level];
            if (!bucket.length) continue;
            context.fillStyle = palette[level];
            const chars = RAMP[level];
            for (let i = 0; i < bucket.length; i += 2) {
                const x = bucket[i];
                const y = bucket[i + 1];
                context.fillText(chars[glyphs[y * cols + x] % chars.length], x * cell, y * cell);
            }
        }

        if (highlights.length) {
            context.fillStyle = highlightColor;
            for (let i = 0; i < highlights.length; i += 2) {
                const x = highlights[i];
                const y = highlights[i + 1];
                context.fillText('@', x * cell, y * cell);
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
        for (let i = 0; i < total * 0.01; i += 1) {
            glyphs[(Math.random() * total) | 0] = (Math.random() * 255) | 0;
        }
    };

    const loop = (time) => {
        if (!running) return;
        rafId = requestAnimationFrame(loop);
        if (time - lastFrame < FRAME_MS) return;
        lastFrame = time;
        sample();
        advance();
        paint();
    };

    const start = () => {
        if (running || !luminance) return;
        running = true;
        video.play().catch(() => {});
        rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
        running = false;
        cancelAnimationFrame(rafId);
        video.pause();
    };

    const build = () => {
        if (!resize()) return;
        figure.classList.add('is-scanning');

        if (reduced.matches) {
            stop();
            video.currentTime = 0;
            sample();
            paint();
        } else {
            start();
        }
    };

    const ready = () => {
        video.muted = true;
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

    if (video.readyState >= 2) ready();
    else video.addEventListener('loadeddata', ready, { once: true });
}
