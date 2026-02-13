// Translation functionality
const translations = {
    en: {
        "nav.about": "About",
        "nav.skills": "Skills",
        "nav.projects": "Projects",
        "nav.contact": "Contact",
        "hero.greeting": "Hi, I'm",
        "hero.name": "Gustavo Valenzuela",
        "hero.title": "Competitive Programmer & Software Engineer",
        "hero.description": "Computer Engineering student, passionate about, competitive programming, software development, machine learning and quantum computing. Always eager to explore new areas of computer science.",
        "hero.contact": "Get In Touch",
        "about.title": "About Me",
        "about.text": "I'm a passionate software engineer with expertise in building scalable web applications and solving complex technical challenges. With a strong foundation in both frontend and backend technologies, I thrive on creating seamless user experiences and robust system architectures.",
        "skills.title": "Technical Skills",
        "skills.programming": "Programming Languages",
        "skills.mobile": "Mobile",
        "skills.backend": "Backend",
        "skills.tools": "Tools",
        "skills.game": "Game Development",
        "skills.ai": "AI Tools and Skills",
        "projects.title": "Featured Projects",
        "projects.viewCode": "View Code",
        "projects.liveDemo": "Live Demo",
        "setup.title": "My Setup",
        "setup.os": "Operating System",
        "setup.editor": "Code Editor",
        "setup.peripherals": "Peripherals",
        "setup.terminal": "Terminal",
        "hobbies.title": "Hobbies & Interests",
        "hobbies.competitive": "Competitive Programming",
        "hobbies.competitiveDesc": "Solving algorithmic challenges on platforms like Codeforces, LeetCode, and participating in programming contests.",
        "hobbies.gaming": "Gaming",
        "hobbies.gamingDesc": "Enjoying strategy games, RPGs, and indie titles. Also interested in game development and design.",
        "hobbies.reading": "Reading",
        "hobbies.readingDesc": "Reading about computer science, mathematics, science fiction, and technology trends.",
        "hobbies.music": "Music",
        "hobbies.musicDesc": "Listening to various genres while coding, from lo-fi beats to classical music.",
        "hobbies.learning": "Continuous Learning",
        "hobbies.learningDesc": "Exploring new technologies, frameworks, and staying updated with the latest in tech.",
        "hobbies.opensource": "Open Source",
        "hobbies.opensourceDesc": "Contributing to open source projects and collaborating with the developer community.",
        "contact.title": "Let's Connect",
        "contact.description": "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
        "contact.email": "Email",
        "contact.github": "GitHub",
        "contact.linkedin": "LinkedIn"
    },
    es: {
        "nav.about": "Acerca de",
        "nav.skills": "Habilidades",
        "nav.projects": "Proyectos",
        "nav.contact": "Contacto",
        "hero.greeting": "Hola, soy",
        "hero.name": "Gustavo Valenzuela",
        "hero.title": "Programador Competitivo e Ingeniero de Software",
        "hero.description": "Estudiante de Ingeniería en Computación, con una fuerte pasión por la programación competitiva, desarrollo de software, machine learning y computación cuántica. En constante búsqueda de nuevos conocimientos en el mundo de las ciencias de la computación.",
        "hero.cta": "Mis chambas",
        "hero.contact": "Contáctame",
        "about.title": "Sobre mí",
        "about.text": "Actualmente estoy estudiando Ingeniería en Computación en la Universidad Nacional Autónoma de México. Tengo experiencia en la programación competitiva, en desarrollo móvil, backend y de videojuegos. Me gusta crear soluciones innovadoras y eficientes a problemas complejos y estar investigando nuevas tecnologías para aplicarlas en mis proyectos y saciar mi curiosidad.",
        "skills.title": "Habilidades Técnicas",
        "skills.programming": "Lenguajes de Programación",
        "skills.mobile": "Móvil",
        "skills.backend": "Backend",
        "skills.tools": "Herramientas",
        "skills.game": "Desarrollo de Videojuegos",
        "skills.ai": "Herramientas y Habilidades con IA Generativa",
        "projects.title": "Proyectos Destacados",
        "projects.viewCode": "Ver Código",
        "projects.liveDemo": "Demo en Vivo",
        "setup.title": "Mi Configuración",
        "setup.os": "Sistema Operativo",
        "setup.editor": "Editor de Código",
        "setup.peripherals": "Periféricos",
        "setup.terminal": "Terminal",
        "hobbies.title": "Pasatiempos e Intereses",
        "hobbies.competitive": "Programación Competitiva",
        "hobbies.competitiveDesc": "Resolviendo desafíos algorítmicos en plataformas como Codeforces, LeetCode, y participando en concursos de programación.",
        "hobbies.gaming": "Videojuegos",
        "hobbies.gamingDesc": "Disfrutando juegos de estrategia, RPGs y títulos indie. También interesado en desarrollo y diseño de juegos.",
        "hobbies.reading": "Lectura",
        "hobbies.readingDesc": "Leyendo sobre ciencias de la computación, matemáticas, ciencia ficción y tendencias tecnológicas.",
        "hobbies.music": "Música",
        "hobbies.musicDesc": "Escuchando varios géneros mientras programo, desde lo-fi beats hasta música clásica.",
        "hobbies.learning": "Aprendizaje Continuo",
        "hobbies.learningDesc": "Explorando nuevas tecnologías, frameworks y manteniéndome actualizado con lo último en tecnología.",
        "hobbies.opensource": "Código Abierto",
        "hobbies.opensourceDesc": "Contribuyendo a proyectos de código abierto y colaborando con la comunidad de desarrolladores.",
        "contact.title": "Conectemos",
        "contact.description": "Siempre estoy abierto a discutir nuevos proyectos, ideas creativas u oportunidades para ser parte de tu visión.",
        "contact.email": "Correo",
        "contact.github": "GitHub",
        "contact.linkedin": "LinkedIn"
    }
};

let currentLang = 'en';

function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
        const key = element.getAttribute('data-i18n');
        if (key && translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update active language indicator
    document.querySelectorAll('.lang-option').forEach(function (option) {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });

    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Language toggle functionality
const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
    langToggle.addEventListener('click', function () {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        updateLanguage(newLang);
    });
}

// Individual language option click
document.querySelectorAll('.lang-option').forEach(function (option) {
    option.addEventListener('click', function (e) {
        e.stopPropagation();
        const lang = option.getAttribute('data-lang');
        if (lang) {
            updateLanguage(lang);
        }
    });
});

// Initialize with saved preference or default to English
const savedLang = localStorage.getItem('preferredLanguage') || 'en';
updateLanguage(savedLang);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add scroll animation for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            const target = entry.target;
            if (target instanceof HTMLElement) {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(function (section) {
    if (section instanceof HTMLElement) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    }
});
