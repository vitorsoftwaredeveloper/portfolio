export const USER = 'vitorsoftwaredeveloper';

const CACHE_KEY = 'gh-data-v2';
const API = 'https://api.github.com';

let pending = null;

async function getJson(path) {
    const response = await fetch(`${API}${path}`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) {
        const error = new Error(`GitHub respondeu ${response.status}`);
        error.status = response.status;
        error.rateLimited = response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0';
        throw error;
    }
    return response.json();
}

function normalizeRepo(repo) {
    return {
        name: repo.name,
        description: repo.description || '',
        language: repo.language || '',
        url: repo.html_url,
        homepage: repo.homepage || '',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        fork: Boolean(repo.fork),
        archived: Boolean(repo.archived),
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        pushedAt: repo.pushed_at,
        createdAt: repo.created_at
    };
}

function normalizeProfile(profile) {
    return {
        login: profile.login,
        name: profile.name || profile.login,
        bio: profile.bio || '',
        avatar: profile.avatar_url || '',
        publicRepos: profile.public_repos || 0,
        followers: profile.followers || 0,
        following: profile.following || 0,
        createdAt: profile.created_at,
        url: profile.html_url
    };
}

function normalizeEvents(events) {
    return events
        .filter((event) => event.type === 'PushEvent')
        .map((event) => ({
            repo: event.repo ? event.repo.name : '',
            head: event.payload ? event.payload.head : null,
            commits: event.payload && Array.isArray(event.payload.commits) ? event.payload.commits.length : 0,
            message:
                event.payload && Array.isArray(event.payload.commits) && event.payload.commits.length
                    ? event.payload.commits[event.payload.commits.length - 1].message.split('\n')[0]
                    : '',
            createdAt: event.created_at
        }));
}

function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.data) return null;
        return { ...parsed.data, fromCache: true, fetchedAt: parsed.savedAt };
    } catch (error) {
        return null;
    }
}

function writeCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
    } catch (error) {
        return;
    }
}

async function request() {
    const [profile, repos, events] = await Promise.all([
        getJson(`/users/${USER}`),
        getJson(`/users/${USER}/repos?per_page=100&sort=pushed&type=owner`),
        getJson(`/users/${USER}/events/public?per_page=100`).catch(() => [])
    ]);

    return {
        profile: normalizeProfile(profile),
        repos: repos.map(normalizeRepo),
        pushes: normalizeEvents(events),
        fetchedAt: Date.now(),
        fromCache: false
    };
}

/**
 * Busca os dados publicos do GitHub. A chamada acontece em todo carregamento
 * da página; o cache local só serve para pintar a tela enquanto a rede responde
 * e como rede de segurança quando a API falha ou atinge o rate limit.
 */
export function loadGithubData({ force = false } = {}) {
    if (pending && !force) return pending;

    pending = request()
        .then((data) => {
            writeCache({ profile: data.profile, repos: data.repos, pushes: data.pushes });
            return data;
        })
        .catch((error) => {
            const cached = readCache();
            if (cached) return { ...cached, stale: true, error };
            return null;
        });

    return pending;
}

export function getCachedGithubData() {
    return readCache();
}

export function refreshGithubData() {
    pending = null;
    return loadGithubData({ force: true });
}
