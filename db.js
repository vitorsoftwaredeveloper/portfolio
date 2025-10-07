// IndexedDB wrapper and restore logic (keeps DB functions from original script)
// removed: inline DB code inside monolithic file; moved here for clarity.

const DB_NAME = 'adel-portfolio-db';
const DB_VERSION = 1;
let db;

export function openDBAndRestore() {
    return new Promise((resolve) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains('portfolio')) d.createObjectStore('portfolio', { keyPath: 'id', autoIncrement: true });
            if (!d.objectStoreNames.contains('session')) d.createObjectStore('session', { keyPath: 'key' });
        };
        req.onsuccess = async () => {
            db = req.result;
            try {
                const persisted = await getAllPortfolioFromDB();
                if (persisted && persisted.length) renderPersistedItems(persisted);
                const sessionFromDB = await readSessionFromDB();
                if (sessionFromDB) {
                    localStorage.setItem('sessionUser', JSON.stringify(sessionFromDB));
                    // expose global helper used by interactions
                    if (window.setLoggedInState) window.setLoggedInState(sessionFromDB);
                }
            } catch (e) {
                console.warn('DB restore error', e);
            }
            resolve();
        };
        req.onerror = () => resolve();
    });
}

export function addPortfolioItemToDB(item) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('portfolio', 'readwrite');
            const store = tx.objectStore('portfolio');
            store.add(item);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        } catch (e) {
            reject(e);
        }
    });
}

export function getAllPortfolioFromDB() {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('portfolio', 'readonly');
            const store = tx.objectStore('portfolio');
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        } catch (e) {
            reject(e);
        }
    });
}

export function saveSessionToDB(user) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('session', 'readwrite');
            const store = tx.objectStore('session');
            store.put({ key: 'sessionUser', value: user });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        } catch (e) {
            reject(e);
        }
    });
}

export function readSessionFromDB() {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('session', 'readonly');
            const store = tx.objectStore('session');
            const req = store.get('sessionUser');
            req.onsuccess = () => resolve(req.result ? req.result.value : null);
            req.onerror = () => reject(req.error);
        } catch (e) {
            reject(e);
        }
    });
}

// helper to render persisted portfolio items into DOM (keeps behavior minimal; interactions module will add event handlers)
function renderPersistedItems(items) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;
    items.reverse().forEach(data => {
        const item = document.createElement('div');
        item.className = 'portfolio-item';
        item.setAttribute('data-key-title', '');
        item.setAttribute('data-key-desc', '');
        item.dataset.description = data.description || '';
        item.dataset.id = data.id; // add id for DB operations

        const inner = document.createElement('div');
        inner.className = 'inner-tilt';
        const img = document.createElement('img');
        img.src = data.src;
        img.alt = data.title || 'عمل';

        inner.appendChild(img);
        item.appendChild(inner);

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        const h3 = document.createElement('h3');
        h3.textContent = data.title || 'عمل جديد';
        overlay.appendChild(h3);
        item.appendChild(overlay);

        portfolioGrid.prepend(item);
    });
}

export function deletePortfolio(id) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('portfolio', 'readwrite');
            const store = tx.objectStore('portfolio');
            store.delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        } catch (e) { reject(e); }
    });
}

export function updatePortfolio(id, patch) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('portfolio', 'readwrite');
            const store = tx.objectStore('portfolio');
            const getReq = store.get(id);
            getReq.onsuccess = () => {
                const rec = getReq.result;
                if (!rec) { resolve(); return; }
                Object.assign(rec, patch);
                const putReq = store.put(rec);
                putReq.onsuccess = () => resolve(rec);
                putReq.onerror = () => reject(putReq.error);
            };
            getReq.onerror = () => reject(getReq.error);
        } catch (e) { reject(e); }
    });
}

// expose helpers on window for interactions module
window.deletePortfolio = deletePortfolio;
window.updatePortfolio = updatePortfolio;