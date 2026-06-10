const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

/* ── Scroll: nav border, progress bar, back-to-top ── */
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  toTop.classList.toggle('show', window.scrollY > 600);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}, { passive: true });

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* ── Theme toggle ── */
const toggle = document.getElementById('themeToggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(light) {
  document.body.classList.toggle('light', light);
  toggle.textContent = light ? '☀️' : '🌙';
  themeMeta.setAttribute('content', light ? '#f6f7fa' : '#0b0e14');
}
applyTheme(localStorage.getItem('theme') === 'light');
toggle.addEventListener('click', () => {
  const light = !document.body.classList.contains('light');
  applyTheme(light);
  localStorage.setItem('theme', light ? 'light' : 'dark');
});

/* ── Copy email + toast ── */
const EMAIL = 'shashank3087@gmail.com';
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}
document.getElementById('copyEmail').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    showToast('Email copied ✓');
  } catch {
    location.href = 'mailto:' + EMAIL;
  }
});

/* ── Footer year ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Scroll fade-in ── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

/* ── Staggered children animation ── */
const staggerObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      Array.from(e.target.children).forEach((child, i) => {
        child.style.transitionDelay = (i * 70) + 'ms';
      });
      staggerObs.unobserve(e.target);
    }
  });
}, { threshold: 0.06 });
document.querySelectorAll('[data-stagger]').forEach(el => staggerObs.observe(el));

/* ── Count-up stats ── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterObs.unobserve(e.target);
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const start = performance.now();
    const duration = 1100;
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObs.observe(el));

/* ── Cursor spotlight + tilt on cards ── */
document.querySelectorAll('.card, .featured, .skill-group, .stat, .edu-card').forEach(el => {
  const tilts = canHover && !reduceMotion && !el.classList.contains('featured');
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', x + 'px');
    el.style.setProperty('--my', y + 'px');
    if (tilts) {
      const rx = ((y / r.height) - .5) * -5;
      const ry = ((x / r.width) - .5) * 5;
      el.style.transition = 'transform .1s ease-out';
      el.style.transform =
        `perspective(700px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
    }
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = '';
  });
});

/* ── Active nav on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navlinks a[href^="#"]');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.navlinks a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-25% 0px -65% 0px' });
sections.forEach(s => navObs.observe(s));
