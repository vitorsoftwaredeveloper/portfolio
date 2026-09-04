import { ENDPOINTS, normalizeActivity, normalizeProfile, normalizeRepo } from '../gh-normalize.js';

const USER = process.env.GITHUB_USER || 'vitorsoftwaredeveloper';
const TOKEN = process.env.GITHUB_TOKEN || '';

// O CDN guarda a resposta, entao a API do GitHub e chamada poucas vezes por hora
// mesmo com o site recebendo muita visita.
const CACHE_OK = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600';
const CACHE_FAIL = 'public, max-age=0, s-maxage=30';

function allowedOrigin(origin) {
    const list = (process.env.ALLOWED_ORIGINS || '*')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    if (list.includes('*')) return '*';
    if (origin && list.includes(origin)) return origin;
    return list[0] || '';
}

async function getJson(path) {
    const headers = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': `${USER}-portfolio`
    };
    if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

    const response = await fetch(`https://api.github.com${path}`, { headers });
    if (!response.ok) {
        const error = new Error(`GitHub respondeu ${response.status} em ${path}`);
        error.status = response.status;
        throw error;
    }
    return response.json();
}

export default async function handler(request, response) {
    const origin = allowedOrigin(request.headers.origin);
    if (origin) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.setHeader('Vary', 'Origin');
    }

    if (request.method === 'OPTIONS') {
        response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.setHeader('Access-Control-Max-Age', '86400');
        response.status(204).end();
        return;
    }

    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET, OPTIONS');
        response.status(405).json({ error: 'Use GET.' });
        return;
    }

    try {
        const [profile, rawRepos, events] = await Promise.all([
            getJson(ENDPOINTS.profile(USER)),
            getJson(ENDPOINTS.repos(USER)),
            getJson(ENDPOINTS.events(USER)).catch(() => [])
        ]);

        const repos = rawRepos.map(normalizeRepo);
        const activity = normalizeActivity(events);
        response.setHeader('Cache-Control', CACHE_OK);
        response.status(200).json({
            profile: normalizeProfile(profile),
            repos,
            activity,
            pushes: activity.filter((event) => event.type === 'PushEvent'),
            fetchedAt: Date.now(),
            authenticated: Boolean(TOKEN)
        });
    } catch (error) {
        response.setHeader('Cache-Control', CACHE_FAIL);
        response.status(502).json({ error: error.message });
    }
}
