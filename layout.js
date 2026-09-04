const PAGES = [
    { key: 'inicio', href: 'index.html', label: 'Início' },
    { key: 'projetos', href: 'projetos.html', label: 'Projetos' },
    { key: 'sobre', href: 'sobre.html', label: 'Sobre' },
    { key: 'familia', href: 'familia.html', label: 'Inspiração' },
    { key: 'contato', href: 'contato.html', label: 'Contato' }
];

const SPRITE = `
<svg class="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/></symbol>
    <symbol id="i-github" viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/></symbol>
    <symbol id="i-linkedin" viewBox="0 0 24 24"><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"/></symbol>
    <symbol id="i-instagram" viewBox="0 0 24 24"><path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M16.5 7.5v.01"/></symbol>
    <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"/><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"/><path d="M3 7l9 6l9 -6"/></symbol>
    <symbol id="i-sun" viewBox="0 0 24 24"><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></symbol>
    <symbol id="i-chevron-left" viewBox="0 0 24 24"><path d="M15 6l-6 6l6 6"/></symbol>
    <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="M9 6l6 6l-6 6"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></symbol>
    <symbol id="i-fork" viewBox="0 0 24 24"><path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M7 8v8"/><path d="M17 8v1a3 3 0 0 1 -3 3h-4a3 3 0 0 0 -3 3v1"/></symbol>
    <symbol id="i-download" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/></symbol>
    <symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="M6 9l6 6l6 -6"/></symbol>
    <symbol id="i-external" viewBox="0 0 24 24"><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/></symbol>
</svg>`;

const BRAND = `
<a class="brand" href="index.html">
    <span class="brand-prompt" aria-hidden="true">&gt;_</span><span>vitor<span class="brand-accent">.dev</span></span>
</a>`;

const MENU_ONLY = ['inicio', 'contato'];

const navLink = (page, active) => {
    const current = page.key === active ? ' aria-current="page"' : '';
    const scope = MENU_ONLY.includes(page.key) ? ' data-nav="menu-only"' : '';
    return `<li${scope}><a href="${page.href}"${current}>${page.label}</a></li>`;
};

const header = (active) => `
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header">
    <nav class="nav shell" aria-label="Navegação principal">
        ${BRAND}
        <ul class="nav-links" id="nav-menu">
            ${PAGES.map((page) => navLink(page, active)).join('')}
        </ul>
        <div class="nav-actions">
            <button id="theme-toggle" class="icon-btn" type="button" aria-label="Alternar tema claro e escuro">
                <svg class="icon icon-dark" aria-hidden="true"><use href="#i-moon"></use></svg>
                <svg class="icon icon-light" aria-hidden="true"><use href="#i-sun"></use></svg>
            </button>
            <a class="btn btn-ghost nav-cta" href="contato.html">contato()</a>
            <button id="nav-toggle" class="icon-btn nav-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-menu">
                <svg class="icon nav-icon-open" aria-hidden="true"><use href="#i-menu"></use></svg>
                <svg class="icon nav-icon-close" aria-hidden="true"><use href="#i-close"></use></svg>
            </button>
        </div>
    </nav>
</header>`;

const footer = (active) => `
<footer class="site-footer">
    <div class="shell footer-grid">
        <div class="footer-identity">
            ${BRAND}
            <p class="footer-name">Vitor Soares</p>
            <p class="footer-role">Desenvolvedor Fullstack desde 2019</p>
            <p class="footer-note">Node.js, TypeScript, React e AWS. Aberto a freelas e full-time, remoto.</p>
            <a class="btn btn-ghost footer-cv" href="media/curriculo-vitor-soares.pdf" download>Currículo em PDF<svg class="icon" aria-hidden="true"><use href="#i-download"></use></svg></a>
        </div>

        <nav class="footer-col" aria-label="Páginas do site">
            <p class="footer-title">Páginas</p>
            <ul>${PAGES.map((page) => navLink(page, active)).join('')}</ul>
        </nav>

        <div class="footer-col">
            <p class="footer-title">Repositórios</p>
            <ul>
                <li><a href="https://github.com/vitorsoftwaredeveloper/resgatar_community" target="_blank" rel="noreferrer">resgatar_community <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></li>
                <li><a href="https://github.com/vitorsoftwaredeveloper/resgatar_app" target="_blank" rel="noreferrer">resgatar_app <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></li>
                <li><a href="https://github.com/vitorsoftwaredeveloper/resgatar-browser" target="_blank" rel="noreferrer">resgatar-browser <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></li>
                <li><a href="https://github.com/vitorsoftwaredeveloper/API_community_center" target="_blank" rel="noreferrer">API_community_center <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg></a></li>
            </ul>
        </div>

        <div class="footer-col">
            <p class="footer-title">Canais</p>
            <ul class="footer-socials">
                <li><a href="https://wa.me/5583999523137" target="_blank" rel="noreferrer" aria-label="WhatsApp"><svg class="icon" aria-hidden="true"><use href="#i-whatsapp"></use></svg></a></li>
                <li><a href="mailto:vitorsoftwaredeveloper@gmail.com" aria-label="E-mail"><svg class="icon" aria-hidden="true"><use href="#i-mail"></use></svg></a></li>
                <li><a href="https://github.com/vitorsoftwaredeveloper" target="_blank" rel="noreferrer" aria-label="GitHub"><svg class="icon" aria-hidden="true"><use href="#i-github"></use></svg></a></li>
                <li><a href="https://www.linkedin.com/in/vitorsoaresf/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><svg class="icon" aria-hidden="true"><use href="#i-linkedin"></use></svg></a></li>
                <li><a href="https://www.instagram.com/vitorsoares.ferreira/" target="_blank" rel="noreferrer" aria-label="Instagram"><svg class="icon" aria-hidden="true"><use href="#i-instagram"></use></svg></a></li>
            </ul>
        </div>
    </div>

    <div class="shell">
        <section class="gh-card" id="gh-activity" data-state="loading" aria-label="Atividade pública no GitHub">
            <p class="gh-card-head">
                <svg class="icon" aria-hidden="true"><use href="#i-github"></use></svg>
                <span>github</span>
                <span class="gh-live" aria-hidden="true"></span>
            </p>
            <ul class="gh-card-metrics">
                <li><span>eventos</span><b data-gh="total">--</b></li>
                <li><span>repos hoje</span><b data-gh="today">--</b></li>
                <li><span>repos no mês</span><b data-gh="month">--</b></li>
                <li><span>dias ativos</span><b data-gh="days">--</b></li>
            </ul>
            <p class="gh-card-synced" data-gh="synced"></p>
            <p class="gh-error"><a href="https://github.com/vitorsoftwaredeveloper" target="_blank" rel="noreferrer">Ver atividade no GitHub</a></p>
        </section>
    </div>

    <div class="shell footer-bottom">
        <p>2026 Vitor Soares</p>
        <p>Construído com HTML, CSS e JavaScript</p>
    </div>
</footer>`;

export function mountLayout(active) {
    const headerSlot = document.querySelector('[data-layout="header"]');
    const footerSlot = document.querySelector('[data-layout="footer"]');

    document.body.insertAdjacentHTML('afterbegin', SPRITE);
    if (headerSlot) headerSlot.outerHTML = header(active);
    if (footerSlot) footerSlot.outerHTML = footer(active);
}
