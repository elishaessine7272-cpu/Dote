let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', function () {
        const currentScroll =
            window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll <= 10) {
            navbar.classList.remove('navbar-hidden');
            lastScrollTop = currentScroll;
            return;
        }

        if (currentScroll > lastScrollTop) {
            // Scrolling down
            navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollTop = currentScroll;
    });
}