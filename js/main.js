// main.js - navegación y scroll
document.addEventListener('DOMContentLoaded', function(){
  // year
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  const header = document.querySelector('header');
  const navBtns = Array.from(document.querySelectorAll('#site-nav .nav-btn'));
  const sections = Array.from(document.querySelectorAll('main section, .hero'));

  // click -> smooth scroll (account header height)
  const headerOffset = header ? header.offsetHeight : 72;
  navBtns.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const targetSelector = btn.getAttribute('data-target');
      if(!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if(!target) return;
      const top = target.getBoundingClientRect().top + window.pageYOffset - (headerOffset - 6);
      window.scrollTo({top, behavior:'smooth'});
    });
  });

  // throttle scroll handler
  let lastKnownScrollY = 0;
  let ticking = false;
  window.addEventListener('scroll', function(){
    lastKnownScrollY = window.scrollY;
    if(!ticking){
      window.requestAnimationFrame(function(){
        onScroll(lastKnownScrollY);
        ticking = false;
      });
      ticking = true;
    }
  });

  function onScroll(scrollY){
    // header color switch
    if(scrollY > 60) header.classList.add('scrolled'); else header.classList.remove('scrolled');

    // active section (center of viewport)
    let currentId = null;
    const middle = scrollY + (window.innerHeight / 2);
    sections.forEach(sec=>{
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if(middle >= top && middle < bottom){
        currentId = sec.id;
      }
    });

    navBtns.forEach(b=>{
      const target = b.getAttribute('data-target') ? b.getAttribute('data-target').replace('#','') : null;
      if(target && target === currentId) b.classList.add('active'); else b.classList.remove('active');
    });
  }

  // initial invocation
  onScroll(window.scrollY);
});
