const USER = 'vitorsoftwaredeveloper';
const CACHE_KEY = 'gh-activity-v1';
const CACHE_TTL = 30 * 60 * 1000;

const numberFormat = new Intl.NumberFormat('pt-BR');
const dateFormat = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

async function getJson(url) {
    const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub respondeu ${response.status}`);
    return response.json();
}

async function loadActivity() {
    const events = await getJson(`https://api.github.com/users/${USER}/events/public?per_page=100`);
    const pushes = events.filter((event) => event.type === 'PushEvent');
    const now = new Date();

    const activity = {
        total: pushes.length,
        month: pushes.filter((event) => sameMonth(new Date(event.created_at), now)).length,
        today: pushes.filter((event) => sameDay(new Date(event.created_at), now)).length,
        commit: null
    };

    const latest = pushes[0];
    if (latest && latest.payload && latest.payload.head) {
        try {
            const data = await getJson(`https://api.github.com/repos/${latest.repo.name}/commits/${latest.payload.head}`);
            activity.commit = {
                message: data.commit.message.split('\n')[0],
                repo: latest.repo.name,
                sha: data.sha.slice(0, 7),
                url: data.html_url,
                date: data.commit.author.date
            };
        } catch (error) {
            activity.commit = null;
        }
    }

    return activity;
}

function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.savedAt > CACHE_TTL) return null;
        return parsed.activity;
    } catch (error) {
        return null;
    }
}

function writeCache(activity) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), activity }));
    } catch (error) {
        return;
    }
}

function render(root, activity) {
    const set = (key, value) => {
        const node = root.querySelector(`[data-gh="${key}"]`);
        if (node) node.textContent = value;
    };

    set('total', numberFormat.format(activity.total));
    set('month', numberFormat.format(activity.month));
    set('today', numberFormat.format(activity.today));

    const link = root.querySelector('[data-gh="commit-link"]');
    if (activity.commit) {
        set('message', activity.commit.message);
        set(
            'meta',
            `${activity.commit.repo} · ${activity.commit.sha} · ${dateFormat.format(new Date(activity.commit.date))}`
        );
        if (link) link.href = activity.commit.url;
    } else {
        set('message', 'Nenhum push público na janela recente.');
        set('meta', '');
        if (link) link.href = `https://github.com/${USER}`;
    }

    root.dataset.state = 'ready';
}

export async function initGithubActivity(root) {
    if (!root) return;

    const cached = readCache();
    if (cached) {
        render(root, cached);
        return;
    }

    try {
        const activity = await loadActivity();
        writeCache(activity);
        render(root, activity);
    } catch (error) {
        root.dataset.state = 'error';
    }
}
