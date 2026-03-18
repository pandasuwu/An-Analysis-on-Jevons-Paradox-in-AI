/* main.js — Scroll effects, counter animations, interactive controls */

/* ─────────────────────────────────────
   SCROLL PROGRESS BAR
   ───────────────────────────────────── */
function updateProgress() {
  const el = document.getElementById('navProgress');
  if (!el) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  el.style.width = Math.min(100, pct).toFixed(1) + '%';
}

/* ─────────────────────────────────────
   NAV SCROLLED STATE & ACTIVE LINKS
   ───────────────────────────────────── */
function updateNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active nav link
  const sections = ['top','overview','h1','h2','h3','conclusion'];
  const links    = document.querySelectorAll('.nav-links a');
  let current    = '';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });

  links.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}

/* ─────────────────────────────────────
   REVEAL ON SCROLL
   ───────────────────────────────────── */
function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within same parent
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'))
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 60, 300);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────
   COUNT-UP ANIMATION
   ───────────────────────────────────── */
function countUp(el, target, duration = 1200, suffix = '') {
  const start = Date.now();
  const isLarge = target >= 1000;

  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(eased * target);
    el.textContent = val.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function setupCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.classList.contains('count-str') ? '×' : '';
        countUp(el, target, 1400, suffix);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-val[data-count]').forEach(el => io.observe(el));
}

/* ─────────────────────────────────────
   HERO COUNTER (3.75×)
   ───────────────────────────────────── */
function setupHeroCounter() {
  const el = document.getElementById('heroCountUp');
  const float = document.querySelector('.hero-stat-float');
  if (!el || !float) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        float.querySelector('.float-num').classList.add('revealed');
        // Count from 0 to 3.75
        const start = Date.now();
        const duration = 1800;
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (eased * 3.75).toFixed(2) + '×';
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(float);
      }
    });
  }, { threshold: 0.3 });

  io.observe(float);
}

/* ─────────────────────────────────────
   INTERACTIVE EXPLORER CONTROLS
   ───────────────────────────────────── */
function setupExplorer() {
  const effSlider = document.getElementById('effDouble');
  const demSlider = document.getElementById('demDouble');
  const effVal    = document.getElementById('effDoubleVal');
  const demVal    = document.getElementById('demDoubleVal');
  const ratioEl   = document.getElementById('ratioVal');
  const verdictEl = document.getElementById('ratioVerdict');

  if (!effSlider || !demSlider) return;

  function update() {
    const eff = parseFloat(effSlider.value);
    const dem = parseFloat(demSlider.value);

    effVal.textContent = eff.toFixed(1) + ' yrs';
    demVal.textContent = dem.toFixed(2) + ' yrs';

    const ratio = eff / dem;
    ratioEl.textContent = ratio.toFixed(2) + '×';

    if (ratio <= 1) {
      ratioEl.classList.add('safe');
      verdictEl.classList.add('safe');
      verdictEl.textContent = 'No paradox — efficiency keeps pace with demand';
    } else {
      ratioEl.classList.remove('safe');
      verdictEl.classList.remove('safe');
      verdictEl.textContent = 'Paradox active — total energy rises';
    }

    if (typeof updateExplorerChart === 'function') {
      updateExplorerChart(eff, dem);
    }
  }

  effSlider.addEventListener('input', update);
  demSlider.addEventListener('input', update);
}

/* ─────────────────────────────────────
   SMOOTH ANCHOR SCROLL
   ───────────────────────────────────── */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

/* ─────────────────────────────────────
   INIT
   ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  setupCounters();
  setupHeroCounter();
  setupExplorer();
  setupSmoothScroll();

  window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
  }, { passive: true });

  updateProgress();
  updateNav();
});
