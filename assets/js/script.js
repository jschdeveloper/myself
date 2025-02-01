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

let phoneClickCount = 0;
const REQUIRED_CLICKS = 10;
let firstNumber, secondNumber, correctAnswer;
let isEmailRevealed = false; // Nueva variable para rastrear el estado del correo
let emailAddress = ''; // Para guardar el correo cuando se revela

function generateMathProblem() {
    firstNumber = Math.floor(Math.random() * 9) + 1;
    secondNumber = Math.floor(Math.random() * 9) + 1;
    correctAnswer = firstNumber + secondNumber;
    return `${firstNumber} + ${secondNumber}`;
}

function handlePhoneClick(lang) {
    phoneClickCount++;
    const phoneElement = document.querySelector('.phone-hidden');
    if (phoneElement) {
        if (phoneClickCount < REQUIRED_CLICKS) {
            const remainingClicks = REQUIRED_CLICKS - phoneClickCount;
            const message = translations[lang].clicksRemaining.replace('{n}', remainingClicks);
            phoneElement.innerHTML = `
                <i class="bi bi-telephone"></i>
                <span>${message}</span>
            `;
        } else {
            const phoneNumber = translations[lang].contactInfo.find(contact => contact.isPhone).text;
            phoneElement.outerHTML = `
                <div class="contact-item">
                    <i class="bi bi-telephone"></i>
                    <span>${phoneNumber}</span>
                </div>
            `;
        }
    }
}

function verifyAnswer(lang, email, emailUrl) {
    const answerInput = document.querySelector('.math-answer');
    const resultDiv = document.querySelector('.challenge-result');
    const challengeContainer = document.querySelector('.email-challenge-container');
    
    if (parseInt(answerInput.value) === correctAnswer) {
        isEmailRevealed = true;
        emailAddress = email;
        challengeContainer.innerHTML = `
            <a href="${emailUrl}" class="contact-success">
                <span>${email}</span>
            </a>
        `;
    } else {
        resultDiv.textContent = translations[lang].emailWrong;
        resultDiv.classList.add('wrong');
        answerInput.value = '';
        
        setTimeout(() => {
            resultDiv.textContent = '';
            resultDiv.classList.remove('wrong');
            const mathProblem = generateMathProblem();
            challengeContainer.querySelector('.challenge-text').innerHTML = 
                translations[lang].emailHidden.replace('{sum}', mathProblem);
        }, 2000);
    }
}

function updateSkillsAndContactSection(lang) {
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

    // Actualizar contactos
    const contacts = translations[lang].contactInfo;
    const contactContainer = document.querySelector('[data-i18n-contact]');
    
    if (contactContainer) {
        contactContainer.innerHTML = contacts.map(contact => {
            if (contact.isPhone) {
                if (phoneClickCount < REQUIRED_CLICKS) {
                    const message = phoneClickCount === 0 
                        ? translations[lang].phoneHidden 
                        : translations[lang].clicksRemaining.replace('{n}', REQUIRED_CLICKS - phoneClickCount);
                    
                    return `
                        <div class="contact-item phone-hidden" onclick="handlePhoneClick('${lang}')">
                            <i class="bi ${contact.icon}"></i>
                            <span>${message}</span>
                        </div>
                    `;
                } else {
                    return `
                        <div class="contact-item">
                            <i class="bi ${contact.icon}"></i>
                            <span>${contact.text}</span>
                        </div>
                    `;
                }
            } else if (contact.icon === 'bi-envelope') {
                if (isEmailRevealed) {
                    return `
                        <div class="contact-item email-challenge">
                            <i class="bi ${contact.icon}"></i>
                            <div class="email-challenge-container">
                                <a href="mailto:${emailAddress}" class="contact-success">
                                    <span>${emailAddress}</span>
                                </a>
                            </div>
                        </div>
                    `;
                }
                const mathProblem = generateMathProblem();
                return `
                    <div class="contact-item email-challenge">
                        <i class="bi ${contact.icon}"></i>
                        <div class="email-challenge-container">
                            <div class="challenge-title">
                                ${translations[lang].emailHiddenTitle}
                            </div>
                            <div class="challenge-text">
                                ${translations[lang].emailHidden.replace('{sum}', mathProblem)}
                            </div>
                            <div class="challenge-input">
                                <input type="number" 
                                    placeholder="${translations[lang].emailPlaceholder}"
                                    class="math-answer"
                                >
                                <button class="verify-btn" onclick="verifyAnswer('${lang}', '${contact.text}', '${contact.url}')">
                                    ${translations[lang].emailSubmit}
                                </button>
                            </div>
                            <div class="challenge-result"></div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    ${contact.url ? `<a href="${contact.url}" target="_blank" class="contact-item">` : '<div class="contact-item">'}
                        <i class="bi ${contact.icon}"></i>
                        <span>${contact.text}</span>
                    ${contact.url ? '</a>' : '</div>'}
                `;
            }
        }).join('');
    }
}

