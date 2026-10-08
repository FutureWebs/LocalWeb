import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { animate, createTimeline, stagger, svg, utils } from 'animejs';
import {
  CONSTELLATION_LINKS,
  CONSTELLATION_NODES,
  type ConstellationNode,
} from '../../data-environment';
import { prefersReducedMotion } from '../../services/anime.helpers';
import { TranslationService } from '../../services/translation.service';
import { WarpService } from '../../services/warp.service';

type Layout = 'desktop' | 'mobile';

interface PositionedNode extends ConstellationNode {
  pos: { x: number; y: number };
  k: number;
}

interface DustDot {
  id: number;
  x: number;
  y: number;
  r: number;
}

interface LineDef {
  id: string;
  a: string;
  b: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const BASE_CORE = 3.6;

@Component({
  selector: 'app-constellation',
  standalone: true,
  templateUrl: './constellation.component.html',
  styleUrls: ['./constellation.component.scss'],
})
export class ConstellationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLDivElement>;
  @ViewChild('dustLayer', { static: true }) dustLayer!: ElementRef<SVGSVGElement>;

  readonly translator = inject(TranslationService);
  private readonly warp = inject(WarpService);

  private readonly mq =
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 769px)')
      : ({ matches: true, addEventListener: () => undefined, removeEventListener: () => undefined } as unknown as MediaQueryList);
  private readonly layout = signal<Layout>(this.mq.matches ? 'desktop' : 'mobile');
  private readonly mqHandler = (event: MediaQueryListEvent): void => {
    this.layout.set(event.matches ? 'desktop' : 'mobile');
  };

  readonly nodes = computed<PositionedNode[]>(() =>
    CONSTELLATION_NODES.map((node) => ({
      ...node,
      pos: node[this.layout()],
      k: node.core / BASE_CORE,
    })),
  );

  readonly lines = computed<LineDef[]>(() => {
    const positions = new Map(
      CONSTELLATION_NODES.map((node) => [node.id, node[this.layout()]] as const),
    );

    return CONSTELLATION_LINKS.map(([a, b]) => {
      const from = positions.get(a)!;
      const to = positions.get(b)!;
      return {
        id: `${a}-${b}`,
        a,
        b,
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y,
      };
    });
  });

  readonly dust: DustDot[] = ConstellationComponent.buildDust();

  private entranceRevert: (() => void) | null = null;
  private idleRevert: (() => void) | null = null;
  private parallaxHandler: ((event: MouseEvent) => void) | null = null;
  private travelling = false;
  private destroyed = false;

  private static buildDust(): DustDot[] {
    const dots: DustDot[] = [];
    for (let id = 0; id < 64; id++) {
      dots.push({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 0.38 + 0.12,
      });
    }
    return dots;
  }

  constructor() {
    this.mq.addEventListener('change', this.mqHandler);
  }

  ngAfterViewInit(): void {
    this.playEntrance();
    this.startParallax();
  }

  /** El polvo estelar blanco respira con el ratón, igual que las estrellas lejanas. */
  private startParallax(): void {
    if (prefersReducedMotion()) return;

    this.parallaxHandler = (event: MouseEvent) => {
      const mx = (event.clientX / window.innerWidth) * 2 - 1;
      const my = (event.clientY / window.innerHeight) * 2 - 1;

      animate(this.dustLayer.nativeElement, {
        x: mx * -14,
        y: my * -14,
        duration: 900,
        ease: 'outQuad',
        overwrite: true,
      });
    };
    window.addEventListener('mousemove', this.parallaxHandler, { passive: true });
  }

  private qsa<T extends Element>(selector: string): T[] {
    return Array.from(this.root.nativeElement.querySelectorAll<T>(selector));
  }

  private playEntrance(): void {
    const dustEls = this.qsa<SVGCircleElement>('.constellation__dust');
    const lineEls = this.qsa<SVGLineElement>('.constellation__line');
    const starEls = this.qsa<HTMLElement>('.star');

    if (prefersReducedMotion()) {
      utils.set(dustEls, { opacity: 1 });
      utils.set(starEls, { opacity: 1, scale: 1 });
      svg.createDrawable(lineEls, 0, 1).forEach((drawable) => drawable.setAttribute('draw', '0 1'));
      this.startIdle();
      return;
    }

    const drawables = svg.createDrawable(lineEls, 0, 0);

    utils.set(starEls, { opacity: 0, scale: 0 });

    const timeline = createTimeline();

    timeline.add(dustEls, { opacity: { from: 0, to: 1 }, duration: 900, delay: stagger(14), ease: 'outQuad' }, 0);
    timeline.add(
      drawables,
      { draw: { from: '0 0', to: '0 1' }, duration: 1300, delay: stagger(150), ease: 'inOutQuad' },
      220,
    );
    timeline.add(
      starEls,
      {
        scale: { from: 0, to: 1 },
        opacity: { from: 0, to: 1 },
        duration: 820,
        delay: stagger(130, { from: 'center' }),
        ease: 'outBack',
      },
      760,
    );
    timeline.call(() => this.startIdle(), 1700);

    this.entranceRevert = () => timeline.revert();
  }

  private startIdle(): void {
    if (this.destroyed || prefersReducedMotion()) return;

    const sparks = this.qsa<SVGElement>('.star__spark svg');
    const cores = this.qsa<HTMLElement>('.star__core');
    const rings = this.qsa<HTMLElement>('.star__ring');

    const animations = [
      animate(sparks, {
        rotate: '1turn',
        duration: 18000,
        loop: true,
        ease: 'linear',
      }),
      animate(rings, {
        rotate: '-1turn',
        duration: 30000,
        loop: true,
        ease: 'linear',
      }),
      animate(cores, {
        scale: { from: 1, to: 1.16 },
        duration: 2600,
        delay: stagger(220),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
    ];

    this.idleRevert = () => animations.forEach((animation) => animation.revert());
  }

  onStarEnter(node: ConstellationNode, event: Event): void {
    const button = event.currentTarget as HTMLElement;
    this.highlightLines(node.id, true);

    if (prefersReducedMotion()) return;
    animate(button, { scale: 1.12, duration: 320, ease: 'outQuad', overwrite: true });
  }

  onStarLeave(node: ConstellationNode, event: Event): void {
    const button = event.currentTarget as HTMLElement;
    this.highlightLines(node.id, false);

    if (prefersReducedMotion()) return;
    animate(button, { scale: 1, duration: 360, ease: 'outQuad', overwrite: true });
  }

  private highlightLines(nodeId: string, on: boolean): void {
    const lines = this.qsa<SVGLineElement>(
      `.constellation__line[data-from="${nodeId}"], .constellation__line[data-to="${nodeId}"]`,
    );
    if (!lines.length) return;

    lines.forEach((line) => line.classList.toggle('is-hot', on));

    if (prefersReducedMotion()) return;

    animate(lines, {
      opacity: { to: on ? 1 : 0.5 },
      duration: 300,
      ease: 'outQuad',
      overwrite: true,
    });
  }

  async travelTo(node: ConstellationNode, event: Event): Promise<void> {
    if (this.travelling || this.warp.isTravelling) return;
    this.travelling = true;

    const button = event.currentTarget as HTMLElement;

    try {
      if (!prefersReducedMotion()) {
        await this.burst(button);
      }
      await this.warp.travel(node.route, 'forward');
    } finally {
      this.travelling = false;
    }
  }

  /** La estrella "explota" hacia nosotros: es el inicio del viaje. */
  private burst(button: HTMLElement): Promise<void> {
    this.idleRevert?.();
    this.idleRevert = null;

    const core = button.querySelector<HTMLElement>('.star__core');
    const spark = button.querySelector<HTMLElement>('.star__spark');
    const label = button.querySelector<HTMLElement>('.star__label');

    return new Promise<void>((resolve) => {
      const timeline = createTimeline();

      timeline.add(button, { scale: { from: 1, to: 1.3 }, duration: 260, ease: 'outQuad' }, 0);
      if (label) {
        timeline.add(label, { opacity: { to: 0 }, y: { to: 14 }, duration: 300, ease: 'inQuad' }, 0);
      }
      if (core) {
        timeline.add(core, { scale: { to: 6 }, opacity: { to: 0 }, duration: 560, ease: 'inQuad' }, 180);
      }
      if (spark) {
        timeline.add(
          spark,
          { scale: { to: 3.4 }, rotate: '+=140', opacity: { to: 0 }, duration: 560, ease: 'inQuad' },
          180,
        );
      }

      timeline.call(() => resolve(), 480);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.mq.removeEventListener('change', this.mqHandler);
    if (this.parallaxHandler) {
      window.removeEventListener('mousemove', this.parallaxHandler);
    }
    this.entranceRevert?.();
    this.idleRevert?.();
  }
}
