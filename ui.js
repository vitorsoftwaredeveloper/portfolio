// UI-related helpers: theme, language, small DOM utilities and translation wiring
export const translations = {
    en: {
        pageTitle: "Vitor Soares | Fullstack Developer",
        themeSwitcherLabel: "Toggle theme",
        addFiles: "Add Files",
        clearFiles: "Clear Files",
        addWork: "Add Work",
        login: "Login",
        logo: "Vitor Soares",
        navHome: "Inicio",
        navPortfolio: "Portfolio",
        navAbout: "Sobre",
        navContact: "Contato",
        navAchievements: "Conquistas",
        heroTitle: "Fullstack Developer",
        heroSubtitle: "Ideias são inspirações que se trasportam do abstrato para o material através de minhas mãos.",
        heroButton: "Veja meus trabalhos",
        contactButton: "Contato",
        portfolioTitle: "My Work",
        p1Title: "Brand Identity Design",
        p1Desc: "A complete brand identity for a tech startup, focusing on simplicity and professionalism.",
        p2Title: "UI/UX App Design",
        p2Desc: "UI/UX design for a music app focused on usability and a sleek dark theme aesthetic.",
        p3Title: "Data Analysis Dashboard",
        p3Desc: "A data analysis dashboard with interactive charts, designed for clarity and visual appeal.",
        p4Title: "Packaging Design",
        p4Desc: "Luxury packaging design for a specialty coffee brand, blending elegance with Arabic heritage.",
        p5Title: "Social Media Designs",
        p5Desc: "A collection of social media designs for a fashion brand, aimed at increasing engagement.",
        p6Title: "Web Design",
        p6Desc: "Landing page design for a tech startup, focusing on a clear message and easy information access.",
        p7Title: "Logo Design",
        p7Desc: "A diverse collection of logos designed for clients in various industries, reflecting each brand's identity.",
        p8Title: "Artistic Poster Design",
        p8Desc: "An artistic poster showcasing the beauty of Arabic calligraphy in a modern, bold style, using the word 'Creativity'.",
        p9Title: "Additional Social Media Designs",
        p9Desc: "An expanded set of social media and promotional post designs for a fashion brand to boost engagement.",
        p10Title: "Additional UI/UX Showcase",
        p10Desc: "A visual showcase combining mobile app and web interfaces highlighting features and layout coherence.",
        aboutTitle: "About Me",
        aboutParagraph: "I'm Adel Swan, a passionate graphic designer with extensive experience in creating captivating visual identities and innovative digital designs. I believe in the power of design to tell stories and solve problems. I always strive to deliver work that combines beauty and function, helping brands grow and shine.",
        servicesTitle: "My Services",
        service1: "Brand Identity Design",
        service2: "App UI/UX Design",
        service3: "Web Design",
        service4: "Social Media Design",
        contactTitle: "Contato",
        contactParagraph: "Tem um novo projeto? Eu irei amar ouvir sobre isso. Você pode entrar em contato comigo via email ou me seguir nas mídias sociais.",
        achievementsTitle: "Achievements",
        achv1Title: "Best Brand Identity Award",
        achv1Desc: "Winner of the annual design award for a brand identity project for a tech startup.",
        achv2Title: "International Collaborations",
        achv2Desc: "Collaborative projects with design agencies across Europe and the Middle East.",
        achv3Title: "Conference Speaker",
        achv3Desc: "Presented on design innovation at a regional conference.",
        footerRights: " 2024 Adel Swan. All rights reserved."
    },
    ar: {
        pageTitle: "عادل سوان | مصمم جرافيك",
        themeSwitcherLabel: "تبديل المظهر",
        addFiles: "إضافة ملفات",
        clearFiles: "مسح الملفات",
        addWork: "إضافة عمل",
        login: "تسجيل الدخول",
        logo: "عادل سوان",
        navHome: "الرئيسية",
        navPortfolio: "أعمالي",
        navAbout: "عني",
        navContact: "اتصل بي",
        navAchievements: "إنجازاتي",
        heroTitle: "مصمم جرافيك ورائد أعمال إبداعي",
        heroSubtitle: "Have a new project? I'd love to hear about it. You can reach me via email or follow me on social media.",
        heroButton: "View My Work",
        contactButton: "Contact Me",
        portfolioTitle: "أعمالي",
        p1Title: "تصميم هوية بصرية",
        p1Desc: "تصميم هوية بصرية متكاملة لشركة ناشئة في قطاع التكنولوجيا، تركز على البساطة والاحترافية.",
        p2Title: "تصميم واجهات تطبيقات",
        p2Desc: "تصميم واجهة وتجربة مستخدم لتطبيق موسيقى يركز على سهولة الاستخدام وجمالية التصميم الداكن.",
        p3Title: "لوحة بيانات وتحليل",
        p3Desc: "تصميم لوحة بيانات لتحليل البيانات مع رسوم بيانية تفاعلية، تتميز بالوضوح والجاذبية البصرية.",
        p4Title: "تصميم عبوات",
        p4Desc: "تصميم عبوات فاخرة لعلامة تجارية متخصصة بالقهوة، يجمع بين الأناقة والتراث العربي.",
        p5Title: "تصاميم سوشيال ميديا",
        p5Desc: "مجموعة من تصاميم وسائل التواصل الاجتماعي لعلامة أزياء، تهدف لزيادة التفاعل وجذب المتابعين.",
        p6Title: "تصميم مواقع ويب",
        p6Desc: "تصميم صفحة هبوط لشركة تقنية ناشئة، مع التركيز على وضوح الرسالة وسهولة الوصول للمعلومات.",
        p7Title: "تصميم شعارات",
        p7Desc: "مجموعة متنوعة من الشعارات التي تم تصميمها لعملاء في مختلف القطاعات، تعكس هوية كل علامة تجارية.",
        p8Title: "تصميم ملصق فني",
        p8Desc: "ملصق فني يستعرض جماليات الخط العربي في قالب عصري وجريء، باستخدام كلمة 'إبداع'.",
        p9Title: "تصاميم سوشيال ميديا إضافية",
        p9Desc: "مجموعة موسعة من تصاميم ونماذج المنشورات الترويجية لزيادة التفاعل.",
        p10Title: "عرض واجهات إضافي",
        p10Desc: "عرض بصري يجمع واجهات تطبيق وموقع لتوضيح المزايا والتناسق التصميمي.",
        aboutTitle: "عني",
        aboutParagraph: "أنا عادل سوان، مصمم جرافيك شغوف أمتلك خبرة واسعة في إنشاء هويات بصرية جذابة وتصميمات رقمية مبتكرة. أؤمن بقوة التصميم في سرد القصص وحل المشكلات. أسعى دائمًا لتقديم أعمال تجمع بين الجمال والوظيفة، ومساعدة العلامات التجارية على النمو والتألق.",
        servicesTitle: "خدماتي",
        service1: "تصميم الهوية البصرية",
        service2: "تصميم واجهات التطبيقات",
        service3: "تصميم مواقع الويب",
        service4: "تصميمات السوشيال ميديا",
        contactTitle: "Contact Me",
        contactParagraph: "هل لديك مشروع جديد؟ أحب أن أسمع عنه. يمكنك التواصل معي عبر البريد الإلكتروني أو متابعتي على وسائل التواصل الاجتماعي.",
        achievementsTitle: "إنجازاتي",
        achv1Title: "جائزة أفضل هوية بصرية",
        achv1Desc: "الفوز بجائزة التصميم السنوية لمشروع هوية لشركة تقنية ناشئة.",
        achv2Title: "تعاون دولي",
        achv2Desc: "مشاريع مشتركة مع وكالات تصميم في أوروبا والشرق الأوسط.",
        achv3Title: "مؤتمر ومتحدث",
        achv3Desc: "محاضرة حول الابتكار في التصميم في مؤتمر محلي.",
        footerRights: " 2024 عادل سوان. جميع الحقوق محفوظة."
    }
};

