import { CATEGORIES, FEATURED, REPOS } from './repos.js';
import { FAMILY_PHOTOS, loadFamilyPhotos } from './familia.js';
import { mountLayout } from './layout.js';
import { loadGithubData, refreshGithubData, USER } from './gh-api.js';
import { escapeHtml, formatNumber, formatRelative, languageColor } from './format.js';

const CAREER_START = 2019;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const FEATURED_CATEGORY = {
    'Backend serverless': 'backend',
    'API REST': 'backend',
    QA: 'qa',
    Mobile: 'produtos',
    Web: 'produtos'
};

const LANGUAGE_CATEGORY = {
    Kotlin: 'android',
    Java: 'android',
    Go: 'estudos',
    TypeScript: 'backend',
    HTML: 'produtos',
    CSS: 'produtos'
};

function setupTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('theme', next);
    });
}

function setupNavMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const header = document.querySelector('.site-header');
    if (!toggle || !menu || !header) return;

    const desktop = matchMedia('(min-width: 561px)');

    const setOpen = (open) => {
        menu.dataset.open = String(open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    setOpen(false);

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
        setOpen(false);
        toggle.focus();
    });

    desktop.addEventListener('change', (event) => {
        if (event.matches) setOpen(false);
    });
}

let revealObserver = null;

function observeReveals(root = document) {
    const targets = root.querySelectorAll('.reveal:not(.is-visible)');
    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    if (!revealObserver) {
        revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (!entry.isIntersecting) return;
                    entry.target.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px' }
        );
    }
    targets.forEach((el) => revealObserver.observe(el));
}

function setupTypewriter() {
    const target = document.querySelector('[data-typewriter]');
    if (!target) return;
    const roles = JSON.parse(target.dataset.typewriter);
    const caret = '<span class="caret" aria-hidden="true">_</span>';
    if (prefersReducedMotion.matches) {
        target.innerHTML = `${escapeHtml(roles[0])}${caret}`;
        return;
    }

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    const tick = () => {
        const role = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        target.innerHTML = `${escapeHtml(role.slice(0, charIndex))}${caret}`;

        let delay = deleting ? 45 : 85;
        if (!deleting && charIndex === role.length) {
            deleting = true;
            delay = 2400;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 420;
        }
        setTimeout(tick, delay);
    };

    setTimeout(tick, 2400);
}

function liveBadge(project) {
    if (!project.homepage) return '';
    const label = project.homepage.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `<span class="repo-live"><svg class="icon" aria-hidden="true"><use href="#i-external"></use></svg>${escapeHtml(label)}</span>`;
}

function statChip(icon, value, label) {
    return `<span class="repo-stat" role="img" aria-label="${escapeHtml(`${value} ${label}`)}"><svg class="icon" aria-hidden="true"><use href="#i-${icon}"></use></svg>${escapeHtml(value)}</span>`;
}

function repoStats(repo) {
    const chips = [];
    if (repo.stars) chips.push(statChip('star', formatNumber(repo.stars), 'estrelas'));
    if (repo.forks) chips.push(statChip('fork', formatNumber(repo.forks), 'forks'));
    return chips.join('');
}

function featuredCard(project) {
    const tags = project.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('');
    const pushed = project.pushedAt
        ? `<span class="repo-updated">atualizado ${escapeHtml(formatRelative(project.pushedAt))}</span>`
        : '';
    const stats = repoStats(project);
    const footer = stats || pushed ? `<div class="repo-meta">${stats}${pushed}</div>` : '';
    return `
        <a class="card bento-card reveal" href="${project.url}" target="_blank" rel="noreferrer">
            <div class="bento-top">
                <span class="kind">${escapeHtml(project.kind)}</span>
                <svg class="icon card-arrow" aria-hidden="true"><use href="#i-arrow"></use></svg>
            </div>
            <div>
                <h3>${escapeHtml(project.name)}</h3>
                <p>${escapeHtml(project.description)}</p>
                ${liveBadge(project)}
                <ul class="tech-list">${tags}</ul>
                ${footer}
            </div>
        </a>`;
}

const KB_PER_MB = 1024;

function repoSize(repo) {
    if (!repo.size) return '';
    return repo.size >= KB_PER_MB ? `${(repo.size / KB_PER_MB).toFixed(1)} MB` : `${formatNumber(repo.size)} KB`;
}

function repoTopics(repo) {
    if (!repo.topics || !repo.topics.length) return '';
    const chips = repo.topics.slice(0, 5).map((topic) => `<li>${escapeHtml(topic)}</li>`).join('');
    return `<ul class="repo-topics">${chips}</ul>`;
}

