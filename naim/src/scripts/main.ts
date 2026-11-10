const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('js');

/* ───────── Dust: slow specks drifting like in a projector beam ───────── */
const dust = $<HTMLCanvasElement>('[data-dust]');
if (dust && !reduced) {
  const c = dust.getContext('2d')!;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };
  let ps: P[] = [];
  const resize = () => {
    W = innerWidth; H = innerHeight;
    dust.width = W * dpr; dust.height = H * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(44, (W * H) / 28000));
    ps = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() < 0.85 ? Math.random() * 0.9 + 0.3 : Math.random() * 1.6 + 1,
      vx: (Math.random() - 0.5) * 0.08, vy: -(Math.random() * 0.12 + 0.02),
      a: Math.random() * 0.32 + 0.1, tw: Math.random() * Math.PI * 2,
    }));
  };
  resize();
  addEventListener('resize', resize);
  let sy = scrollY, push = 0;
  addEventListener('scroll', () => { push += (scrollY - sy) * 0.02; sy = scrollY; }, { passive: true });
  const loop = (t: number) => {
    c.clearRect(0, 0, W, H);
    push *= 0.92;
    for (const p of ps) {
      p.x += p.vx + Math.sin(t / 4000 + p.tw) * 0.05;
      p.y += p.vy - push;
      if (p.y < -5) p.y = H + 5; if (p.y > H + 5) p.y = -5;
      if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5;
      c.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(t / 900 + p.tw));
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill();
    }
    if (!document.hidden) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(loop); });
}

/* ───────── Nav: solid after hero, hides on scroll down. Floating book button ───────── */
const nav = $('[data-nav]');
const fab = $('[data-fab]');
const booking = $('#booking');
let lastY = scrollY;
let bookingVisible = false;
const onScroll = () => {
  const y = scrollY;
  const pastHero = y > innerHeight * 0.6;
  nav?.classList.toggle('is-solid', y > 40);
  nav?.classList.toggle('is-hidden', pastHero && y > lastY + 4);
  if (y < lastY - 4) nav?.classList.remove('is-hidden');
  fab?.classList.toggle('is-on', pastHero && !bookingVisible);
  lastY = y;
};
addEventListener('scroll', onScroll, { passive: true });
if (booking) new IntersectionObserver(([e]) => { bookingVisible = e.isIntersecting; onScroll(); }).observe(booking);