export function setInitialThemeAndLang() {
    const themeSwitcher = document.getElementById('theme-switcher');
    let currentTheme = localStorage.getItem('theme') || 'dark';
    const setTheme = (theme) => {
        const themeIcon = themeSwitcher.querySelector('i');
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.body.classList.remove('light-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        localStorage.setItem('theme', theme);
    };
    themeSwitcher.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });
    setTheme(currentTheme);

    const langSwitcher = document.getElementById('lang-switcher');
    let currentLang = localStorage.getItem('lang') || 'ar';
    langSwitcher.addEventListener('click', () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        applyLanguage(currentLang);
    });
    applyLanguage(currentLang);
}

export function initUI() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

export function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', lang === 'en');

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            if (key === 'themeSwitcherLabel') el.setAttribute('aria-label', translations[lang][key]);
            else el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-key-title]').forEach(element => {
        const titleKey = element.getAttribute('data-key-title');
        const descKey = element.getAttribute('data-key-desc');
        if (translations[lang]) {
            if (translations[lang][titleKey]) {
                const h3 = element.querySelector('h3');
                if (h3) h3.textContent = translations[lang][titleKey];
            }
            if (translations[lang][descKey]) {
                element.dataset.description = translations[lang][descKey];
            }
        }
    });

    document.title = (translations[lang] && translations[lang].pageTitle) || document.title;
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) langSwitcher.textContent = lang === 'ar' ? 'EN' : 'AR';

    const fb = document.getElementById('file-btn');
    const cb = document.getElementById('clear-files');
    const aw = document.getElementById('add-work-btn');
    const lb = document.getElementById('login-btn');
    if (fb && translations[lang].addFiles) fb.textContent = translations[lang].addFiles;
    if (cb && translations[lang].clearFiles) cb.textContent = translations[lang].clearFiles;
    if (aw && translations[lang].addWork) aw.textContent = translations[lang].addWork;
    if (lb && translations[lang].login && !lb.classList.contains('logged-in')) lb.textContent = translations[lang].login;
}