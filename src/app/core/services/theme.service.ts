import {Injectable, signal, inject, Inject, PLATFORM_ID} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {isPlatformBrowser} from '@angular/common';

export type Language = 'en' | 'es';
export type GravityState = 'normal' | 'unstable' | 'absorbing' | 'void';
export type AppView = 'main' | 'projects'; //
export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private translate = inject(TranslateService);
  private readonly langKey = 'preferred_language';
  private readonly themeKey = 'app-theme';

  // Usamos Signals en lugar de BehaviorSubject (estándar de Angular 18+)
  public currentLanguage = signal<Language>('es');
  public gravityState = signal<GravityState>('normal');
  public currentView = signal<AppView>('main');
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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

  setTheme(theme: Theme, options?: { animate?: boolean; event?: MouseEvent }) {
    if (!isPlatformBrowser(this.platformId)) return;

    const animate = options?.animate ?? true;
    const event = options?.event;

    if (this.current === theme && animate) return;

    // Si no se requiere animación o el navegador no la soporta
    if (!animate || !(document as any).startViewTransition) {
      this.applyThemeDOM(theme);
      return;
    }

    // 1. Obtener las coordenadas del clic. Si no hay evento, usamos el centro de la pantalla.
    const x = (event?.clientX && event.clientX > 0) ? event.clientX : window.innerWidth / 2;
    const y = (event?.clientY && event.clientY > 0) ? event.clientY : window.innerHeight / 2;

    // 2. Calcular la distancia desde el clic hasta la esquina más lejana de la pantalla (Radio final)
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 3. Iniciar la transición de vista
    const transition = (document as any).startViewTransition(() => {
      this.applyThemeDOM(theme);
    });

    // 4. Cuando la transición esté lista, animamos el pseudo-elemento "new" (el nuevo tema)
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          // Definimos el camino del clip-path: de un círculo de 0px a uno que cubre la pantalla
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ],
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          // Animamos la capa nueva para que se expanda sobre la vieja
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }

  private applyThemeDOM(theme: Theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(this.themeKey, theme);
  }

  loadTheme() {
    if (!isPlatformBrowser(this.platformId)) return;
    const theme = (localStorage.getItem(this.themeKey) as Theme) || 'light';
    this.setTheme(theme, { animate: false });
  }

  get current(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'light';
    return (localStorage.getItem(this.themeKey) as Theme) || 'light';
  }


}
