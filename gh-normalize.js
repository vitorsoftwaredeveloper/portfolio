/**
 * Normalizacao das respostas da API do GitHub.
 * Roda nos dois lados: no navegador (gh-api.js) e no proxy (api/github.js),
 * para que o formato dos dados seja o mesmo venha de onde vier.
 */

export function normalizeRepo(repo) {
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

export function normalizeProfile(profile) {
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

export function normalizeEvents(events) {
    if (!Array.isArray(events)) return [];
    return events
        .filter((event) => event.type === 'PushEvent')
        .map((event) => {
            const commits = event.payload && Array.isArray(event.payload.commits) ? event.payload.commits : [];
            return {
                repo: event.repo ? event.repo.name : '',
                head: event.payload ? event.payload.head : null,
                commits: commits.length,
                message: commits.length ? commits[commits.length - 1].message.split('\n')[0] : '',
                createdAt: event.created_at
            };
        });
}

export const ENDPOINTS = {
    profile: (user) => `/users/${user}`,
    repos: (user) => `/users/${user}/repos?per_page=100&sort=pushed&type=owner`,
    events: (user) => `/users/${user}/events/public?per_page=100`
};
