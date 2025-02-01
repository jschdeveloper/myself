// Función para manejar el cambio de tema
function handleThemeSwitch() {
    const html = document.documentElement;
    const themeSwitch = document.getElementById('themeSwitch');
    const icon = themeSwitch.querySelector('.bi');
    const text = themeSwitch.querySelector('span');
    
    // Obtener el tema actual
    const currentTheme = html.getAttribute('data-theme');
    
    // Cambiar al tema opuesto
    if (currentTheme === 'light') {
        html.setAttribute('data-theme', 'dark');
        icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        text.textContent = 'Modo claro';
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        icon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        text.textContent = 'Modo oscuro';
        localStorage.setItem('theme', 'light');
    }
}

// Función para establecer el tema inicial
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    const themeSwitch = document.getElementById('themeSwitch');
    const icon = themeSwitch.querySelector('.bi');
    const text = themeSwitch.querySelector('span');
    
    html.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'dark') {
        icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        text.textContent = 'Modo claro';
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Establecer tema inicial
    setInitialTheme();
    
    // Añadir evento al botón
    const themeSwitch = document.getElementById('themeSwitch');
    themeSwitch.addEventListener('click', handleThemeSwitch);
}); 