function repoCard(repo) {
    const language = repo.language
        ? `<span class="repo-lang"><i style="--dot:${languageColor(repo.language)}" aria-hidden="true"></i>${escapeHtml(repo.language)}</span>`
        : '';
    const fork = repo.fork ? '<span>fork</span>' : '';
    const archived = repo.archived ? '<span>arquivado</span>' : '';
    const pushed = repo.pushedAt
        ? `<span class="repo-updated">${escapeHtml(formatRelative(repo.pushedAt))}</span>`
        : '';
    const license = repo.license ? `<span>${escapeHtml(repo.license)}</span>` : '';
    const size = repoSize(repo) ? `<span>${escapeHtml(repoSize(repo))}</span>` : '';
    const issues = repo.openIssues ? `<span>${formatNumber(repo.openIssues)} issue(s)</span>` : '';
    return `
        <a class="repo-card reveal" href="${repo.url}" target="_blank" rel="noreferrer" data-category="${escapeHtml(repo.category)}">
            <div class="repo-top">
                <h3>${escapeHtml(repo.name)}</h3>
                <svg class="icon card-arrow" aria-hidden="true"><use href="#i-arrow"></use></svg>
            </div>
            <p>${escapeHtml(repo.description)}</p>
            ${liveBadge(repo)}
            ${repoTopics(repo)}
            <div class="repo-meta">${language}${repoStats(repo)}${license}${size}${issues}${fork}${archived}${pushed}</div>
        </a>`;
}

function categoryFor(repo) {
    if (repo.topics.some((topic) => /test|cypress|qa/.test(topic))) return 'qa';
    if (repo.homepage) return 'produtos';
    if (LANGUAGE_CATEGORY[repo.language]) return LANGUAGE_CATEGORY[repo.language];
    return 'estudos';
}

function mergeRepos(live) {
    if (!live || !live.length) return REPOS.map((repo) => ({ ...repo, topics: [] }));

    // Os destaques também trazem descrição escrita à mão; a lista curada tem prioridade.
    const curated = new Map();
    FEATURED.forEach((project) => {
        curated.set(project.name.toLowerCase(), {
            description: project.description,
            homepage: project.homepage,
            category: FEATURED_CATEGORY[project.kind] || 'produtos'
        });
    });
    REPOS.forEach((repo) => curated.set(repo.name.toLowerCase(), repo));

    return live
        .filter((repo) => !repo.name.startsWith('.'))
        .map((repo) => {
            const base = curated.get(repo.name.toLowerCase()) || {};
            return {
                name: repo.name,
                url: repo.url,
                homepage: repo.homepage || base.homepage || '',
                description: base.description || repo.description || 'Repositório público, sem descrição no GitHub.',
                language: repo.language || base.language || '',
                category: base.category || categoryFor(repo),
                fork: repo.fork,
                archived: repo.archived,
                stars: repo.stars,
                forks: repo.forks,
                topics: repo.topics,
                license: repo.license,
                size: repo.size,
                openIssues: repo.openIssues,
                createdAt: repo.createdAt,
                pushedAt: repo.pushedAt
            };
        })
        .sort((a, b) => new Date(b.pushedAt || 0) - new Date(a.pushedAt || 0));
}

function mergeFeatured(live) {
    if (!live || !live.length) return FEATURED;
    const byName = new Map(live.map((repo) => [repo.name.toLowerCase(), repo]));
    return FEATURED.map((project) => {
        const repo = byName.get(project.name.toLowerCase());
        if (!repo) return project;
        return {
            ...project,
            homepage: repo.homepage || project.homepage,
            stars: repo.stars,
            forks: repo.forks,
            pushedAt: repo.pushedAt
        };
    });
}

function languageBreakdown(repos) {
    const counters = new Map();
    repos.forEach((repo) => {
        if (!repo.language) return;
        counters.set(repo.language, (counters.get(repo.language) || 0) + 1);
    });
    const total = [...counters.values()].reduce((sum, value) => sum + value, 0);
    return {
        total,
        items: [...counters.entries()]
            .map(([language, count]) => ({ language, count, share: total ? (count / total) * 100 : 0 }))
            .sort((a, b) => b.count - a.count)
    };
}

