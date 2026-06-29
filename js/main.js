/* Cory Anne Roberts — interactions */

/* ---------- Year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Day / night theme ---------- */
(function theme() {
  const root = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  const sync = () => {
    const dark = root.getAttribute('data-theme') !== 'light';
    if (btn) btn.setAttribute('aria-pressed', String(!dark));
  };
  sync();
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('car-theme', next); } catch (e) {}
    sync();
  });
  // follow OS changes only if the user hasn't chosen explicitly
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('car-theme'); } catch (err) {}
    if (!saved) { root.setAttribute('data-theme', e.matches ? 'light' : 'dark'); sync(); }
  });
})();

/* ---------- Gallery render + filters ---------- */
(function buildGallery() {
  const grid = document.getElementById('grid');
  const filterBar = document.getElementById('filters');
  if (!grid || !window.GALLERY) return;

  const tags = ['All', ...Array.from(new Set(window.GALLERY.map((g) => g.tag)))];

  // filter chips
  tags.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (i === 0 ? ' is-active' : '');
    btn.textContent = t;
    btn.dataset.tag = t;
    btn.setAttribute('role', 'tab');
    filterBar.appendChild(btn);
  });

  // figures
  window.GALLERY.forEach((g) => {
    const fig = document.createElement('figure');
    fig.className = 'shot';
    fig.dataset.tag = g.tag;
    fig.dataset.orient = g.orient;

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = g.client + ' · Photography';
    img.src = g.file;
    img.addEventListener('error', () => fig.classList.add('is-empty'));

    const cap = document.createElement('figcaption');
    cap.innerHTML = '<span>' + g.client + '</span><i>' + g.tag + '</i>';

    fig.append(img, cap);
    grid.appendChild(fig);
    requestAnimationFrame(() => io.observe(fig));
  });

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    filterBar.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    const tag = btn.dataset.tag;
    grid.querySelectorAll('.shot').forEach((fig) => {
      const show = tag === 'All' || fig.dataset.tag === tag;
      fig.classList.toggle('is-hidden', !show);
    });
  });
})();

/* ---------- Standalone image slots degrade to clean panels ---------- */
document.querySelectorAll('.img-slot img').forEach((img) => {
  img.addEventListener('error', () => img.closest('.img-slot').classList.add('is-empty'));
});

/* ---------- Casting reels — lazy-mount video on play ---------- */
document.querySelectorAll('.reel').forEach((reel) => {
  const btn = reel.querySelector('.reel__play');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const src = reel.dataset.src;
    const v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.addEventListener('error', () => reel.classList.add('is-empty'));
    const frame = reel.querySelector('.reel__frame');
    frame.innerHTML = '';
    frame.classList.add('is-playing');
    frame.appendChild(v);
  });
});

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll(
  '.hero__meta, .hero__title .line, .hero__sub > *, ' +
  '.disciplines__head > *, .disc, ' +
  '.about__portrait, .about__copy > *, .work__head > *, .cap, ' +
  '.feature__tag, .feature__visual, .feature__copy > *, ' +
  '.casting .eyebrow, .reel, .gallery__head > *, .contact > *'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 5) * 70 + 'ms';
  io.observe(el);
});

/* ---------- Nav scrolled state ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);
