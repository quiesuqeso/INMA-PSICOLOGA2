// SELECTORES
const reveals = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
let lastScroll = 0;

// 1) REVEAL OBSERVER (inversión de dirección)
// Scroll hacia abajo -> aparece desde ARRIBA (from-top)
// Scroll hacia arriba  -> aparece desde ABAJO (from-bottom)
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const el = entry.target;
        const scrollingDown = window.scrollY > lastScroll;

        // remover direcciones previas
        el.classList.remove("from-top", "from-bottom");

        if (scrollingDown) {
            // si vamos hacia abajo -> elemento aparecerá desde arriba
            el.classList.add("from-top");
        } else {
            // si vamos hacia arriba -> elemento aparecerá desde abajo
            el.classList.add("from-bottom");
        }

        if (entry.isIntersecting) {
            el.classList.add("in-view");
        } else {
            // quitamos para permitir repetición al volver
            el.classList.remove("in-view");
        }
    });

    lastScroll = window.scrollY;
}, { threshold: 0.15 });

// observar todos los elementos "reveal"
reveals.forEach(r => revealObserver.observe(r));


// 2) NAV - resaltar sección activa según scroll (y al clicar)
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const id = entry.target.getAttribute("id");
        const link = document.querySelector(`.nav-link[data-target="${id}"], .nav-link[href="#${id}"]`);

        if (entry.isIntersecting) {
            // marcar activo
            navLinks.forEach(n => n.classList.remove("active"));
            if (link) link.classList.add("active");
        } else {
            // cuando salga, solo quitar si es el actualmente marcado (se manejará al entrar en otra)
            if (link) link.classList.remove("active");
        }
    });
}, {
    threshold: 0.45 // requiere mayor visibilidad para considerar activa
});

sections.forEach(s => sectionObserver.observe(s));

// Cuando se hace clic en un nav-link, activar inmediatamente y forzar animación en la sección
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
        // comportamiento por defecto: scroll suave por anchor
        // activar visualmente
        navLinks.forEach(n => n.classList.remove("active"));
        link.classList.add("active");

        const href = link.getAttribute("href");
        const id = (href && href.startsWith("#")) ? href.slice(1) : link.dataset.target;
        const target = document.getElementById(id);
        if (!target) return;

        // Forzar reinicio de animaciones de reveal dentro de la sección
        const revealsIn = target.querySelectorAll(".reveal");
        revealsIn.forEach(el => {
            el.classList.remove("in-view");
            // Forzar reflow para reinicio (trick)
            void el.offsetWidth;
            el.classList.add("in-view");
        });
    });
});


// 3) SERVICIOS -> bottom sheet (banner inferior) con contenido por servicio
const serviceCards = document.querySelectorAll(".service-card");
const bottomOverlay = document.getElementById("bottomOverlay");
const bottomSheet = document.getElementById("bottomSheet");
const bsTitle = document.getElementById("bsTitle");
const bsBody = document.getElementById("bsBody");
const closeBottom = document.getElementById("closeBottom");

// Contenidos por servicio (puedes editar textos aquí)
const serviceContent = {
    ansiedad: {
        title: "Ansiedad",
        body: `<p>La ansiedad puede manifestarse como inquietud constante, tensión muscular, problemas de sueño o ataques de pánico. Trabajo con técnicas prácticas (exposición gradual, reestructuración de conducta y prácticas de regulación) para reducir la activación y recuperar el control sobre tu vida diaria.</p>`
    },
    animo: {
        title: "Ánimo bajo / Depresión",
        body: `<p>Ofrezco intervenciones centradas en recuperar actividad, planificar pequeñas metas, reforzar rutinas y trabajar pensamientos que mantienen el malestar. El objetivo es restablecer interés y energía en el día a día.</p>`
    },
    autoestima: {
        title: "Autoestima y relaciones",
        body: `<p>Trabajamos habilidades de asertividad, límites y autoestima para mejorar las relaciones y aumentar la seguridad personal mediante ejercicios prácticos y role play.</p>`
    },
    estres: {
        title: "Estrés laboral",
        body: `<p>Ofrezco estrategias para la gestión de la carga, establecer límites, prevención del burnout y técnicas para mejorar la recuperación fuera del trabajo. Incluyo herramientas prácticas que puedes aplicar en tu jornada.</p>`
    },
    duelo: {
        title: "Duelo y pérdidas",
        body: `<p>Acompañamiento en procesos de pérdida: validar emociones, dar espacio al duelo y construir rituales o pasos prácticos para integrar la pérdida y reconstruir la rutina con sentido.</p>`
    },
    pareja: {
        title: "Terapia de pareja",
        body: `<p>Terapia centrada en mejorar la comunicación, gestionar conflictos y recuperar la conexión. Trabajo con técnicas de comunicación efectiva, manejo de expectativas y ejercicios prácticos para hacer en casa.</p>`
    }
};

function openBottomSheet(key) {
    const data = serviceContent[key];
    if (!data) return;
    bsTitle.textContent = data.title;
    bsBody.innerHTML = data.body;
    bottomOverlay.classList.add("show");
    bottomSheet.classList.add("show");
    bottomOverlay.setAttribute("aria-hidden", "false");
    bottomSheet.setAttribute("aria-hidden", "false");
    // bloquear scroll del body
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
}

function closeBottomSheet() {
    bottomOverlay.classList.remove("show");
    bottomSheet.classList.remove("show");
    bottomOverlay.setAttribute("aria-hidden", "true");
    bottomSheet.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

// listeners
serviceCards.forEach(card => {
    card.addEventListener("click", () => {
        const key = card.getAttribute("data-service");
        openBottomSheet(key);
    });
});

closeBottom.addEventListener("click", closeBottomSheet);
bottomOverlay.addEventListener("click", closeBottomSheet);

// cerrar con ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBottomSheet();
});

// Evitar que clicks dentro del sheet cierren (si hiciera falta)
bottomSheet.addEventListener("click", (e) => {
    e.stopPropagation();
});