function renderLanguageBar(languages) {
    const root = document.getElementById('lang-bar');
    if (!root || !languages.items.length) return;

    const bar = languages.items
        .map(
            (item) =>
                `<span class="lang-slice" style="--slice:${item.share.toFixed(2)}%;--dot:${languageColor(item.language)}" title="${escapeHtml(item.language)}: ${item.count}"></span>`
        )
        .join('');

    const legend = languages.items
        .slice(0, 6)
        .map(
            (item) =>
                `<li><i style="--dot:${languageColor(item.language)}" aria-hidden="true"></i>${escapeHtml(item.language)} <span>${item.count}</span></li>`
        )
        .join('');

    root.innerHTML = `<div class="lang-track" role="img" aria-label="Distribuição de linguagens nos repositórios públicos">${bar}</div><ul class="lang-legend">${legend}</ul>`;
    root.hidden = false;
}

function renderStats(data, repos) {
    const set = (key, value) => {
        const node = document.querySelector(`[data-stat="${key}"]`);
        if (node) node.textContent = value;
    };

    set('years', formatNumber(new Date().getFullYear() - CAREER_START));

    if (!data) return;

    const languages = languageBreakdown(repos);
    set('repos', formatNumber(data.profile.publicRepos || repos.length));
    set('languages', formatNumber(languages.items.length));

    const followersBlock = document.querySelector('[data-stat-block="followers"]');
    if (followersBlock && data.profile.followers > 0) {
        set('followers', formatNumber(data.profile.followers));
        followersBlock.hidden = false;
    }
}

function renderMarquee(repos) {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    const languages = languageBreakdown(repos).items.map((item) => item.language);
    if (languages.length < 4) return;
    const items = languages.map((language) => `<li>${escapeHtml(language)}</li>`).join('');
    track.innerHTML = `${items}${items}`;
}

function setupFeatured(data) {
    const featuredGrid = document.getElementById('featured-grid');
    if (!featuredGrid) return;

    const featured = mergeFeatured(data ? data.repos : null);
    const limit = Number(featuredGrid.dataset.limit) || featured.length;
    featuredGrid.innerHTML = featured.slice(0, limit).map(featuredCard).join('');
    observeReveals(featuredGrid);
}

function setupRepos(data) {
    const repoGrid = document.getElementById('repo-grid');
    const filters = document.getElementById('filters');
    const empty = document.getElementById('repo-empty');
    if (!repoGrid || !filters || !empty) return;

    const repos = mergeRepos(data ? data.repos : null);

    const known = new Set(CATEGORIES.map((category) => category.id));
    repos.forEach((repo) => {
        if (!known.has(repo.category)) repo.category = 'estudos';
    });

    const countOf = (id) => (id === 'todos' ? repos.length : repos.filter((repo) => repo.category === id).length);
    const active = filters.querySelector('[aria-pressed="true"]');
    const current = active ? active.dataset.filter : 'todos';

    filters.innerHTML = CATEGORIES.filter((category) => countOf(category.id) > 0)
        .map(
            (category) => `
            <button class="chip" type="button" data-filter="${category.id}" aria-pressed="${category.id === current}">
                ${escapeHtml(category.label)} <span aria-hidden="true">(${countOf(category.id)})</span>
            </button>`
        )
        .join('');

    const render = (filter) => {
        const list = filter === 'todos' ? repos : repos.filter((repo) => repo.category === filter);
        repoGrid.innerHTML = list.map(repoCard).join('');
        empty.hidden = list.length > 0;
        observeReveals(repoGrid);
    };

    if (!filters.dataset.bound) {
        filters.addEventListener('click', (event) => {
            const button = event.target.closest('[data-filter]');
            if (!button) return;
            filters.querySelectorAll('[data-filter]').forEach((chip) => {
                chip.setAttribute('aria-pressed', String(chip === button));
            });
            render(button.dataset.filter);
        });
        filters.dataset.bound = 'true';
    }

    render(countOf(current) > 0 ? current : 'todos');
}

function setupPageData(data) {
    setupFeatured(data);
    setupRepos(data);
    if (!data) {
        renderStats(null, []);
        return;
    }
    const repos = mergeRepos(data.repos);
    renderStats(data, repos);
    renderMarquee(repos);
    renderLanguageBar(languageBreakdown(repos));
}

async function hydrate(loader) {
    const data = await loader();
    setupPageData(data);
    const link = document.querySelector('[data-gh="profile-link"]');
    if (link) link.href = `https://github.com/${USER}`;
}

