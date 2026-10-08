import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeService } from '../../core/services/theme.service';
import {TranslatePipe} from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects-list',
  standalone: true,
  templateUrl: './projects-list.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef<HTMLDivElement>;

  private themeService = inject(ThemeService);
  private ngZone = inject(NgZone);
  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.initScrollAnimations();
    });
  }

  private initScrollAnimations() {
    const rows = gsap.utils.toArray('.project-row') as HTMLElement[];

    rows.forEach((row, i) => {
      const isReverse = row.classList.contains('reverse');

      // Si es reverse viene de la izquierda (-100), si no viene de la derecha (100)
      const xDirection = isReverse ? -100 : 100;

      const trigger = ScrollTrigger.create({
        trigger: row,
        scroller: this.wrapper.nativeElement, // Es vital indicarle a GSAP cuál es el div que tiene el overflow
        start: "top 80%", // Arranca la animación cuando el top del elemento cruza el 80% de la pantalla
        onEnter: () => {
          gsap.fromTo(row,
            { x: xDirection, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          );
        },
        once: true // Solo anima la primera vez que se ve
      });

      this.triggers.push(trigger);
    });
  }

  volver() {
    // 1. Desencadenamos el caos gravitacional en el video de fondo
    this.themeService.triggerBlackHoleAbsorption();

    // 2. Chupamos el contenedor de proyectos entero hacia el fondo de la pantalla
    gsap.to(this.wrapper.nativeElement, {
      z: -8000, // Se va a la profundidad extrema
      scale: 0, // Se hace minúsculo
      x: 500,
      rotateZ: 720, // Gira sobre su eje
      autoAlpha: 0,
      filter: "blur(20px)", // Se distorsiona
      duration: 2,
      ease: "power4.in",
      onComplete: () => {
        // Volvemos a la vista 3D después del efecto
        setTimeout(() => {
          this.themeService.currentView.set('main');
          this.themeService.resetGravity();
        }, 1500); // 1.5s en el vacío
      }
    });
  }

  ngOnDestroy() {
    this.triggers.forEach(t => t.kill());
  }
}
