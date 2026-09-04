export function normalizeRepo(repo) {
    return {
        name: repo.name,
        fullName: repo.full_name || repo.name,
        description: repo.description || '',
        language: repo.language || '',
        url: repo.html_url,
        homepage: repo.homepage || '',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        watchers: repo.subscribers_count || 0,
        openIssues: repo.open_issues_count || 0,
        size: repo.size || 0,
        license: repo.license ? repo.license.spdx_id || repo.license.name : '',
        defaultBranch: repo.default_branch || '',
        fork: Boolean(repo.fork),
        archived: Boolean(repo.archived),
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        pushedAt: repo.pushed_at,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at
    };
}

export function normalizeProfile(profile) {
    return {
        login: profile.login,
        name: profile.name || profile.login,
        bio: profile.bio || '',
        company: profile.company || '',
        location: profile.location || '',
        blog: profile.blog || '',
        avatar: profile.avatar_url || '',
        publicRepos: profile.public_repos || 0,
        publicGists: profile.public_gists || 0,
        followers: profile.followers || 0,
        following: profile.following || 0,
        createdAt: profile.created_at,
        url: profile.html_url
    };
}

const EVENT_LABELS = {
    PushEvent: 'push',
    PullRequestEvent: 'pull request',
    CreateEvent: 'criou',
    DeleteEvent: 'removeu',
    IssuesEvent: 'issue',
    IssueCommentEvent: 'comentou',
    ReleaseEvent: 'release',
    ForkEvent: 'fork',
    WatchEvent: 'favoritou',
    PublicEvent: 'tornou publico'
};

export function normalizeActivity(events) {
    if (!Array.isArray(events)) return [];
    return events.map((event) => {
        const payload = event.payload || {};
        const commits = Array.isArray(payload.commits) ? payload.commits : [];
        const pull = payload.pull_request || null;
        const issue = payload.issue || null;
        return {
            type: event.type,
            label: EVENT_LABELS[event.type] || event.type.replace(/Event$/, '').toLowerCase(),
            repo: event.repo ? event.repo.name : '',
            branch: payload.ref ? String(payload.ref).replace('refs/heads/', '') : '',
            refType: payload.ref_type || '',
            action: payload.action || '',
            number: pull ? pull.number : issue ? issue.number : null,
            title: pull ? pull.title : issue ? issue.title : '',
            head: payload.head || null,
            commits: commits.length || payload.size || 0,
            message: commits.length ? commits[commits.length - 1].message.split('\n')[0] : '',
            createdAt: event.created_at
        };
    });
}

export function normalizeEvents(events) {
    return normalizeActivity(events).filter((event) => event.type === 'PushEvent');
}

export const ENDPOINTS = {
    profile: (user) => `/users/${user}`,
    repos: (user) => `/users/${user}/repos?per_page=100&sort=pushed&type=owner`,
    events: (user) => `/users/${user}/events/public?per_page=100`
};