function familyCard(photo, index) {
    const span = photo.span ? ` family-item--${photo.span}` : '';
    const size = photo.width && photo.height ? ` width="${photo.width}" height="${photo.height}"` : '';
    const raw = photo.raw ? ` data-raw="${escapeHtml(photo.raw)}"` : '';
    return `
        <button class="family-item reveal${span}" type="button" data-photo-index="${index}" aria-label="Ampliar foto: ${escapeHtml(photo.caption)}">
            <img src="${photo.src}" alt="${escapeHtml(photo.alt)}"${size}${raw} loading="lazy" decoding="async" />
            <span class="family-meta">
                <span class="family-caption">${escapeHtml(photo.caption)}</span>
                <span class="family-year">${escapeHtml(photo.year || '')}</span>
            </span>
        </button>`;
}

function setupFamily() {
    const grid = document.getElementById('family-grid');
    const dialog = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    if (!grid || !dialog || !image || !caption) return;

    let photos = FAMILY_PHOTOS;

    const paintGrid = () => {
        grid.innerHTML = photos.map(familyCard).join('');
        observeReveals(grid);
    };

    const useRawOnError = (event) => {
        const img = event.target;
        if (img.tagName !== 'IMG' || !img.dataset.raw || img.dataset.usedRaw) return;
        img.dataset.usedRaw = 'true';
        img.src = img.dataset.raw;
    };

    grid.addEventListener('error', useRawOnError, true);
    image.addEventListener('error', useRawOnError);

    paintGrid();

    const fingerprint = (list) => list.map((photo) => photo.src).join('|');

    loadFamilyPhotos().then((live) => {
        if (dialog.open || fingerprint(live) === fingerprint(photos)) return;
        photos = live;
        paintGrid();
    });

    const figure = dialog.querySelector('.lightbox-figure');
    let current = 0;
    let swapToken = 0;

    const paint = (photo) => {
        delete image.dataset.usedRaw;
        if (photo.raw) image.dataset.raw = photo.raw;
        else delete image.dataset.raw;
        image.src = photo.src;
        image.alt = photo.alt;
        image.removeAttribute('width');
        image.removeAttribute('height');
        if (photo.width && photo.height) {
            image.width = photo.width;
            image.height = photo.height;
        }
        caption.textContent = [photo.caption, photo.year].filter(Boolean).join(' · ');
    };

    const show = (index, direction = 0) => {
        current = (index + photos.length) % photos.length;
        const photo = photos[current];

        if (prefersReducedMotion.matches) {
            figure.dataset.swap = 'idle';
            paint(photo);
            return;
        }

        if (!direction) {
            swapToken += 1;
            figure.dataset.swap = 'opening';
            paint(photo);
            void image.offsetWidth;
            figure.dataset.swap = 'idle';
            return;
        }

        const token = ++swapToken;
        const preload = new Image();
        preload.src = photo.src;
        figure.dataset.swap = direction > 0 ? 'leaving-left' : 'leaving-right';

        setTimeout(() => {
            if (token !== swapToken) return;
            paint(photo);
            figure.dataset.swap = direction > 0 ? 'entering-right' : 'entering-left';
            void image.offsetWidth;
            figure.dataset.swap = 'idle';
        }, 180);
    };

    const step = (direction) => show(current + direction, direction);

    grid.addEventListener('click', (event) => {
        const button = event.target.closest('[data-photo-index]');
        if (!button) return;
        dialog.showModal();
        dialog.focus();
        show(Number(button.dataset.photoIndex));
    });

    dialog.addEventListener('click', (event) => {
        const stepButton = event.target.closest('[data-lightbox-step]');
        if (stepButton) {
            step(Number(stepButton.dataset.lightboxStep));
            return;
        }
        if (event.target.closest('[data-lightbox-close]') || !event.target.closest('.lightbox-stage')) dialog.close();
    });

    dialog.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') step(1);
        if (event.key === 'ArrowLeft') step(-1);
    });
}

async function setupHolo() {
    const figure = document.querySelector('.holo');
    if (!figure) return;
    const { initHolo } = await import('./holo.js');
    initHolo(figure);
}

async function setupGithubActivity() {
    const panel = document.getElementById('gh-activity');
    if (!panel) return;
    const { initGithubActivity } = await import('./github.js');
    initGithubActivity(panel);
}

mountLayout(document.body.dataset.page);
setupTheme();
setupNavMenu();
setupPageData(null);
setupFamily();
setupTypewriter();
setupHolo();
observeReveals();

hydrate(loadGithubData);
setupGithubActivity();

// Voltar pelo bfcache (botão voltar do navegador) também conta como "entrar no site".
window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    hydrate(refreshGithubData);
    setupGithubActivity();
});