function updateCertifications(lang) {
    const container = document.querySelector('.certifications-grid');
    
    if (container) {
        container.innerHTML = translations[lang].certificationsList.map(cert => `
            <div class="certification-card">
                <div class="certification-title">${cert.name}</div>
                <div class="certification-meta">
                    <i class="bi bi-building"></i>
                    <span>${cert.issuer}</span>
                    <i class="bi bi-calendar3"></i>
                    <span>${cert.date}</span>
                </div>
                ${cert.credential ? `
                    <div class="certification-id">
                        <i class="bi bi-shield-check"></i> ID: ${cert.credential}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
}

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Actualizar listas si existen
    const listElements = document.querySelectorAll('[data-i18n-list]');
    listElements.forEach(element => {
        const key = element.getAttribute('data-i18n-list');
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key]
                .map(item => `<li>${item}</li>`)
                .join('');
        }
    });

    updateSkillsAndContactSection(lang);
    updateCertifications(lang);
    localStorage.setItem('language', lang);

    // Actualizar el texto del botón según su estado
    const showMoreBtn = document.querySelector('.show-more-btn');
    const hiddenContent = document.querySelector('.experience-hidden');
    if (showMoreBtn && hiddenContent) {
        showMoreBtn.textContent = hiddenContent.style.display === 'none' ? 
            translations[lang].showMore : 
            translations[lang].showLess;
    }
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

function initializeShowMoreButton() {
    const showMoreBtn = document.querySelector('.show-more-btn');
    const hiddenContent = document.querySelector('.experience-hidden');
    
    if (showMoreBtn && hiddenContent) {
        showMoreBtn.addEventListener('click', () => {
            const isHidden = hiddenContent.style.display === 'none';
            const currentLang = localStorage.getItem('language') || 'es';
            
            if (isHidden) {
                hiddenContent.style.display = 'block';
                setTimeout(() => hiddenContent.classList.add('show'), 10);
                showMoreBtn.textContent = translations[currentLang].showLess;
            } else {
                hiddenContent.classList.remove('show');
                setTimeout(() => {
                    hiddenContent.style.display = 'none';
                }, 500);
                showMoreBtn.textContent = translations[currentLang].showMore;
            }
        });
    }
}

function initializeLeftFloatingMenu() {
    const menuDots = document.querySelectorAll('.menu-dot');
    
    // Mantener el resto de la funcionalidad
    menuDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href');
            
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Actualizar estado activo basado en la sección visible
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                menuDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === `#${sectionId}`) {
                        dot.classList.add('active');
                    } else if (window.scrollY < 100 && dot.getAttribute('href') === '#home') {
                        // Activar "Inicio" cuando estamos en la parte superior
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    document.querySelectorAll('section, .section').forEach(section => {
        observer.observe(section);
    });
}

// Función para el tema
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Establecer el tema inicial
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    }

    // Evento de click para cambiar el tema
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        }
    });
}

// Función para el selector de idioma
function initializeLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'es';

    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
        
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            changeLanguage(lang);
            localStorage.setItem('language', lang);
            
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Función para los toggles de sección
function initializeSectionToggles() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const toggleButton = section.querySelector('.toggle-section');
        if (!toggleButton) return;
        
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            section.classList.toggle('collapsed');
            
            const isCollapsed = section.classList.contains('collapsed');
            toggleButton.setAttribute('aria-label', 
                isCollapsed ? 'Expandir sección' : 'Minimizar sección'
            );
        });
    });
}

// Añadir la función para manejar el toggle de todas las secciones
function initializeToggleAllSections() {
    const toggleAllButton = document.getElementById('toggleAllSections');
    if (!toggleAllButton) return;

    let allCollapsed = false;

    function updateButtonState() {
        const currentLang = localStorage.getItem('language') || 'es';
        const buttonText = allCollapsed ? 
            translations[currentLang].expandAll : 
            translations[currentLang].collapseAll;
        
        const icon = toggleAllButton.querySelector('i');
        if (icon) {
            icon.className = allCollapsed ? 'bi bi-arrows-expand' : 'bi bi-arrows-collapse';
        }
        
        const span = toggleAllButton.querySelector('span');
        if (span) {
            span.textContent = buttonText;
        }
    }

    toggleAllButton.addEventListener('click', () => {
        allCollapsed = !allCollapsed;
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            section.classList.toggle('collapsed', allCollapsed);
            
            const toggleButton = section.querySelector('.toggle-section');
            if (toggleButton) {
                toggleButton.setAttribute('aria-label', 
                    allCollapsed ? 'Expandir sección' : 'Minimizar sección'
                );
            }
        });
        
        updateButtonState();
    });

    // Actualizar el texto cuando cambie el idioma
    document.addEventListener('languageChanged', updateButtonState);
}

// Actualizar la inicialización
document.addEventListener('DOMContentLoaded', () => {
    try {
        const currentLang = localStorage.getItem('language') || 'es';
        changeLanguage(currentLang);
        initializeTheme();
        initializeLanguageSwitcher();
        initializeSectionToggles();
        initializeToggleAllSections();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}); 