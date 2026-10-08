import { Component, ElementRef, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { animate, utils } from 'animejs';
import { Subscription } from 'rxjs';
import { DATA_ENVIRONMENT, NAV_ITEMS, ROUTES } from '../../data-environment';
import { prefersReducedMotion } from '../../services/anime.helpers';
import { TranslationService } from '../../services/translation.service';
import { BackButtonComponent } from '../back-button/back-button.component';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent, BackButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  @ViewChild('drawer', { static: true }) drawer!: ElementRef<HTMLDivElement>;

  readonly navItems = NAV_ITEMS;
  readonly langSwitch = DATA_ENVIRONMENT.ui.langToEn;
  readonly translator = inject(TranslationService);
  readonly menuOpen = signal(false);

  private readonly router = inject(Router);
  private readonly subscription: Subscription;
  private readonly currentUrl = signal(this.router.url);

  /** Destino del botón "volver": al mapa desde cualquier página, a inicio desde el mapa. */
  readonly backRoute = computed(() =>
    this.currentUrl() === ROUTES.map ? ROUTES.home : ROUTES.map,
  );

  readonly backLabel = computed(() =>
    this.currentUrl() === ROUTES.map
      ? DATA_ENVIRONMENT.ui.home
      : DATA_ENVIRONMENT.ui.navBack,
  );

  constructor() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
        this.closeMenu();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /** El menú se despliega al pasar el ratón y se pliega al salir: solo encima, nunca empuja. */
  openMenu(): void {
    if (this.menuOpen()) return;
    this.menuOpen.set(true);
    this.animateDrawer(true);
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.animateDrawer(false);
  }

  toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    const next = event.relatedTarget as Node | null;
    if (!next || !host.contains(next)) {
      this.closeMenu();
    }
  }

  private animateDrawer(open: boolean): void {
    const drawer = this.drawer.nativeElement;

    if (prefersReducedMotion()) {
      utils.set(drawer, { opacity: open ? 1 : 0, y: open ? 0 : -14 });
      return;
    }

    animate(drawer, {
      opacity: { to: open ? 1 : 0 },
      y: { to: open ? 0 : -14 },
      duration: 380,
      ease: 'outCubic',
      overwrite: true,
    });
  }
}
