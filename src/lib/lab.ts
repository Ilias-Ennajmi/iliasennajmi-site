/**
 * Shared plumbing for the Lab experiments (/lab/) and the anchoring widget
 * in the pricing essay.
 *
 * Results live in this browser only (localStorage), never anywhere else:
 * the Lab promises the reader that, and the case file at the bottom of the
 * page reads them back. `got` is true when the trick worked on the reader,
 * false when they held out, and null when their version of the experiment
 * was the control group (nothing to fall for).
 */
export type LabId = 'anchor' | 'decoy' | 'framing' | 'loss' | 'defaults' | 'free';
export type LabResult = { got: boolean | null; note: string; at: number };
export type LabResults = Partial<Record<LabId, LabResult>>;

export const LAB_ORDER: Array<{ id: LabId; name: string }> = [
  { id: 'anchor', name: 'Anchoring' },
  { id: 'decoy', name: 'The decoy' },
  { id: 'framing', name: 'Framing' },
  { id: 'loss', name: 'Loss aversion' },
  { id: 'defaults', name: 'Defaults' },
  { id: 'free', name: 'The pull of free' },
];

const KEY = 'lab-results';

export function readResults(): LabResults {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

export function record(id: LabId, got: boolean | null, note: string) {
  const all = readResults();
  all[id] = { got, note, at: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* private mode: the page still works */ }
  document.dispatchEvent(new CustomEvent('lab:result', { detail: { id, got, note } }));
  const t = (window as unknown as { track?: (n: string, p?: Record<string, string>) => void }).track;
  if (typeof t === 'function') t('lab-result', { id, got: got === null ? 'control' : String(got) });
}

export function clearResults() {
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ }
  document.dispatchEvent(new CustomEvent('lab:result', { detail: { id: null } }));
}

export const life = () => (window as unknown as { __life?: { onLeave: (fn: () => void) => void } }).__life;

export const motionOK = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Euro amounts with thousands separators, without touching Intl (see InteractiveAnchor). */
export const euros = (n: number) => '€' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Small helper for experiments built as a sequence of `[data-step]` panels. */
export function stepper(root: HTMLElement) {
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  return (n: number | string, focus = true) => {
    steps.forEach((s) => { s.hidden = s.dataset.step !== String(n); });
    if (!focus) return;
    const shown = steps.find((s) => !s.hidden);
    const target = shown?.querySelector<HTMLElement>('[data-autofocus]') ?? shown;
    if (target) {
      if (!target.hasAttribute('tabindex') && target === shown) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  };
}

/** Listener bookkeeping so every experiment can tear itself down on navigation. */
export function listeners() {
  const offs: Array<() => void> = [];
  return {
    on<K extends keyof HTMLElementEventMap>(el: Element | Document | Window, type: K | string, fn: (e: any) => void, opts?: AddEventListenerOptions) {
      el.addEventListener(type, fn as EventListener, opts);
      offs.push(() => el.removeEventListener(type, fn as EventListener, opts));
    },
    add(off: () => void) { offs.push(off); },
    off() { offs.splice(0).forEach((f) => f()); },
  };
}
