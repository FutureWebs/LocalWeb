import { Component, ElementRef, HostListener, Input, Output, inject, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { animate } from 'animejs';
import { prefersReducedMotion } from '../../services/anime.helpers';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) text = '';
  @Input() icon = '';
  @Input() tags: string[] = [];
  @Input() bullets: string[] = [];
  @Input() actionLabel = '';
  @Input() href: string | null = null;
  @Input() media = '';
  @Input() variant: 'default' | 'service' | 'value' | 'project' = 'default';
  @Output() action = new EventEmitter<void>();

  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('mouseenter')
  onEnter(): void {
    if (prefersReducedMotion()) return;
    animate(this.el.nativeElement, {
      y: -8,
      duration: 320,
      ease: 'outQuad',
      overwrite: true,
    });
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (prefersReducedMotion()) return;
    animate(this.el.nativeElement, {
      y: 0,
      duration: 420,
      ease: 'outBack',
      overwrite: true,
    });
  }
}
