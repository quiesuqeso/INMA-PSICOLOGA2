document.addEventListener('DOMContentLoaded', function () {

    /* Detectar dirección del scroll */
    let lastY = window.scrollY;
    let direction = "down";

    window.addEventListener('scroll', () => {
        direction = window.scrollY > lastY ? "down" : "up";
        lastY = window.scrollY;
    });

    /* Seleccionar elementos animables */
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.remove("from-bottom", "from-top", "in-view");

                // Reiniciar animación forzando reflow
                void entry.target.offsetWidth;

                if (direction === "down") {
                    entry.target.classList.add("from-bottom");
                } else {
                    entry.target.classList.add("from-top");
                }

                entry.target.classList.add("in-view");
            } else {
                // Permite que la animación se repita SIEMPRE
                entry.target.classList.remove("in-view", "from-bottom", "from-top");
            }
        });
    }, {
        threshold: 0.35
    });

    revealElements.forEach(el => observer.observe(el));

    /* Activar sección en el menú */
    const navLinks = document.querySelectorAll('.nav-link');

    const secObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.dataset.target === entry.target.id);
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section').forEach(sec => secObserver.observe(sec));
});
