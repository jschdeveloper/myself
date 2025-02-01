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
    console.log('Changing language to:', lang); // Para debugging
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Translation missing for key "${key}" in language "${lang}"`);
        }
    });
    
    // Actualizar el idioma en localStorage
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
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    html.setAttribute('data-theme', savedTheme);
} 