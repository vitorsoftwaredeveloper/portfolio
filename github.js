import { loadGithubData, getCachedGithubData } from './gh-api.js';
import { formatNumber, formatTime, sameDay, sameMonth } from './format.js';

function activeDays(data) {
    const stamps = [
        ...(data.activity || []).map((event) => event.createdAt),
        ...(data.repos || []).map((repo) => repo.pushedAt)
    ].filter(Boolean);

    return [...new Set(stamps.map((stamp) => stamp.slice(0, 10)))].sort().reverse();
}

function summarize(data) {
    const now = new Date();
    const days = activeDays(data);
    const today = now.toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    const repos = data.repos || [];
    const summary = {
        pushes: (data.activity || []).length,
        reposToday: repos.filter((repo) => repo.pushedAt && sameDay(new Date(repo.pushedAt), now)).length,
        reposMonth: repos.filter((repo) => repo.pushedAt && sameMonth(new Date(repo.pushedAt), now)).length,
        daysMonth: days.filter((day) => day.startsWith(month)).length,
        activeToday: days.includes(today)
    };

    return summary;
}

function render(root, data) {
    const summary = summarize(data);
    const set = (key, value) => {
        const node = root.querySelector(`[data-gh="${key}"]`);
        if (node) node.textContent = value;
    };

    set('total', formatNumber(summary.pushes));
    set('month', formatNumber(summary.reposMonth));
    set('today', formatNumber(summary.reposToday));
    set('days', formatNumber(summary.daysMonth));

    const stamp = root.querySelector('[data-gh="synced"]');
    if (stamp) {
        stamp.textContent = data.stale
            ? `dados em cache de ${formatTime(data.fetchedAt)}`
            : `sincronizado às ${formatTime(data.fetchedAt || Date.now())}`;
    }

    root.dataset.state = 'ready';
}

export async function initGithubActivity(root) {
    if (!root) return;

    const cached = getCachedGithubData();
    if (cached) render(root, { ...cached, stale: true });

    const data = await loadGithubData();
    if (!data) {
        if (!cached) root.dataset.state = 'error';
        return;
    }

    render(root, data);
}