/* ───────── Reveal on scroll (+ stagger) ───────── */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    const s = e.target.querySelector('[data-scramble]');
    if (s) scramble(s as HTMLElement);
    io.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach((el) => {
  const siblings = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [];
  const i = siblings.indexOf(el);
  if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 0.08}s`);
  io.observe(el);
});

/* ───────── Name scramble ───────── */
function scramble(el: HTMLElement) {
  const final = el.dataset.scramble || el.textContent || '';
  if (reduced) return;
  const glyphs = 'NΛIMVAXK';
  let frame = 0;
  const total = 26;
  const tick = () => {
    el.textContent = [...final].map((c, i) => (frame / total > i / final.length + 0.15 ? c : glyphs[(Math.random() * glyphs.length) | 0])).join('');
    if (frame++ < total) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  tick();
}

/* ───────── Carousel ───────── */
const car = $<HTMLElement>('[data-carousel]');
if (car) {
  const slides = $$('.slide', car);
  const idx = $('[data-carousel-index]');
  const bar = $('[data-carousel-bar]');
  const step = () => (slides[1]?.offsetLeft ?? 0) - (slides[0]?.offsetLeft ?? 0) || car.clientWidth;
  const update = () => {
    const max = car.scrollWidth - car.clientWidth;
    const p = max > 0 ? car.scrollLeft / max : 0;
    bar?.style.setProperty('--p', String(Math.max(0.08, p)));
    const i = Math.round(car.scrollLeft / step());
    if (idx) idx.textContent = String(Math.min(slides.length, i + 1)).padStart(2, '0');
  };
  car.addEventListener('scroll', update, { passive: true });
  update();
  $('[data-carousel-prev]')?.addEventListener('click', () => car.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('[data-carousel-next]')?.addEventListener('click', () => car.scrollBy({ left: step(), behavior: 'smooth' }));
  car.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') car.scrollBy({ left: step(), behavior: 'smooth' });
    if (e.key === 'ArrowLeft') car.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  // Mouse drag (touch uses native scrolling)
  let down = false, startX = 0, startL = 0, moved = false;
  car.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = false; startX = e.clientX; startL = car.scrollLeft;
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) { moved = true; car.classList.add('is-dragging'); }
    car.scrollLeft = startL - dx;
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    car.classList.remove('is-dragging');
    if (moved) {
      const i = Math.round(car.scrollLeft / step());
      car.scrollTo({ left: i * step(), behavior: 'smooth' });
    }
  });
}

/* ───────── Booking form → prefilled email ───────── */
const form = $<HTMLFormElement>('[data-booking-form]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const to = $<HTMLAnchorElement>('.booking__mail')?.textContent?.trim() || '';
  const subject = `Booking request: ${d.get('type')}, ${d.get('venue') || 'city TBC'}, ${d.get('date') || 'date TBC'}`;
  const body = [
    `Name: ${d.get('name')}`, `Email: ${d.get('email')}`, `Type: ${d.get('type')}`,
    `Date: ${d.get('date') || 'TBC'}`, `City / venue: ${d.get('venue') || 'TBC'}`, '', String(d.get('message') || ''),
  ].join('\n');
  location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

/* ───────── Video player with playlist ───────── */
const player = $('[data-player]');
if (player) {
  const screen = $('[data-player-screen]', player)!;
  const poster = $('[data-player-play]', player)!;
  const tTitle = $('[data-player-title]', player)!;
  const tPlace = $('[data-player-place]', player)!;
  const tracks = $$<HTMLButtonElement>('.track', player);
  let current = tracks[0];
  const clear = () => $$('iframe, video, .player__soon', screen).forEach((n) => n.remove());
  const load = (btn: HTMLButtonElement) => {
    clear();
    poster.hidden = true;
    const { yt, mp4 } = btn.dataset;
    if (yt) {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`;
      f.title = btn.dataset.title || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      screen.append(f);
    } else if (mp4) {
      const v = document.createElement('video');
      v.src = mp4; v.controls = true; v.autoplay = true; v.playsInline = true;
      screen.append(v);
    } else {
      poster.hidden = false;
      const s = document.createElement('div');
      s.className = 'player__soon';
      s.innerHTML = `<b style="font-size:1.4rem;font-stretch:125%;font-weight:900;text-transform:uppercase">Dropping soon</b><span class="mono" style="font-size:.75rem">This set is being edited. Check back shortly.</span>`;
      screen.append(s);
    }
  };
  const select = (btn: HTMLButtonElement, play: boolean) => {
    current = btn;
    tracks.forEach((t) => t.classList.toggle('is-active', t === btn));
    tTitle.textContent = btn.dataset.title || '';
    tPlace.textContent = btn.dataset.place || '';
    poster.setAttribute('aria-label', `Play ${btn.dataset.title}`);
    if (play) load(btn);
    else { clear(); poster.hidden = false; }
  };
  poster.addEventListener('click', () => load(current));
  tracks.forEach((t) => t.addEventListener('click', () => {
    select(t, true);
    if (innerWidth < 960) screen.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  }));
}

/* ───────── Press kit: password → decrypt link (AES-GCM / PBKDF2) ───────── */
const dlg = $<HTMLDialogElement>('[data-press-modal]');
const pkForm = $<HTMLFormElement>('[data-press-form]');
const pkMsg = $('[data-press-msg]');
$('[data-press-open]')?.addEventListener('click', () => {
  if (pkMsg) pkMsg.textContent = '';
  dlg?.showModal();
  setTimeout(() => $<HTMLInputElement>('#pk-pass')?.focus(), 50);
});
dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
pkForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = $<HTMLInputElement>('#pk-pass', pkForm)!;
  const btn = $<HTMLButtonElement>('button', pkForm)!;
  const data = JSON.parse($('#presskit-data')?.textContent || '{}');
  btn.disabled = true;
  if (pkMsg) pkMsg.textContent = 'Checking…';
  try {
    const url = await decrypt(data, input.value);
    if (!pkMsg) return;
    if (/^(https?:)?\//.test(url)) {
      pkMsg.innerHTML = `Unlocked. <a href="${encodeURI(url)}" target="_blank" rel="noopener">open the press kit</a>`;
      window.open(url, '_blank', 'noopener');
    } else {
      pkMsg.textContent = 'Unlocked. The press kit is being updated, back very soon.';
    }
  } catch {
    if (pkMsg) pkMsg.textContent = 'Wrong password. Try again.';
    dlg?.classList.remove('is-wrong'); void dlg?.offsetWidth; dlg?.classList.add('is-wrong');
    input.select();
  } finally {
    btn.disabled = false;
  }
});
async function decrypt(d: { salt: string; iv: string; data: string; iterations: number }, password: string) {
  const b = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: b(d.salt), iterations: d.iterations, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
  );
  const out = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b(d.iv) }, key, b(d.data));
  return new TextDecoder().decode(out);
}

