// Interaction behaviors: portfolio add, modal, tilt, cursor, hero parallax, login handlers.
// This file wires events to DOM elements created/managed by ui.js and db.js.

import { addPortfolioItemToDB } from './db.js';
import { applyLanguage, translations } from './ui.js';

export function attachInteractions() {
    setupPortfolioModal();
    setupFilePickers();
    setupPortfolioAdd();
    setupTiltAndCursor();
    setupHeroParallax();
    setupLoginHandlers();
    setupEditDeleteControls();
    setupAddServiceAchievementMotion();
}

function setupPortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = document.querySelector('.close-button');

    document.body.addEventListener('click', (e) => {
        const item = e.target.closest('.portfolio-item');
        if (item && !item.classList.contains('no-modal')) {
            const img = item.querySelector('img');
            modalImg.src = img ? img.src : '';
            modalImg.alt = img ? img.alt : '';
            modalTitle.textContent = item.querySelector('h3') ? item.querySelector('h3').textContent : '';
            modalDescription.textContent = item.dataset.description || '';
            modal.style.display = 'block';
        }
    });

    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (ev) => { if (ev.target === modal) modal.style.display = 'none'; });
}

function setupFilePickers() {
    const fileInput = document.getElementById('file-input');
    const fileBtn = document.getElementById('file-btn');
    const fileList = document.getElementById('file-list');
    const clearFilesBtn = document.getElementById('clear-files');

    if (!fileBtn || !fileInput) return;
    fileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files || []);
        if (files.length === 0) {
            fileList.textContent = '';
            clearFilesBtn.style.display = 'none';
            return;
        }
        fileList.innerHTML = `<strong>الملفات المحددة (${files.length}):</strong><ul>${files.map(f => `<li title="${f.name}">${f.name}</li>`).join('')}</ul>`;
        clearFilesBtn.style.display = 'inline-block';
    });
    if (clearFilesBtn) clearFilesBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileList.textContent = '';
        clearFilesBtn.style.display = 'none';
    });
}

function setupPortfolioAdd() {
    const addWorkBtn = document.getElementById('add-work-btn');
    const portfolioFileInput = document.getElementById('portfolio-file-input');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    if (!addWorkBtn || !portfolioFileInput || !portfolioGrid) return;
    addWorkBtn.addEventListener('click', () => portfolioFileInput.click());

    portfolioFileInput.addEventListener('change', async () => {
        const files = Array.from(portfolioFileInput.files || []);
        if (files.length === 0) return;
        const currentLang = document.documentElement.lang || 'ar';
        for (const file of files) {
            const url = URL.createObjectURL(file);
            const title = prompt(translations[currentLang].p1Title + ' - ' + file.name.split('.').slice(0, -1).join('.') , file.name) || file.name;
            const desc = prompt(translations[currentLang].p1Desc, '') || '';

            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.dataset.description = desc;

            const inner = document.createElement('div');
            inner.className = 'inner-tilt';
            const img = document.createElement('img');
            img.src = url;
            img.alt = title;
            inner.appendChild(img);
            item.appendChild(inner);

            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            const h3 = document.createElement('h3');
            h3.textContent = title;
            overlay.appendChild(h3);
            item.appendChild(overlay);

            portfolioGrid.prepend(item);

            try { await addPortfolioItemToDB({ src: url, title, description: desc, createdAt: Date.now() }); }
            catch (e) { console.warn('Failed to save portfolio item:', e); }
        }
        portfolioFileInput.value = '';
    });
}

function setupTiltAndCursor() {
    // thin wrapper for tilt interactions and cursor animations (kept simple)
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.portfolio-item, .about-content, .services li').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(item);

        if (!item.querySelector('.inner-tilt')) {
            const img = item.querySelector('img');
            if (img) {
                const wrapper = document.createElement('div');
                wrapper.className = 'inner-tilt';
                img.replaceWith(wrapper);
                wrapper.appendChild(img);
            }
        }

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * 12;
            const rotateX = (0.5 - y) * 8;
            const inner = item.querySelector('.inner-tilt');
            if (inner) inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            const img = item.querySelector('img');
            if (img) img.style.transform = `scale(1.06) translateZ(20px)`;
        });
        item.addEventListener('mouseleave', () => {
            const inner = item.querySelector('.inner-tilt');
            if (inner) inner.style.transform = '';
            const img = item.querySelector('img');
            if (img) img.style.transform = '';
        });
    });

    // custom cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && cursorOutline) {
        let cursorTimeout;
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX, posY = e.clientY;
            cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: 'forwards' });
            cursorDot.style.opacity = 1; cursorOutline.style.opacity = 1;
            clearTimeout(cursorTimeout);
            cursorTimeout = setTimeout(() => { cursorDot.style.opacity = 0; cursorOutline.style.opacity = 0; }, 3000);
        });

        const interactive = document.querySelectorAll('a, button, .portfolio-item, .services li');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => { cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)'; cursorOutline.style.borderColor = 'var(--primary-color)'; });
            el.addEventListener('mouseleave', () => { cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)'; cursorOutline.style.borderColor = ''; });
        });
    }
}

