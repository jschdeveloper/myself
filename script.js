document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const icon = themeSwitch.querySelector('.icon');
    const text = themeSwitch.querySelector('span');

    themeSwitch.addEventListener('click', function() {
        const html = document.documentElement;
        if (html.getAttribute('data-theme') === 'light') {
            html.setAttribute('data-theme', 'dark');
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
            text.textContent = 'Modo claro';
        } else {
            html.setAttribute('data-theme', 'light');
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
            text.textContent = 'Modo oscuro';
        }
    });
}); 