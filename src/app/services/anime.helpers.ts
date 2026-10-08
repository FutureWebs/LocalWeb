import { animate, onScroll, utils } from 'animejs';

/** Utilidades compartidas de animación con Anime.js v4. */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Revela todos los `[data-reveal]` del árbol:
 * - si ya están en pantalla, los anima de inmediato (entrada escalonada con
 *   `data-reveal-delay`);
 * - si están fuera, se revelan automáticamente al entrar en viewport (onScroll).
 * Devuelve una función de limpieza para invocar en ngOnDestroy.
 */
export function initReveals(root: HTMLElement | null | undefined): () => void {
  if (!root) return () => undefined;

  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!targets.length) return () => undefined;

  if (prefersReducedMotion()) {
    utils.set(targets, { opacity: 1, y: 0 });
    return () => undefined;
  }

  const controllers: Array<{ revert: () => unknown }> = [];

  targets.forEach((element) => {
    const delay = Number(element.dataset['revealDelay'] ?? 0);
    const rect = element.getBoundingClientRect();
    const visible = rect.top <= window.innerHeight;

    const animation = animate(element, {
      opacity: { from: 0, to: 1 },
      y: { from: 26, to: 0 },
      duration: 720,
      delay,
      ease: 'outCubic',
      autoplay: visible ? true : onScroll({ target: element, enter: 'bottom-=70 top' }),
    });

    controllers.push(animation);
  });

  return () => controllers.forEach((controller) => controller.revert());
}

/** Entrada inmediata escalonada de los elementos `[data-in]` del árbol. */
export function playEntrance(
  root: HTMLElement | null | undefined,
  selector = '[data-in]',
): () => void {
  if (!root) return () => undefined;

  const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
  if (!targets.length) return () => undefined;

  if (prefersReducedMotion()) {
    utils.set(targets, { opacity: 1, y: 0 });
    return () => undefined;
  }

  const animation = animate(targets, {
    opacity: { from: 0, to: 1 },
    y: { from: 34, to: 0 },
    duration: 820,
    delay: (_el, index) => (index ?? 0) * 110,
    ease: 'outCubic',
    autoplay: true,
  });

  return () => animation.revert();
}
