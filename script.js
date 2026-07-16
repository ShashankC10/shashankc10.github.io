const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Scroll: progress bar, back-to-top, scroll-spy ── */
const progressBar = document.getElementById('progressBar');
const toTop = document.getElementById('toTop');
const navLinks = [...document.querySelectorAll('.lnav a')];
const sections = [...document.querySelectorAll('section[id]')];

/* Position-based spy: always resolves to exactly one section, and short
   sections near the page bottom (Contact) still activate. */
function updateSpy() {
  if (!sections.length) return;
  const probe = window.scrollY + window.innerHeight * 0.35;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= probe) current = s; });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    current = sections[sections.length - 1];
  }
  navLinks.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
}

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  updateSpy();
}
if (progressBar || toTop || sections.length) {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* ── Theme toggle ── */
const toggle = document.getElementById('themeToggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  if (toggle) toggle.textContent = dark ? 'LIGHT' : 'DARK';
  themeMeta?.setAttribute('content', dark ? '#0e0d0b' : '#ffffff');
}
applyTheme(localStorage.getItem('theme') === 'dark');
toggle?.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  applyTheme(dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
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
document.getElementById('copyEmail')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    showToast('EMAIL COPIED ✓');
  } catch {
    location.href = 'mailto:' + EMAIL;
  }
});

/* ── Footer year ── */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* ── Section reveal ── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
  });
}, { threshold: 0.06 });
document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

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
document.querySelectorAll('.cnt[data-count]').forEach(el => counterObs.observe(el));
