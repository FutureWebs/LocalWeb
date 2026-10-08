import { Injectable, computed, signal } from '@angular/core';
import { DATA_ENVIRONMENT, L10n, Lang } from '../data-environment';

/**
 * Traducción profunda: recorre data-environment y sustituye cada
 * pareja { es, en } por el string del idioma activo (fallback: es).
 */
export type Localized<T> = T extends { es: string; en: string }
  ? string
  : T extends (infer U)[]
    ? Localized<U>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

export function localize<T>(node: T, lang: Lang): Localized<T> {
  if (typeof node !== 'object' || node === null) {
    return node as Localized<T>;
  }

  if (Array.isArray(node)) {
    return node.map((item) => localize(item, lang)) as unknown as Localized<T>;
  }

  const record = node as Record<string, unknown>;
  const es = record['es'];
  const en = record['en'];

  if (typeof es === 'string' && typeof en === 'string') {
    return (lang === 'en' && typeof en === 'string' ? en : es) as Localized<T>;
  }

  const out: Record<string, unknown> = {};
  for (const key of Object.keys(record)) {
    out[key] = localize(record[key], lang);
  }
  return out as Localized<T>;
}

const STORAGE_KEY = 'preferred_language';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly lang = signal<Lang>(TranslationService.detectLanguage());

  /** Todo el data-environment ya resuelto al idioma activo. */
  readonly data = computed(() => localize(DATA_ENVIRONMENT, this.lang()));

  constructor() {
    document.documentElement.setAttribute('lang', this.lang());
  }

  private static detectLanguage(): Lang {
    if (typeof localStorage === 'undefined') return 'es';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es') return saved;
    return (navigator.language ?? '').toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
  }

  toggleLang(): void {
    this.setLang(this.lang() === 'es' ? 'en' : 'es');
  }

  pick(text: L10n): string {
    return text[this.lang()] ?? text.es;
  }

  /** Resuelve cualquier subárbol del data-environment al idioma activo. */
  localize<T>(node: T): Localized<T> {
    return localize(node, this.lang());
  }
}
