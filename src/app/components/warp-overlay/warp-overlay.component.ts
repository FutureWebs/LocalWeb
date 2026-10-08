import { Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { createTimeline, stagger } from 'animejs';
import { prefersReducedMotion } from '../../services/anime.helpers';
import { WarpService, WarpState } from '../../services/warp.service';

const STREAK_COUNT = 46;

@Component({
  selector: 'app-warp-overlay',
  standalone: true,
  templateUrl: './warp-overlay.component.html',
  styleUrls: ['./warp-overlay.component.scss'],
})
export class WarpOverlayComponent {
  @ViewChild('portal', { static: true }) portal!: ElementRef<HTMLElement>;
  @ViewChild('flash', { static: true }) flash!: ElementRef<HTMLElement>;
  @ViewChild('streaksHost', { static: true }) streaksHost!: ElementRef<HTMLElement>;

  private readonly warp = inject(WarpService);

  readonly state = this.warp.state;
  readonly angles = Array.from({ length: STREAK_COUNT }, (_, index) => index * (360 / STREAK_COUNT));

  constructor() {
    effect(() => {
      const current = this.state();
      if (current.phase === 'intro') this.playIntro(current);
    });

    effect(() => {
      const current = this.state();
      if (current.phase === 'outro') this.playOutro(current);
    });
  }

  private get beams(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>('.warp__beam'));
  }

  private get reach(): number {
    return Math.max(window.innerWidth, window.innerHeight) * 0.6;
  }

  private playIntro(state: WarpState): void {
    if (prefersReducedMotion()) {
      this.warp.notifyIntroComplete();
      return;
    }

    const beams = this.beams;
    const portal = this.portal.nativeElement;
    const flash = this.flash.nativeElement;
    const reach = this.reach;

    const timeline = createTimeline({ defaults: { ease: 'outExpo' } });

    if (state.direction === 'forward') {
      timeline.add(
        beams,
        {
          y: { from: 0, to: reach },
          scaleY: { from: 0.05, to: 1 },
          opacity: { from: 0, to: 1 },
          duration: 640,
          delay: stagger(7, { from: 'random' }),
        },
        0,
      );
      timeline.add(
        portal,
        { scale: { from: 0.15, to: 1.4 }, opacity: { from: 0, to: 0.85 }, duration: 700 },
        0,
      );
    } else {
      timeline.add(
        beams,
        {
          y: { from: reach * 1.15, to: 0 },
          scaleY: { from: 1.5, to: 0.05 },
          opacity: { from: 1, to: 0 },
          duration: 660,
          delay: stagger(7, { from: 'random' }),
          ease: 'inOutQuint',
        },
        0,
      );
      timeline.add(
        portal,
        { scale: { from: 2.4, to: 0.6 }, opacity: { from: 0.9, to: 0.35 }, duration: 700 },
        0,
      );
    }

    timeline.add(
      flash,
      { opacity: { from: 0, to: 0.94 }, duration: 300, ease: 'inQuad' },
      340,
    );
    timeline.call(() => this.warp.notifyIntroComplete(), 660);
  }

  private playOutro(state: WarpState): void {
    if (prefersReducedMotion()) {
      this.warp.notifyOutroComplete();
      return;
    }

    const beams = this.beams;
    const portal = this.portal.nativeElement;
    const flash = this.flash.nativeElement;
    const reach = this.reach;

    const timeline = createTimeline({ defaults: { ease: 'outCubic' } });

    timeline.add(flash, { opacity: { to: 0 }, duration: 540, ease: 'outQuad' }, 0);

    if (state.direction === 'forward') {
      timeline.add(
        beams,
        {
          y: { to: reach * 1.8 },
          scaleY: { to: 1.8 },
          opacity: { to: 0 },
          duration: 580,
          delay: stagger(6, { from: 'random' }),
          ease: 'inQuad',
        },
        0,
      );
      timeline.add(
        portal,
        { scale: { to: 2.9 }, opacity: { to: 0 }, duration: 640, ease: 'inQuad' },
        0,
      );
    } else {
      timeline.add(
        beams,
        {
          y: { to: 0 },
          scaleY: { to: 0.05 },
          opacity: { to: 0 },
          duration: 600,
          delay: stagger(6, { from: 'random' }),
          ease: 'inOutQuint',
        },
        0,
      );
      timeline.add(
        portal,
        { scale: { to: 0.1 }, opacity: { to: 0 }, duration: 640 },
        0,
      );
    }

    timeline.call(() => this.warp.notifyOutroComplete(), 660);
  }
}
