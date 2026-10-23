// Mobile navigation toggle (shared by index.html and contact.html)
document.addEventListener('DOMContentLoaded', () => {
    // Footer copyright year -- was hardcoded as "2025" on both pages, so
    // it would have quietly gone stale every January. Both footers have a
    // #copyright-year span with that same value as a fallback for anyone
    // reading the HTML directly (view-source, no-JS, etc).
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!menuToggle || !navLinks) return;

    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu() {
        const isOpen = navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Close the menu after tapping a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close the menu if the viewport is resized back to desktop width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
});