function setupHeroParallax() {
    const lights = document.querySelectorAll('.floating-light');
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        lights.forEach((el, i) => {
            const depth = (i + 1) * 8;
            el.style.transform = `translate3d(${cx * depth}px, ${cy * depth}px, 0)`;
            el.style.opacity = 0.07 + i * 0.01;
        });
    });
    hero.addEventListener('mouseleave', () => lights.forEach((el) => el.style.transform = ''));
}

function setupLoginHandlers() {
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLogin = document.querySelector('.close-login-button');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginCancel = document.getElementById('login-cancel');

    function setLoggedInState(user) {
        if (user && user.email) {
            loginBtn.textContent = user.name || user.email.split('@')[0];
            loginBtn.classList.add('logged-in');
        } else {
            loginBtn.textContent = 'تسجيل الدخول';
            loginBtn.classList.remove('logged-in');
        }
    }

    // restore simple session from localStorage
    const sessionUser = JSON.parse(localStorage.getItem('sessionUser') || 'null');
    setLoggedInState(sessionUser);

    if (!loginBtn) return;
    loginBtn.addEventListener('click', () => {
        if (loginBtn.classList.contains('logged-in')) {
            if (confirm('تسجيل الخروج؟')) {
                localStorage.removeItem('sessionUser');
                setLoggedInState(null);
                try { if (window.setLoggedInState) window.setLoggedInState(null); } catch {}
            }
            return;
        }
        loginModal.style.display = 'block';
    });

    const closeLoginModal = () => {
        loginModal.style.display = 'none';
        loginError.style.display = 'none';
        if (loginForm) loginForm.reset();
    };

    if (closeLogin) closeLogin.addEventListener('click', closeLoginModal);
    if (loginCancel) loginCancel.addEventListener('click', closeLoginModal);
    window.addEventListener('click', (e) => { if (e.target === loginModal) closeLoginModal(); });

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            if (!email || !password || password.length < 6) {
                loginError.textContent = 'الرجاء إدخال بريد صالح وكلمة مرور لا تقل عن 6 أحرف.';
                loginError.style.display = 'block';
                return;
            }
            const user = { email, name: email.split('@')[0] };
            localStorage.setItem('sessionUser', JSON.stringify(user));
            setLoggedInState(user);
            // persist session in DB if available
            try { if (window.saveSessionToDB) window.saveSessionToDB(user); } catch {}
            closeLoginModal();
        });
    }

    // expose global setter for DB restore usage
    window.setLoggedInState = (user) => {
        setLoggedInState(user);
        try { if (user) localStorage.setItem('sessionUser', JSON.stringify(user)); else localStorage.removeItem('sessionUser'); } catch {}
        // notify other modules that auth state changed
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));
    };
}

function setupEditDeleteControls() {
    // delegate controls for portfolio, achievements and services
    const isLoggedIn = () => !!localStorage.getItem('sessionUser');

    document.body.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.btn-edit');
        const delBtn = e.target.closest('.btn-delete');
        // prevent editing/deleting when not logged in
        if ((!isLoggedIn()) && (editBtn || delBtn)) { alert('يرجى تسجيل الدخول لإجراء هذا الإجراء.'); return; }
        if (editBtn) {
            const el = editBtn.closest('.portfolio-item, .achievement-item, .services li');
            if (!el) return;
            if (el.classList.contains('portfolio-item')) {
                const titleEl = el.querySelector('h3');
                const newTitle = prompt('عنوان جديد', titleEl ? titleEl.textContent : '') || '';
                const newDesc = prompt('وصف جديد', el.dataset.description || '') || '';
                if (titleEl) titleEl.textContent = newTitle;
                el.dataset.description = newDesc;
                // update DB if item has id
                const id = el.dataset.id;
                if (id) {
                    try { await updatePortfolioInDB(Number(id), { title: newTitle, description: newDesc }); }
                    catch (err) { console.warn('Failed update DB', err); }
                }
            } else if (el.classList.contains('achievement-item') || el.tagName === 'LI') {
                // simple inline edit for static sections
                const textNodes = el.querySelectorAll('h3, p, span');
                textNodes.forEach(node => {
                    const val = prompt('تعديل النص', node.textContent) || node.textContent;
                    node.textContent = val;
                });
            }
            return;
        }
        if (delBtn) {
            const el = delBtn.closest('.portfolio-item, .achievement-item, .services li');
            if (!el) return;
            if (!confirm('هل أنت متأكد من الحذف؟')) return;
            // if portfolio, remove from DB if id present
            if (el.classList.contains('portfolio-item')) {
                const id = el.dataset.id;
                if (id) {
                    try { await deletePortfolioFromDB(Number(id)); } catch (err) { console.warn('DB delete failed', err); }
                }
            }
            el.remove();
            return;
        }
    });

    // ensure controls exist for current DOM and future items
    const ensureControls = (root) => {
        if (!root) return;
        // only add controls when logged in
        if (!isLoggedIn()) {
            const existing = root.querySelector('.item-controls');
            if (existing) existing.remove();
            return;
        }
        if (!root.querySelector('.item-controls')) {
            const ctr = document.createElement('div');
            ctr.className = 'item-controls';
            ctr.innerHTML = `<button class="btn-edit" title="تعديل">✎</button><button class="btn-delete" title="حذف">🗑</button>`;
            root.appendChild(ctr);
        }
    };

    document.querySelectorAll('.portfolio-item, .achievement-item, .services li').forEach(ensureControls);

    // watch for new portfolio items (added dynamically)
    const grid = document.querySelector('.portfolio-grid');
    if (grid) {
        const mo = new MutationObserver((mutations) => {
            mutations.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType===1) ensureControls(n); }));
        });
        mo.observe(grid, { childList: true });
    }

    // respond to login/logout changes to add/remove controls across the page
    window.addEventListener('auth-changed', () => {
        document.querySelectorAll('.portfolio-item, .achievement-item, .services li').forEach(ensureControls);
        toggleActionButtons(); // update add buttons visibility on auth change
    });

    // ensure initial visibility of add-buttons based on session
    toggleActionButtons();
}