/* ───────── Audio engine: synthesized drums for The Booth + the single's preview loop ───────── */
type Voice = 'kick' | 'clap' | 'hat' | 'tek' | 'bass';
let ctx: AudioContext | null = null;
let master: GainNode;
let noise: AudioBuffer;
const audio = () => {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.8;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const ch = noise.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};
const bassNotes = [55, 55, 65.41, 55, 49, 55, 73.42, 65.41]; // A minor-ish walk
function hit(v: Voice, t: number, step = 0) {
  const c = ctx!;
  const g = c.createGain();
  g.connect(master);
  if (v === 'kick') {
    const o = c.createOscillator();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    o.connect(g); o.start(t); o.stop(t + 0.5);
  } else if (v === 'bass') {
    const o = c.createOscillator();
    const f = c.createBiquadFilter();
    o.type = 'sawtooth';
    o.frequency.value = bassNotes[Math.floor(step / 2) % bassNotes.length];
    f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(140, t + 0.2); f.Q.value = 6;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(f).connect(g); o.start(t); o.stop(t + 0.3);
  } else if (v === 'tek') {
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(step % 4 === 2 ? 420 : 300, t);
    o.frequency.exponentialRampToValueAtTime(190, t + 0.08);
    g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g); o.start(t); o.stop(t + 0.2);
  } else {
    const s = c.createBufferSource();
    s.buffer = noise;
    const f = c.createBiquadFilter();
    if (v === 'hat') {
      f.type = 'highpass'; f.frequency.value = 7500;
      g.gain.setValueAtTime(step % 2 ? 0.18 : 0.28, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    } else {
      f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 0.8;
      g.gain.setValueAtTime(0.0001, t);
      [0, 0.012, 0.024].forEach((d) => { g.gain.setValueAtTime(0.7, t + d); g.gain.exponentialRampToValueAtTime(0.1, t + d + 0.01); });
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    }
    s.connect(f).connect(g); s.start(t); s.stop(t + 0.25);
  }
}

type Pattern = Record<Voice, boolean[]>;
const VOICES: { v: Voice; icon: string; label: string }[] = [
  { v: 'kick', icon: 'globe', label: 'Kick' },
  { v: 'clap', icon: 'crowd', label: 'Clap' },
  { v: 'hat', icon: 'sun', label: 'Hi-hat' },
  { v: 'tek', icon: 'boombox', label: 'Darbuka' },
  { v: 'bass', icon: 'moon', label: 'Bass' },
];
const fromStr = (s: string) => [...s].map((c) => c === 'x');
const PRESET: Pattern = {
  kick: fromStr('x...x...x...x...'),
  clap: fromStr('....x.......x...'),
  hat:  fromStr('..x...x...x...xx'),
  tek:  fromStr('x..x..x...x.x...'),
  bass: fromStr('..x..x.x..x..xx.'),
};

class Transport {
  bpm = 124; step = 0; next = 0; timer = 0; playing = false;
  constructor(public pattern: () => Pattern, public onStep: (s: number, voices: Voice[]) => void) {}
  start() {
    const c = audio();
    Transport.current?.stop();
    Transport.current = this;
    this.playing = true; this.step = 0; this.next = c.currentTime + 0.06;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }
  stop() {
    this.playing = false;
    clearInterval(this.timer);
    if (Transport.current === this) Transport.current = null;
    this.onStop?.();
  }
  onStop?: () => void;
  schedule() {
    const c = ctx!;
    while (this.next < c.currentTime + 0.1) {
      const p = this.pattern();
      const s = this.step;
      const on = VOICES.map((x) => x.v).filter((v) => p[v][s]);
      // a little swing on the off-16ths
      const t = this.next + (s % 2 ? (60 / this.bpm / 4) * 0.08 : 0);
      on.forEach((v) => hit(v, t, s));
      const delay = Math.max(0, (t - c.currentTime) * 1000);
      setTimeout(() => this.playing && this.onStep(s, on), delay);
      this.next += 60 / this.bpm / 4;
      this.step = (s + 1) % 16;
    }
  }
  static current: Transport | null = null;
}

