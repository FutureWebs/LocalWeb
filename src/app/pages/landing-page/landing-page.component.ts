import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject } from '@angular/core';
import { animate } from 'animejs';
import { ButtonComponent } from '../../components/button/button.component';
import { LabelComponent } from '../../components/label/label.component';
import { LogoComponent } from '../../components/logo/logo.component';
import { DATA_ENVIRONMENT, ROUTES } from '../../data-environment';
import { playEntrance, prefersReducedMotion } from '../../services/anime.helpers';
import { TranslationService } from '../../services/translation.service';
import { WarpService } from '../../services/warp.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LogoComponent, LabelComponent, ButtonComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  @ViewChild('brand', { static: true }) brand!: ElementRef<HTMLElement>;

  readonly translator = inject(TranslationService);
  private readonly warp = inject(WarpService);

  readonly ui = DATA_ENVIRONMENT.ui;
  readonly content = computed(() => this.translator.localize(DATA_ENVIRONMENT.landing));

  private cleanup: () => void = () => undefined;
  private floatAnimation: { revert: () => unknown } | null = null;
  private floatTimer: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    this.cleanup = playEntrance(this.root.nativeElement);

    // Arranca el flotado cuando la entrada ya terminó (evita choques de tweens).
    this.floatTimer = setTimeout(() => this.startFloat(), 1600);
  }

  /** El logo respira en órbita mientras el usuario decide viajar. */
  private startFloat(): void {
    if (prefersReducedMotion()) return;

    this.floatAnimation = animate(this.brand.nativeElement, {
      y: { from: -14, to: 6 },
      duration: 3600,
      loop: true,
      alternate: true,
      ease: 'inOutSine',
      autoplay: true,
    });
  }

  async startJourney(): Promise<void> {
    if (this.warp.isTravelling) return;
    await this.warp.travel(ROUTES.map, 'forward');
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.floatAnimation?.revert();
    if (this.floatTimer) {
      clearTimeout(this.floatTimer);
    }
  }
}
