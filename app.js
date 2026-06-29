/* =============================================================
   PORTFOLIO HANANE LEBBA — interactions partagées
   ============================================================= */

/* ---------- Menu mobile ---------- */
(function(){
  var header = document.querySelector('header.site');
  var burger = document.querySelector('.burger');
  if(!header || !burger) return;
  burger.addEventListener('click', function(){
    var open = header.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // referme le menu au clic sur un lien
  header.querySelectorAll('.nav-links a').forEach(function(a){
    a.addEventListener('click', function(){ header.classList.remove('open'); });
  });
})();

/* ---------- Carrousel ---------- */
(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach(function(root){
    var track = root.querySelector('[data-track]');
    var slides = Array.prototype.slice.call(track.children);
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var dotsWrap = root.querySelector('[data-dots]');
    var index = 0, timer = null;
    if(slides.length <= 1){ if(prev)prev.style.display='none'; if(next)next.style.display='none'; return; }

    // points de navigation
    slides.forEach(function(_, i){
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Aller à la diapositive ' + (i+1));
      b.addEventListener('click', function(){ go(i); reset(); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(i){
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index*100) + '%)';
      dots.forEach(function(d, di){ d.setAttribute('aria-current', di===index ? 'true':'false'); });
    }
    function nextSlide(){ go(index+1); }
    function prevSlide(){ go(index-1); }

    if(next) next.addEventListener('click', function(){ nextSlide(); reset(); });
    if(prev) prev.addEventListener('click', function(){ prevSlide(); reset(); });

    // clavier
    root.addEventListener('keydown', function(e){
      if(e.key==='ArrowRight'){ nextSlide(); reset(); }
      if(e.key==='ArrowLeft'){ prevSlide(); reset(); }
    });

    // glissé tactile
    var x0=null;
    track.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; stop(); }, {passive:true});
    track.addEventListener('touchend', function(e){
      if(x0===null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if(Math.abs(dx) > 40){ dx < 0 ? nextSlide() : prevSlide(); }
      x0=null; reset();
    });

    // défilement auto (désactivé si l'utilisateur préfère moins d'animations)
    function start(){ if(prefersReduced) return; timer = setInterval(nextSlide, 5500); }
    function stop(){ if(timer){ clearInterval(timer); timer=null; } }
    function reset(){ stop(); start(); }
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    go(0); start();
  });
})();