function setupAddServiceAchievementMotion() {
    // Add Service
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => {
            const title = prompt('عنوان الخدمة') || '';
            if (!title) return;
            const container = document.querySelector('.services ul');
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-cogs"></i> <span>${title}</span>`;
            container.prepend(li);
            // ensure edit/delete controls added
            const ev = new Event('mutation');
            document.body.dispatchEvent(ev);
        });
    }

    // Add Achievement
    const addAchBtn = document.getElementById('add-achievement-btn');
    if (addAchBtn) {
        addAchBtn.addEventListener('click', () => {
            const title = prompt('عنوان الإنجاز') || '';
            if (!title) return;
            const desc = prompt('وصف الإنجاز', '') || '';
            const grid = document.querySelector('.achievements-grid');
            const item = document.createElement('div');
            item.className = 'achievement-item';
            item.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
            grid.prepend(item);
            // add controls for new item
            const ensure = (root) => {
                if (!root.querySelector('.item-controls')) {
                    const ctr = document.createElement('div');
                    ctr.className = 'item-controls';
                    ctr.innerHTML = `<button class="btn-edit" title="تعديل">✎</button><button class="btn-delete" title="حذف">🗑</button>`;
                    root.appendChild(ctr);
                }
            };
            ensure(item);
        });
    }

    // Add Motion Graphics (leverages portfolio upload input)
    const addMotionBtn = document.getElementById('add-motion-btn');
    const motionInput = document.getElementById('portfolio-motion-input');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (addMotionBtn && motionInput && portfolioGrid) {
        addMotionBtn.addEventListener('click', () => motionInput.click());
        motionInput.addEventListener('change', async () => {
            const files = Array.from(motionInput.files || []);
            if (!files.length) return;
            for (const file of files) {
                const url = URL.createObjectURL(file);
                const title = prompt('عنوان العمل (موشن)', file.name) || file.name;
                const desc = prompt('وصف العمل (موشن)', '') || '';
                const item = document.createElement('div');
                item.className = 'portfolio-item motion-item';
                item.dataset.description = desc;
                const inner = document.createElement('div');
                inner.className = 'inner-tilt';
                if (file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = url;
                    video.controls = true;
                    video.preload = 'metadata';
                    video.style.width = '100%';
                    inner.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = title;
                    inner.appendChild(img);
                }
                item.appendChild(inner);
                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                const h3 = document.createElement('h3');
                h3.textContent = title + ' • موشن';
                overlay.appendChild(h3);
                item.appendChild(overlay);
                portfolioGrid.prepend(item);
                try { await addPortfolioItemToDB({ src: url, title, description: desc, type: 'motion', createdAt: Date.now() }); }
                catch (e) { console.warn('Failed to save motion item:', e); }
            }
            motionInput.value = '';
        });
    }
}

// add helper to hide/show global "add" buttons when not logged in
function toggleActionButtons() {
    const isLoggedIn = () => !!localStorage.getItem('sessionUser');
    const addSelectors = ['#add-work-btn','#add-service-btn','#add-achievement-btn','#add-motion-btn','#portfolio-file-input','#portfolio-motion-input','#file-btn'];
    addSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.style.display = isLoggedIn() ? '' : 'none';
    });
}

/* helper wrappers that call DB functions if available */
async function deletePortfolioFromDB(id) {
    try { if (window.deletePortfolio) await window.deletePortfolio(id); } catch (e) { throw e; }
}
async function updatePortfolioInDB(id, data) {
    try { if (window.updatePortfolio) await window.updatePortfolio(id, data); } catch (e) { throw e; }
}