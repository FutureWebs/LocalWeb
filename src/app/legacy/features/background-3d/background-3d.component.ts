import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ThemeService } from '../../core/services/theme.service';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-background-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background-3d.component.html',
  styleUrls: ['./background-3d.component.scss']
})
export class Background3dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoContainer', { static: true }) videoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('bgVideo', { static: true }) bgVideo!: ElementRef<HTMLVideoElement>; // Nueva referencia

  private ngZone = inject(NgZone);
  private scrollService = inject(ScrollService);
  private themeService = inject(ThemeService);

  private mouseX = 0;
  private mouseY = 0;
  private currentScale = 1;
  private scrollCheckInterval: any;

  ngAfterViewInit(): void {
    this.forceVideoAutoplay();

    this.ngZone.runOutsideAngular(() => {
      this.initParallax();
      this.listenToScroll();
    });
  }

  private forceVideoAutoplay() {
    const videoElement = this.bgVideo.nativeElement;
    // Doble seguro de silenciamiento por JS (requerido por políticas de Chrome)
    videoElement.muted = true;

    // play() devuelve una promesa. Si el navegador lo bloquea, la capturamos para evitar errores rojos en consola.
    videoElement.play().catch(error => {
      console.warn('El navegador bloqueó el autoplay. El video iniciará tras la primera interacción.', error);

      // Fallback: Si se bloquea, intentamos reproducirlo en el primer clic o scroll del usuario
      const startVideoOnInteraction = () => {
        videoElement.play();
        window.removeEventListener('click', startVideoOnInteraction);
        window.removeEventListener('wheel', startVideoOnInteraction);
      };

      window.addEventListener('click', startVideoOnInteraction, { once: true });
      window.addEventListener('wheel', startVideoOnInteraction, { once: true });
    });
  }

  private initParallax() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;

      gsap.to(this.videoContainer.nativeElement, {
        x: this.mouseX * -25,
        y: this.mouseY * -25,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  }

  private listenToScroll() {
    let lastSection = -1;

    this.scrollCheckInterval = setInterval(() => {
      const currentSection = this.scrollService.currentSectionIndex();

      if (currentSection !== lastSection) {
        lastSection = currentSection;

        const total = this.scrollService.totalSections > 1 ? this.scrollService.totalSections - 1 : 1;
        const progress = currentSection / total;

        this.currentScale = 1 + (progress * 0.5);

        // NUEVO: Cálculo de desplazamiento a la derecha para móviles
        let shiftRight = 0;
        if (window.innerWidth <= 768) {
          // A medida que bajas de sección (progress de 0 a 1),
          // el video se empuja hasta un 40% de su tamaño hacia la derecha.
          shiftRight = progress * 40;
        }

        if (this.themeService.gravityState() === 'absorbing') {
          this.currentScale = 15;
          shiftRight = 0; // Lo volvemos a centrar violentamente para que te trague el centro
        }

        gsap.to(this.videoContainer.nativeElement, {
          scale: this.currentScale,
          xPercent: shiftRight, // Desplazamiento lateral independiente del parallax (X)
          duration: 1.5,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.scrollCheckInterval) {
      clearInterval(this.scrollCheckInterval);
    }
  }
}
