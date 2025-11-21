// DOM shortcuts
const header = document.getElementById('header');
const nav = document.getElementById('main-nav');
const navLinks = nav.querySelectorAll('a');
const sections = document.querySelectorAll('section');
const menuToggle = document.getElementById('menu-toggle');

// Mobile menu toggle
menuToggle && menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Small helper: close mobile menu when link clicked
navLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    // allow default anchor scroll, but close mobile menu
    if (nav.classList.contains('open')) nav.classList.remove('open');
  });
});

// Header shrink on scroll
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// IntersectionObserver: set body class bg-green based on section attribute
const obsOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.45 // section considered visible near middle of viewport
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // If section should show green background, add class to body,
      // otherwise remove it. We use .section--green to mark sections.
      if (entry.target.classList.contains('section--green')) {
        document.body.classList.add('bg-green');
      } else {
        document.body.classList.remove('bg-green');
      }

      // Update active nav link
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#','');
        if (href === id) link.classList.add('active');
