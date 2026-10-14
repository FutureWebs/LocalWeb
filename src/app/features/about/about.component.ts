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

  private gsapMatcher?: gsap.MatchMedia;

  ngAfterViewInit(): void {
    const sectionEl = this.aboutSection.nativeElement;
    const wrapperEl = this.polaroidWrapper.nativeElement;

    this.gsapMatcher = gsap.matchMedia();

    this.gsapMatcher.add({
      isDesktop: '(min-width: 769px)',
      isMobile: '(max-width: 768px)'
    }, (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean };

      // Si es escritorio usamos un recorrido largo, si es celular uno más corto para evitar saltos pesados
      const endScroll = isDesktop ? '+=250%' : '+=150%';
      // En celular hacemos la escala un poco menor para que no desborde de forma violenta el viewport táctil
      const scaleValue = isDesktop ? 9.5 : 6;
      const xOffset = isDesktop ? '30vw' : '0vw';

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: endScroll,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true // Vital para que el celular recalcule bien al redimensionar o scrollear
        }
      });

      tl.to('.polaroid-tape', { opacity: 0, duration: 0.3 }, 0.2)
        .to('.polaroid-caption', { opacity: 0, duration: 0.3 }, 0.2)
        .to('.preview-hero', { opacity: 0, duration: 0.4 }, 0.2)
        .to('.about-text-content', { opacity: 0, x: isDesktop ? -60 : 0, duration: 0.5 }, 0.4)
        .to(wrapperEl, {
          scale: scaleValue,
          rotation: 0,
          x: xOffset,
          y: '0vh',
          ease: 'power2.inOut',
          duration: 1.2
        }, 0.3)
        .to(wrapperEl, {
          opacity: 0,
          duration: 0.6,
          ease: 'power1.in'
        }, 0.6);
    });
  }

  ngOnDestroy(): void {
    this.gsapMatcher?.revert();
  }
}
