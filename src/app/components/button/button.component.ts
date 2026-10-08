import { Component, HostListener, Input, ElementRef, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { animate } from 'animejs';
import { prefersReducedMotion } from '../../services/anime.helpers';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input({ required: true }) label = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() routerLink: string | null = null;
  @Input() href: string | null = null;
  @Input() disabled = false;
  @Input() extraClass = '';

  private readonly el = inject(ElementRef<HTMLElement>);

  get classes(): string {
    return `btn--${this.variant}${this.extraClass ? ` ${this.extraClass}` : ''}`;
  }

  @HostListener('mouseenter')
  @HostListener('focus')
  onHoverIn(): void {
    if (prefersReducedMotion()) return;
    animate(this.el.nativeElement, {
      scale: 1.05,
      duration: 260,
      ease: 'outQuad',
      overwrite: true,
    });
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  onHoverOut(): void {
    if (prefersReducedMotion()) return;
    animate(this.el.nativeElement, {
      scale: 1,
      duration: 320,
      ease: 'outBack',
      overwrite: true,
    });
  }
}
