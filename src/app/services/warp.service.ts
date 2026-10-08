import { Injectable, NgZone, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

export type WarpDirection = 'forward' | 'backward';
export type WarpPhase = 'idle' | 'intro' | 'outro';

export interface WarpState {
  active: boolean;
  direction: WarpDirection;
  phase: WarpPhase;
  /** Incrementa en cada viaje. */
  seq: number;
}

/**
 * Coordina la animación de "agujero de gusano" con la navegación:
 * intro (viaje) -> cambio de ruta en el punto medio -> outro (llegada).
 * El WarpOverlayComponent reproduce cada fase y notifica al terminar.
 */
@Injectable({ providedIn: 'root' })
export class WarpService {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  private readonly _state = signal<WarpState>({
    active: false,
    direction: 'forward',
    phase: 'idle',
    seq: 0,
  });
  readonly state = this._state.asReadonly();

  private introResolver: (() => void) | null = null;
  private outroResolver: (() => void) | null = null;

  get isTravelling(): boolean {
    return this._state().active;
  }

  /** Reproduce el viaje y navega en el punto medio de la animación. */
  async travel(url: string, direction: WarpDirection = 'forward'): Promise<void> {
    if (this._state().active) return;

    const seq = this._state().seq + 1;
    this.setState({ active: true, direction, phase: 'intro', seq });

    await new Promise<void>((resolve) => (this.introResolver = resolve));

    await this.router.navigateByUrl(url);

    this.setState({ ...this._state(), phase: 'outro' });

    await new Promise<void>((resolve) => (this.outroResolver = resolve));

    this.setState({ active: false, phase: 'idle' });
  }

  notifyIntroComplete(): void {
    const resolve = this.introResolver;
    this.introResolver = null;
    resolve?.();
  }

  notifyOutroComplete(): void {
    const resolve = this.outroResolver;
    this.outroResolver = null;
    resolve?.();
  }

  private setState(partial: Partial<WarpState>): void {
    const next: WarpState = { ...this._state(), ...partial };
    this.zone.run(() => this._state.set(next));
  }
}
