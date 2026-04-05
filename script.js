/* ── Nav border on scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Theme toggle ── */
const toggle = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  toggle.textContent = '☀️';
}
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const light = document.body.classList.contains('light');
  toggle.textContent = light ? '☀️' : '🌙';
  localStorage.setItem('theme', light ? 'light' : 'dark');
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
