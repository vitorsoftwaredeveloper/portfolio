const numberFormat = new Intl.NumberFormat('pt-BR');

const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

const timeFormat = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

const relativeFormat = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

const UNITS = [
    ['year', 365 * 24 * 60 * 60 * 1000],
    ['month', 30 * 24 * 60 * 60 * 1000],
    ['week', 7 * 24 * 60 * 60 * 1000],
    ['day', 24 * 60 * 60 * 1000],
    ['hour', 60 * 60 * 1000],
    ['minute', 60 * 1000]
];

export const escapeHtml = (value) =>
    String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

export const formatNumber = (value) => numberFormat.format(value);

export const formatDateTime = (value) => dateTimeFormat.format(new Date(value));

export const formatTime = (value) => timeFormat.format(new Date(value));

export function formatRelative(value) {
    const diff = new Date(value).getTime() - Date.now();
    const abs = Math.abs(diff);
    for (const [unit, ms] of UNITS) {
        if (abs >= ms) return relativeFormat.format(Math.round(diff / ms), unit);
    }
    return 'agora mesmo';
}

export const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Kotlin: '#a97bff',
    Go: '#00add8',
    HTML: '#e34c26',
    CSS: '#663399',
    SCSS: '#c6538c',
    Java: '#b07219',
    Python: '#3572a5',
    Shell: '#89e051',
    Dart: '#00b4ab',
    Ruby: '#701516',
    PHP: '#4f5d95',
    Swift: '#f05138',
    'C#': '#178600',
    'C++': '#f34b7d',
    C: '#555555',
    Rust: '#dea584',
    Vue: '#41b883',
    Dockerfile: '#384d54'
};

export function languageColor(language) {
    if (LANGUAGE_COLORS[language]) return LANGUAGE_COLORS[language];
    let hash = 0;
    for (let index = 0; index < language.length; index += 1) {
        hash = (hash * 31 + language.charCodeAt(index)) % 360;
    }
    return `hsl(${hash} 62% 58%)`;
}
