// Esperar a que el objeto translations esté disponible
function waitForTranslations(callback) {
    if (typeof translations !== 'undefined') {
        callback();
    } else {
        setTimeout(() => waitForTranslations(callback), 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    waitForTranslations(() => {
        // Inicializar tema y lenguaje
        setInitialTheme();
        setInitialLanguage();

        // Event listener para el botón de tema
        const themeSwitch = document.getElementById('themeSwitch');
        const icon = themeSwitch.querySelector('.icon');
        const text = themeSwitch.querySelector('span');

        themeSwitch.addEventListener('click', handleThemeSwitch);

        // Event listeners para los botones de idioma
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                // Remover clase active de todos los botones
                langButtons.forEach(btn => btn.classList.remove('active'));
                // Añadir clase active al botón seleccionado
                this.classList.add('active');
                changeLanguage(lang);
            });
        });
    });
});

function changeLanguage(lang) {
    // Traducir textos simples
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Traducir listas
    const lists = document.querySelectorAll('[data-i18n-list]');
    lists.forEach(list => {
        const key = list.getAttribute('data-i18n-list');
        if (translations[lang][key]) {
            list.innerHTML = translations[lang][key]
                .map(item => `<li>${item}</li>`)
                .join('');
        }
    });

    // Actualizar alt de imágenes
    const images = document.querySelectorAll('[data-i18n-alt]');
    images.forEach(img => {
        const key = img.getAttribute('data-i18n-alt');
        if (translations[lang][key]) {
            img.alt = translations[lang][key];
        }
    });

    // Actualizar skills
    const skillsContainer = document.querySelector('[data-i18n-skills]');
    if (skillsContainer) {
        const skills = translations[lang].skillTags;
        skillsContainer.innerHTML = skills.map(skill => `
            <div class="skill-tag">
                <div class="icon-container">
                    <i class="bi ${skill.icon}"></i>
                    ${skill.icon2 ? `<i class="bi ${skill.icon2}"></i>` : ''}
                </div>
                <div class="text-container">
                    <span>${skill.text}</span>
                    ${skill.subtext ? `<small>${skill.subtext}</small>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Actualizar contacto
    const contactContainer = document.querySelector('[data-i18n-contact]');
    if (contactContainer) {
        const contacts = translations[lang].contactInfo;
        contactContainer.innerHTML = contacts.map(contact => `
            ${contact.url ? `<a href="${contact.url}" target="_blank" class="contact-item">` : '<div class="contact-item">'}
                <i class="bi ${contact.icon}"></i>
                <span>${contact.text}</span>
            ${contact.url ? '</a>' : '</div>'}
        `).join('');
    }

    localStorage.setItem('language', lang);
    
    // Actualizar el texto del botón de tema
    const themeSwitch = document.getElementById('themeSwitch');
    const themeSwitchText = themeSwitch.querySelector('span');
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeSwitchText.textContent = isDark ? translations[lang].lightMode : translations[lang].darkMode;
}

function setInitialLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'es';
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Establecer el botón activo correcto
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === savedLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    changeLanguage(savedLanguage);
}

// Función para cambiar el tema
function handleThemeSwitch() {
    const html = document.documentElement;
    if (html.getAttribute('data-theme') === 'light') {
        html.setAttribute('data-theme', 'dark');
        const icon = document.getElementById('themeSwitch').querySelector('.icon');
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
        const text = document.getElementById('themeSwitch').querySelector('span');
        text.textContent = 'Modo claro';
    } else {
        html.setAttribute('data-theme', 'light');
        const icon = document.getElementById('themeSwitch').querySelector('.icon');
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
        const text = document.getElementById('themeSwitch').querySelector('span');
        text.textContent = 'Modo oscuro';
    }
}

// Función para establecer el tema inicial
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const html = document.documentElement;
    html.setAttribute('data-theme', savedTheme);
    
    // Actualizar el botón de tema
    const themeSwitch = document.getElementById('themeSwitch');
    const icon = themeSwitch.querySelector('.icon');
    const text = themeSwitch.querySelector('span');
    
    if (savedTheme === 'dark') {
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
        text.textContent = 'Modo claro';
    }
} 