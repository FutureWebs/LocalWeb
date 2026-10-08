import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StarFieldComponent } from './components/star-field/star-field.component';
import { WarpOverlayComponent } from './components/warp-overlay/warp-overlay.component';
import { ROUTES } from './data-environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StarFieldComponent, WarpOverlayComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly subscription: Subscription;

  private readonly currentUrl = signal<string>(this.router.url);

  /** En la landing no hay navbar: es un viaje inmersivo. */
  readonly isLanding = computed(() => this.currentUrl() === ROUTES.home);

  constructor() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
