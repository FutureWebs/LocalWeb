import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection', { static: true }) aboutSection!: ElementRef<HTMLElement>;
  @ViewChild('polaroidWrapper', { static: true }) polaroidWrapper!: ElementRef<HTMLElement>;

  private scrollCtx?: gsap.Context;

  ngAfterViewInit(): void {
    const sectionEl = this.aboutSection.nativeElement;
    const wrapperEl = this.polaroidWrapper.nativeElement;

    this.scrollCtx && this.scrollCtx.revert();

    this.scrollCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: '+=200%', // Espacio de scroll para la animación completa de ida y vuelta
          scrub: true,   // Sincroniza la animación exactamente con el movimiento de la rueda del mouse
          pin: true,     // Fija la sección mientras ocurre el zoom
          anticipatePin: 1
        }
      });

      // 1. Ocultamos el texto lateral de la izquierda
      tl.to('.about-text-content', { opacity: 0, x: -60, duration: 0.3 }, 0)
        .to('.polaroid-tape', { opacity: 0, duration: 0.15 }, 0)
        .to('.polaroid-caption', { opacity: 0, duration: 0.15 }, 0)

        // 2. Zoom de la Polaroid (crece, se centra y cubre toda la pantalla)
        .to(wrapperEl, {
          scale: 9.5,
          rotation: 0,
          x: '30vw',
          y: '0vh',
          ease: 'power2.inOut'
        }, 0)

        // 3. Fundido del marco blanco
        .to('.polaroid-frame', {
          borderRadius: '0px',
          padding: '0px',
          boxShadow: 'none',
          background: 'transparent',
          ease: 'power2.inOut'
        }, 0);

    }, sectionEl);
  }

  ngOnDestroy(): void {
    this.scrollCtx && this.scrollCtx.revert();
  }
}
