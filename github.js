import { USER, loadGithubData, getCachedGithubData } from './gh-api.js';
import { formatNumber, formatDateTime, formatTime, sameDay, sameMonth } from './format.js';

function summarize(data) {
    const pushes = data.pushes || [];
    const now = new Date();

    const summary = {
        total: pushes.length,
        month: pushes.filter((push) => sameMonth(new Date(push.createdAt), now)).length,
        today: pushes.filter((push) => sameDay(new Date(push.createdAt), now)).length,
        commit: null
    };

    const latest = pushes[0];
    if (latest) {
        summary.commit = {
            message: latest.message || `${latest.commits} commit(s) enviados`,
            repo: latest.repo,
            url: latest.head ? `https://github.com/${latest.repo}/commit/${latest.head}` : `https://github.com/${latest.repo}`,
            sha: latest.head ? latest.head.slice(0, 7) : '',
            date: latest.createdAt
        };
    }

    return summary;
}

function render(root, data) {
    const summary = summarize(data);
    const set = (key, value) => {
        const node = root.querySelector(`[data-gh="${key}"]`);
        if (node) node.textContent = value;
    };

    set('total', formatNumber(summary.total));
    set('month', formatNumber(summary.month));
    set('today', formatNumber(summary.today));

    const link = root.querySelector('[data-gh="commit-link"]');
    if (summary.commit) {
        const parts = [summary.commit.repo, summary.commit.sha, formatDateTime(summary.commit.date)].filter(Boolean);
        set('message', summary.commit.message);
        set('meta', parts.join(' · '));
        if (link) link.href = summary.commit.url;
    } else {
        set('message', 'Nenhum push público na janela recente.');
        set('meta', '');
        if (link) link.href = `https://github.com/${USER}`;
    }

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