/* The Booth — step sequencer */
const seq = $('[data-seq]');
if (seq) {
  const grid = $('[data-seq-grid]', seq)!;
  const playBtn = $<HTMLButtonElement>('[data-seq-play]', seq)!;
  const label = $('[data-seq-label]', seq)!;
  const bpm = $<HTMLInputElement>('[data-seq-bpm]', seq)!;
  const bpmOut = $('[data-seq-bpm-out]', seq)!;
  const pattern: Pattern = JSON.parse(JSON.stringify(PRESET));
  const cells: Record<string, HTMLButtonElement[]> = {};
  const icons: Record<string, HTMLElement> = {};

  for (const { v, icon, label: l } of VOICES) {
    const row = document.createElement('div');
    row.className = 'seq__row';
    row.setAttribute('role', 'row');
    const ic = document.createElement('button');
    ic.className = 'seq__icon';
    ic.innerHTML = `<img src="/img/icons/${icon}.png" alt="" width="54" height="54">`;
    ic.setAttribute('aria-label', `Play ${l}`);
    ic.addEventListener('click', () => { audio(); hit(v, ctx!.currentTime, 0); flash(ic); });
    icons[v] = ic;
    row.append(ic);
    cells[v] = [];
    for (let s = 0; s < 16; s++) {
      const b = document.createElement('button');
      b.className = 'step';
      b.setAttribute('aria-label', `${l} step ${s + 1}`);
      b.setAttribute('aria-pressed', String(pattern[v][s]));
      b.addEventListener('click', () => {
        pattern[v][s] = !pattern[v][s];
        b.setAttribute('aria-pressed', String(pattern[v][s]));
        if (pattern[v][s] && !transport.playing) { audio(); hit(v, ctx!.currentTime, s); }
      });
      cells[v].push(b);
      row.append(b);
    }
    grid.append(row);
  }
  const flash = (el: HTMLElement) => { el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 90); };
  const sync = () => VOICES.forEach(({ v }) => cells[v].forEach((b, s) => b.setAttribute('aria-pressed', String(pattern[v][s]))));
  let prev = -1;
  const transport = new Transport(() => pattern, (s, on) => {
    if (prev >= 0) VOICES.forEach(({ v }) => cells[v][prev].classList.remove('is-now'));
    VOICES.forEach(({ v }) => cells[v][s].classList.add('is-now'));
    on.forEach((v) => flash(icons[v]));
    prev = s;
  });
  transport.onStop = () => {
    playBtn.setAttribute('aria-pressed', 'false'); label.textContent = 'Play';
    const e = playBtn.querySelector('.b__e'); if (e) e.textContent = '▶';
    if (prev >= 0) VOICES.forEach(({ v }) => cells[v][prev].classList.remove('is-now'));
    prev = -1;
  };
  playBtn.addEventListener('click', () => {
    if (transport.playing) return transport.stop();
    transport.bpm = +bpm.value;
    transport.start();
    playBtn.setAttribute('aria-pressed', 'true'); label.textContent = 'Stop';
    const e = playBtn.querySelector('.b__e'); if (e) e.textContent = '■';
  });
  bpm.addEventListener('input', () => { transport.bpm = +bpm.value; bpmOut.textContent = bpm.value; });
  $('[data-seq-clear]', seq)?.addEventListener('click', () => { VOICES.forEach(({ v }) => pattern[v].fill(false)); sync(); });
  $('[data-seq-random]', seq)?.addEventListener('click', () => {
    // Keep a four-on-the-floor spine, randomise the rest with taste
    const r = (p: number) => Math.random() < p;
    pattern.kick = fromStr('x...x...x...x...').map((x, i) => x || (i === 14 && r(0.3)));
    pattern.clap = Array.from({ length: 16 }, (_, i) => i === 4 || i === 12 || (i === 15 && r(0.25)));
    pattern.hat = Array.from({ length: 16 }, (_, i) => i % 4 === 2 || r(0.25));
    pattern.tek = Array.from({ length: 16 }, (_, i) => (i % 3 === 0 && r(0.7)) || r(0.12));
    pattern.bass = Array.from({ length: 16 }, (_, i) => i % 4 !== 0 && r(0.45));
    sync();
  });
}

/* Single preview — a little synthesized teaser loop + animated waveform */
const mini = $('[data-mini]');
if (mini) {
  const btn = $<HTMLButtonElement>('[data-mini-play]', mini)!;
  const bars = $$('.wave i', mini);
  const section = mini.closest('.release');
  const t = new Transport(() => PRESET, (s) => {
    const n = Math.floor(((loops * 16 + s) / 64) * bars.length) % bars.length;
    bars.forEach((b, i) => b.classList.toggle('on', i <= n));
    if (s === 15) loops = (loops + 1) % 4;
  });
  let loops = 0;
  const PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const PAUSE = '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  t.onStop = () => { btn.innerHTML = PLAY; section?.classList.remove('is-playing'); mini.classList.remove('is-playing'); };
  btn.addEventListener('click', () => {
    if (t.playing) return t.stop();
    loops = 0; t.bpm = 124; t.start();
    btn.innerHTML = PAUSE; section?.classList.add('is-playing'); mini.classList.add('is-playing');
  });
}

// Stop audio when the tab is hidden
document.addEventListener('visibilitychange', () => { if (document.hidden) Transport.current?.stop(); });
