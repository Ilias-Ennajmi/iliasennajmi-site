const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── Toast ───────── */
const toast = (() => {
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  document.body.append(el);
  let t = 0;
  return (msg: string) => {
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(t);
    t = window.setTimeout(() => el.classList.remove('is-on'), 2200);
  };
})();

/* ───────── Mobile menu ───────── */
const menu = $('[data-menu]');
const menuOpen = $<HTMLButtonElement>('[data-menu-open]');
if (menu && menuOpen) {
  $$('.menu__list li', menu).forEach((li, i) => li.querySelector('a')?.style.setProperty('--i', String(i)));
  const open = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    menuOpen.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    $<HTMLElement>('[data-menu-close]', menu)?.focus();
  };
  const close = (focusBack = true) => {
    menu.classList.remove('is-open');
    menuOpen.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    setTimeout(() => { menu.hidden = true; }, reduced ? 0 : 600);
    if (focusBack) menuOpen.focus();
  };
  menuOpen.addEventListener('click', open);
  $('[data-menu-close]', menu)?.addEventListener('click', () => close());
  $$('[data-menu-link]', menu).forEach((a) => a.addEventListener('click', () => close(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) close(); });
}

/* ───────── Nav: highlight the section you're in ───────── */
const navLinks = $$<HTMLAnchorElement>('.nav__links a');
const spyTargets = navLinks.map((a) => $(a.hash)).filter(Boolean) as HTMLElement[];
if (spyTargets.length) {
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      navLinks.forEach((a) => a.classList.toggle('is-current', a.hash === `#${e.target.id}`));
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  spyTargets.forEach((t) => spy.observe(t));
}

/* ───────── Copy booking email ───────── */
$$<HTMLButtonElement>('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(b.dataset.copy || '');
    toast('Email copied');
  } catch {
    toast(b.dataset.copy || '');
  }
}));

/* ───────── The phone rings once when booking comes into view ───────── */
const ringer = $('[data-ring]');
if (ringer && !reduced) {
  const ring = () => {
    ringer.classList.remove('is-ringing');
    void (ringer as HTMLElement).offsetWidth;
    ringer.classList.add('is-ringing');
  };
  new IntersectionObserver(([e], o) => {
    if (e.isIntersecting) { setTimeout(ring, 400); o.disconnect(); }
  }, { threshold: 0.5 }).observe(ringer);
  $('.booking__title', ringer)?.addEventListener('mouseenter', ring);
}

/* ───────── Dates: filter by type ───────── */
const filters = $$<HTMLButtonElement>('[data-filter]');
filters.forEach((f) => f.addEventListener('click', () => {
  const t = f.dataset.filter;
  filters.forEach((x) => {
    const on = x === f;
    x.classList.toggle('is-on', on);
    x.setAttribute('aria-pressed', String(on));
  });
  $$('.gig').forEach((g) => {
    const show = t === 'all' || g.dataset.type === t;
    g.classList.toggle('is-out', !show);
    g.classList.toggle('is-in-filter', show);
    if (show) g.classList.add('is-in');
  });
}));

/* ───────── Dates: add to calendar (.ics, all-day event) ───────── */
$$<HTMLButtonElement>('[data-ics]').forEach((b) => b.addEventListener('click', () => {
  const g = b.closest<HTMLElement>('.gig');
  if (!g) return;
  const day = (g.dataset.date || '').replace(/-/g, '');
  const next = new Date(`${g.dataset.date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const end = next.toISOString().slice(0, 10).replace(/-/g, '');
  const esc = (s = '') => s.replace(/[,;\\]/g, (m) => `\\${m}`);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NAIM//Dates//EN', 'BEGIN:VEVENT',
    `UID:${day}-${Math.random().toString(36).slice(2)}@naim`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${esc(g.dataset.title)}`, `LOCATION:${esc(g.dataset.place)}`,
    `URL:${location.origin}/#dates`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = `naim-${g.dataset.date}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('Saved. Open it to add to your calendar');
}));

/* ───────── Reels: vertical clips, loaded only on tap, one at a time ───────── */
const reels = $('[data-reels]');
if (reels) {
  const stopAll = (except?: HTMLElement) => {
    $$<HTMLElement>('.reel.is-playing', reels).forEach((r) => {
      if (r === except) return;
      r.querySelector('iframe, video')?.remove();
      r.classList.remove('is-playing');
    });
  };
  $$<HTMLElement>('.reel', reels).forEach((r) => {
    $('[data-reel-play]', r)?.addEventListener('click', () => {
      stopAll(r);
      const { yt, mp4, title } = r.dataset;
      if (yt) {
        const f = document.createElement('iframe');
        f.src = `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${yt}`;
        f.title = title || 'Clip';
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        r.append(f);
        r.classList.add('is-playing');
      } else if (mp4) {
        const v = document.createElement('video');
        v.src = mp4; v.autoplay = true; v.controls = true; v.playsInline = true; v.loop = true; v.preload = 'none';
        r.append(v);
        r.classList.add('is-playing');
      } else {
        toast('This clip drops soon');
      }
    });
  });
  // Pause what scrolls out of view
  const vis = new IntersectionObserver((entries) => {
    for (const e of entries) if (!e.isIntersecting && e.target.classList.contains('is-playing')) stopAll();
  }, { threshold: 0.2 });
  $$('.reel', reels).forEach((r) => vis.observe(r));
  const step = () => ($('.reel', reels)?.getBoundingClientRect().width || 240) + 16;
  $('[data-reels-prev]')?.addEventListener('click', () => reels.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
  $('[data-reels-next]')?.addEventListener('click', () => reels.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
}
