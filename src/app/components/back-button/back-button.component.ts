import { Component, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { animate } from 'animejs';
import { DATA_ENVIRONMENT, ROUTES } from '../../data-environment';
import { prefersReducedMotion } from '../../services/anime.helpers';
import { TranslationService } from '../../services/translation.service';
import { WarpService } from '../../services/warp.service';

@Component({
  selector: 'app-back-button',
  standalone: true,
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent {
  @ViewChild('arrow', { static: true }) arrow!: ElementRef<HTMLElement>;

  @Input() route: string = ROUTES.map;
  @Input() label = DATA_ENVIRONMENT.ui.backToMap;

  private readonly warp = inject(WarpService);

  readonly translator = inject(TranslationService);

  async goBack(): Promise<void> {
    if (this.warp.isTravelling) return;
    await this.warp.travel(this.route, 'backward');
  }

  @HostListener('mouseenter')
  onEnter(): void {
    if (prefersReducedMotion()) return;
    animate(this.arrow.nativeElement, {
      x: { from: -4, to: 0 },
      duration: 480,
      ease: 'outBack',
      overwrite: true,
    });
  }
}
