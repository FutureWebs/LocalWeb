import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { animate } from 'animejs';
import { prefersReducedMotion } from '../../services/anime.helpers';

interface FieldStar {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  glow: boolean;
}

@Component({
  selector: 'app-star-field',
  standalone: true,
  templateUrl: './star-field.component.html',
  styleUrls: ['./star-field.component.scss'],
})
export class StarFieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('layer', { static: true }) layer!: ElementRef<HTMLDivElement>;
  @ViewChild('shooter', { static: true }) shooter!: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);

  readonly stars = signal<FieldStar[]>(StarFieldComponent.buildStars());

  private twinkleRevert: (() => void) | null = null;
  private parallaxHandler: ((event: MouseEvent) => void) | null = null;
  private shooterTimer: ReturnType<typeof setTimeout> | null = null;

  private static buildStars(): FieldStar[] {
    const count = window.innerWidth < 768 ? 70 : 160;
    const stars: FieldStar[] = [];
    for (let id = 0; id < count; id++) {
      stars.push({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() < 0.82 ? Math.random() * 2.2 + 1.4 : Math.random() * 3 + 3,
        opacity: Math.random() * 0.5 + 0.5,
        glow: Math.random() < 0.18,
      });
    }
    return stars;
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.zone.runOutsideAngular(() => {
      this.startTwinkle();
      this.startParallax();
      this.scheduleShooter();
    });
  }

  private startTwinkle(): void {
    const nodes = Array.from(this.layer.nativeElement.querySelectorAll<HTMLElement>('.star-field__star'));
    if (!nodes.length) return;

    const revertFns = nodes.map((star, index) => {
      const animation = animate(star, {
        opacity: { from: 0.1, to: 1 },
        scale: { from: 0.55, to: 1.5 },
        duration: 2400 + Math.random() * 3200,
        delay: index * 12,
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      });
      return () => animation.revert();
    });

    this.twinkleRevert = () => revertFns.forEach((fn) => fn());
  }

  private startParallax(): void {
    this.parallaxHandler = (event: MouseEvent) => {
      const mx = (event.clientX / window.innerWidth) * 2 - 1;
      const my = (event.clientY / window.innerHeight) * 2 - 1;

      animate(this.layer.nativeElement, {
        x: mx * -22,
        y: my * -22,
        duration: 1400,
        ease: 'outQuad',
        overwrite: true,
      });
    };
    window.addEventListener('mousemove', this.parallaxHandler, { passive: true });
  }

  private scheduleShooter(): void {
    const run = () => {
      const el = this.shooter.nativeElement;
      const top = 5 + Math.random() * 45;
      const travel = window.innerWidth * 0.7;

      animate(el, {
        top: `${top}%`,
        left: '-10%',
        x: travel,
        y: travel * 0.42,
        opacity: { from: 0, to: 1 },
        duration: 700,
        ease: 'outQuad',
        onComplete: () => {
          animate(el, {
            opacity: { to: 0 },
            duration: 500,
            onComplete: () => {
              this.shooterTimer = setTimeout(run, 5000 + Math.random() * 7000);
            },
          });
        },
      });
    };

    this.shooterTimer = setTimeout(run, 3500);
  }

  ngOnDestroy(): void {
    this.twinkleRevert?.();
    if (this.parallaxHandler) {
      window.removeEventListener('mousemove', this.parallaxHandler);
    }
    if (this.shooterTimer) {
      clearTimeout(this.shooterTimer);
    }
  }
}
