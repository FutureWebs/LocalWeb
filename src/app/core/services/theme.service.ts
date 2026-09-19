import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'es';
export type GravityState = 'normal' | 'unstable' | 'absorbing' | 'void';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private translate = inject(TranslateService);
  private readonly langKey = 'preferred_language';

  // Usamos Signals en lugar de BehaviorSubject (estándar de Angular 18+)
  public currentLanguage = signal<Language>('es');
  public gravityState = signal<GravityState>('normal');

  constructor() {
    this.translate.addLangs(['es', 'en']);
    this.initializeLanguage();
  }

  /**
   * Inicializa el idioma evaluando localStorage o el navegador
   */
  private initializeLanguage(): void {
    const saved = localStorage.getItem(this.langKey);
    let lang: Language = 'es';

    if (saved === 'en' || saved === 'es') {
      lang = saved;
    } else {
      // Detecta el idioma del navegador
      const browser = (navigator.language ?? '').toLowerCase();
      lang = browser.startsWith('en') ? 'en' : 'es';
    }

    // SetLanguage se encarga de actualizar el Signal, el DOM y Translate
    this.setLanguage(lang);
  }

  // --- LÓGICA DE IDIOMAS ---

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    localStorage.setItem(this.langKey, lang);
    document.documentElement.setAttribute('lang', lang);

    // En v18, .use() devuelve un observable. Es buena práctica suscribirse.
    this.translate.use(lang).subscribe();
  }

  // --- LÓGICA DEL AGUJERO NEGRO (GRAVEDAD) ---

  setUnstableGravity(): void {
    this.gravityState.set('unstable');
  }

  triggerBlackHoleAbsorption(): void {
    this.gravityState.set('absorbing');

    // Simula el paso al "vacío" de tranquilidad después de 3 segundos
    setTimeout(() => {
      this.gravityState.set('void');
    }, 3000);
  }

  resetGravity(): void {
    this.gravityState.set('normal');
  }
}
