// Entry point: initialize UI, DB and interactions
import { initUI, setInitialThemeAndLang } from './ui.js';
import { openDBAndRestore } from './db.js';
import { attachInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', async () => {
    // initialize UI elements (theme/lang buttons, preloader handling, translations)
    setInitialThemeAndLang();
    initUI();

    // open DB, restore portfolio + session
    await openDBAndRestore();

    // wire up interactive behaviors (portfolio modal, file pickers, cursor, hero parallax, login)
    attachInteractions();
});