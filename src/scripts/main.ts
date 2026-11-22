// Header: Hintergrund beim Scrollen + mobiles Menü
const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');

if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (header && toggle) {
  const setOpen = (open: boolean) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  header.querySelectorAll('.nav__list a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (header.classList.contains('is-open') && !header.contains(e.target as Node)) setOpen(false);
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', () => setOpen(false));
}

// Sanftes Einblenden beim Scrollen
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Mobile Sticky-CTA: sichtbar nach dem Hero, ausgeblendet im Anfragebereich
const sticky = document.querySelector<HTMLElement>('[data-sticky-cta]');
const hero = document.querySelector('.hero');
const inquiry = document.querySelector('#anfrage');
const footer = document.querySelector('.footer');

if (sticky && hero && 'IntersectionObserver' in window) {
  const state = { pastHero: false, blocked: new Set<Element>() };
  const update = () => {
    const show = state.pastHero && state.blocked.size === 0;
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', String(!show));
    sticky.querySelector('a')?.setAttribute('tabindex', show ? '0' : '-1');
  };

  new IntersectionObserver(([entry]) => {
    state.pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    update();
  }).observe(hero);

  const blockers = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) state.blocked.add(entry.target);
      else state.blocked.delete(entry.target);
    });
    update();
  });
  [inquiry, footer].forEach((el) => el && blockers.observe(el));
}
