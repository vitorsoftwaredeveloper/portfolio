import { ENDPOINTS, normalizeActivity, normalizeProfile, normalizeRepo } from './gh-normalize.js';

export const USER = 'vitorsoftwaredeveloper';

const CACHE_KEY = 'gh-data-v4';
const API = 'https://api.github.com';

// Proxy opcional (ver README). Vazio: o navegador fala direto com a API publica.
const meta = document.querySelector('meta[name="gh-proxy"]');
const PROXY = meta ? meta.content.trim() : '';

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

async function requestFromGithub() {
    const [profile, rawRepos, events] = await Promise.all([
        getJson(ENDPOINTS.profile(USER)),
        getJson(ENDPOINTS.repos(USER)),
        getJson(ENDPOINTS.events(USER)).catch(() => [])
    ]);

    const repos = rawRepos.map(normalizeRepo);
    const activity = normalizeActivity(events);

    return {
        profile: normalizeProfile(profile),
        repos,
        activity,
        pushes: activity.filter((event) => event.type === 'PushEvent'),
        fetchedAt: Date.now(),
        fromCache: false,
        source: 'github'
    };
}

async function requestFromProxy() {
    const response = await fetch(PROXY, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Proxy respondeu ${response.status}`);

    const payload = await response.json();
    if (!payload || !payload.profile || !Array.isArray(payload.repos)) {
        throw new Error('Proxy devolveu um formato inesperado.');
    }

    const activity = Array.isArray(payload.activity) ? payload.activity : [];

    return {
        profile: payload.profile,
        repos: payload.repos,
        activity,
        pushes: Array.isArray(payload.pushes) ? payload.pushes : activity.filter((event) => event.type === 'PushEvent'),
        fetchedAt: payload.fetchedAt || Date.now(),
        fromCache: false,
        source: 'proxy'
    };
}

async function request() {
    if (!PROXY) return requestFromGithub();

    try {
        return await requestFromProxy();
    } catch (error) {
        // Proxy fora do ar nao pode derrubar a pagina: fala direto com o GitHub.
        return requestFromGithub();
    }
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
            writeCache({
                profile: data.profile,
                repos: data.repos,
                activity: data.activity,
                pushes: data.pushes
            });
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
