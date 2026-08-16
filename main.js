import { CATEGORIES, FEATURED, REPOS } from './repos.js';
import { initHolo } from './holo.js';
import { initGithubActivity } from './github.js';

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const escapeHtml = (value) =>
    String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

function setupTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('theme', next);
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

function featuredCard(project) {
    const tags = project.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('');
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
            </div>
        </a>`;
}

function repoCard(repo) {
    const fork = repo.fork ? '<span>fork</span>' : '';
    return `
        <a class="repo-card reveal" href="${repo.url}" target="_blank" rel="noreferrer" data-category="${repo.category}">
            <div class="repo-top">
                <h3>${escapeHtml(repo.name)}</h3>
                <svg class="icon card-arrow" aria-hidden="true"><use href="#i-arrow"></use></svg>
            </div>
            <p>${escapeHtml(repo.description)}</p>
            ${liveBadge(repo)}
            <div class="repo-meta"><span>${escapeHtml(repo.language)}</span>${fork}</div>
        </a>`;
}

function setupProjects() {
    const featuredGrid = document.getElementById('featured-grid');
    const repoGrid = document.getElementById('repo-grid');
    const filters = document.getElementById('filters');
    const empty = document.getElementById('repo-empty');
    if (!featuredGrid || !repoGrid || !filters || !empty) return;

    featuredGrid.innerHTML = FEATURED.map(featuredCard).join('');

    const countOf = (id) => (id === 'todos' ? REPOS.length : REPOS.filter((repo) => repo.category === id).length);

    filters.innerHTML = CATEGORIES.filter((category) => countOf(category.id) > 0)
        .map(
            (category) => `
            <button class="chip" type="button" data-filter="${category.id}" aria-pressed="${category.id === 'todos'}">
                ${escapeHtml(category.label)} <span aria-hidden="true">(${countOf(category.id)})</span>
            </button>`
        )
        .join('');

    const render = (filter) => {
        const list = filter === 'todos' ? REPOS : REPOS.filter((repo) => repo.category === filter);
        repoGrid.innerHTML = list.map(repoCard).join('');
        empty.hidden = list.length > 0;
        observeReveals(repoGrid);
    };

    filters.addEventListener('click', (event) => {
        const button = event.target.closest('[data-filter]');
        if (!button) return;
        filters.querySelectorAll('[data-filter]').forEach((chip) => {
            chip.setAttribute('aria-pressed', String(chip === button));
        });
        render(button.dataset.filter);
    });

    render('todos');
    observeReveals(featuredGrid);
}

const holoFigure = document.querySelector('.holo');
if (holoFigure) initHolo(holoFigure);

initGithubActivity(document.getElementById('gh-activity'));

setupTheme();
setupProjects();
setupTypewriter();
observeReveals();
