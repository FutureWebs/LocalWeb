import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollService } from '../../core/services/scroll.service';
import {ThemeService} from '../../core/services/theme.service';
import {TranslatePipe} from '@ngx-translate/core';
import {ContactFormData, EmailService} from '../../core/services/email.service';

@Component({
  selector: 'app-scrolly-container',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './scrolly-container.component.html',
  styleUrls: ['./scrolly-container.component.scss']
})
export class ScrollyContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pinWrapper', { static: true }) pinWrapper!: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);
  private scrollService = inject(ScrollService);
  private themeService = inject(ThemeService);
  private emailService = inject(EmailService);
  private panels: HTMLElement[] = [];
  private masterTl!: gsap.core.Timeline;

  // Variables para PC (Rueda del ratón)
  private scrollAccumulator = 0;
  private scrollTimeout: any = null;
  private isAnimating = false;

  // Variables para Móvil (Táctil)
  private touchStartY = 0;
  private touchStartTime = 0;

  constructor() {
    effect(() => {
      const targetIndex = this.scrollService.currentSectionIndex();
      this.animateToStation(targetIndex);
    });
  }

  ngAfterViewInit(): void {
    this.panels = gsap.utils.toArray('.panel');
    this.scrollService.totalSections = this.panels.length;

    this.ngZone.runOutsideAngular(() => {
      this.buildMasterTimeline();

      // Evento para PC
      window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

      // Eventos para Móvil
      window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
      window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
      window.addEventListener('touchend', this.onTouchEnd.bind(this));
    });
  }

  private buildMasterTimeline() {
    this.masterTl = gsap.timeline({ paused: true });

    this.panels.forEach((panel, i) => {

      // AQUÍ ESTÁ EL SECRETO DE LA VISTA LATERAL
      gsap.set(panel, {
        z: i === 0 ? 0 : -4000,
        autoAlpha: i === 0 ? 1 : 0,
        rotateY: i === 0 ? 0 : -55,  // -55 grados lo inclina fuertemente hacia la derecha
        xPercent: i === 0 ? 0 : 80,  // Lo arrincona al lado derecho de la pantalla al nacer
        scale: i === 0 ? 1 : 0.6
      });

      if (i < this.panels.length - 1) {
        const currentPanel = this.panels[i];
        const nextPanel = this.panels[i + 1];

        // El panel que se va, gira hacia la izquierda (-20) para dar la sensación de que te sobrepasa
        this.masterTl.to(currentPanel, { z: 2500, autoAlpha: 0, rotateY: 20, xPercent: -30, scale: 2, ease: "none", duration: 1 }, i);

        // El panel que entra se endereza (0) y se centra (0)
        this.masterTl.to(nextPanel, { z: 0, autoAlpha: 1, rotateY: 0, xPercent: 0, scale: 1, ease: "none", duration: 1 }, i);
      }
    });
  }

  // ==========================================
  // LÓGICA PARA PC (Rueda del ratón)
  // ==========================================
  private onWheel(e: WheelEvent) {
    e.preventDefault();
    if (this.isAnimating) return;

    this.scrollAccumulator += e.deltaY;
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      this.evaluateScrollForce();
    }, 150);
  }

  private evaluateScrollForce() {
    const force = Math.abs(this.scrollAccumulator);
    let stationsToJump = 0;

    if (force > 5000) stationsToJump = 3;
    else if (force > 1500) stationsToJump = 2;
    else if (force > 40) stationsToJump = 1;

    if (stationsToJump > 0) {
      const direction = Math.sign(this.scrollAccumulator);
      this.triggerJump(direction, stationsToJump);
    }
    this.scrollAccumulator = 0;
  }

  // ==========================================
  // LÓGICA PARA MÓVILES (Táctil)
  // ==========================================
  private onTouchStart(e: TouchEvent) {
    // Guardamos dónde empezó el dedo y en qué momento
    this.touchStartY = e.touches[0].clientY;
    this.touchStartTime = Date.now();
  }

  private onTouchMove(e: TouchEvent) {
    // CRÍTICO: Evita el "pull to refresh" nativo del celular y rebotes
    e.preventDefault();
  }

  private onTouchEnd(e: TouchEvent) {
    if (this.isAnimating) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = this.touchStartY - touchEndY; // Positivo si deslizamos hacia arriba (bajar página)
    const deltaTime = Date.now() - this.touchStartTime;

    // Solo accionamos si fue un deslizamiento intencional (> 40px)
    if (Math.abs(deltaY) > 40) {
      // Calculamos la velocidad del dedo (píxeles por milisegundo)
      const velocity = Math.abs(deltaY) / deltaTime;

      let stationsToJump = 1; // Deslizamiento normal = 1 estación

      // Si el dedo fue muy rápido, permitimos saltar 2 estaciones de golpe
      if (velocity > 1.2) {
        stationsToJump = 2;
      }

      const direction = Math.sign(deltaY);
      this.triggerJump(direction, stationsToJump);
    }
  }

  // ==========================================
  // ORQUESTADOR DE SALTOS Y ANIMACIÓN
  // ==========================================
  private triggerJump(direction: number, stationsToJump: number) {
    const currentIndex = this.scrollService.currentSectionIndex();

    let targetIndex = currentIndex + (direction * stationsToJump);
    targetIndex = Math.max(0, Math.min(targetIndex, this.panels.length - 1));

    if (targetIndex !== currentIndex) {
      this.scrollService.goToSection(targetIndex);
    }
  }

  private animateToStation(targetIndex: number) {
    if (!this.masterTl) return;

    this.isAnimating = true;
    const distance = Math.abs(targetIndex - this.masterTl.time());

    if (distance === 0) {
      this.isAnimating = false;
      return;
    }

    let duration = distance === 1 ? 1.4 : Math.min(2.2, distance * 0.8);

    gsap.to(this.masterTl, {
      time: targetIndex,
      duration: duration,
      ease: "power2.inOut",
      onComplete: () => {
        this.isAnimating = false;
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('wheel', this.onWheel.bind(this));
    window.removeEventListener('touchstart', this.onTouchStart.bind(this));
    window.removeEventListener('touchmove', this.onTouchMove.bind(this));
    window.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }


  abrirProyectos() {
    // Aquí puedes abrir tu modal/componente de proyectos.
    // Cuando ese componente emita el evento "volver", llamas a absorberEnAgujeroNegro()
  }

  async enviarFormulario(event: Event) {
    event.preventDefault();
    const data : ContactFormData = {
      nombreCompleto: document.getElementById('nombreCompleto')?.nodeValue || 'ERROR3', //CAMBIAR ETIQUETA nodeValue PORQUE NO FUNCIONA, value TAMPOCO FUNCIONA
      correo: document.getElementById('email')?.nodeValue || 'ERROR3',
      mensaje: document.getElementById('mensaje')?.nodeValue || 'ERROR3',
    }
    const succesfull = await this.emailService.sendEmail(data);
    if (succesfull) {
      console.log('email enviado');
      this.absorberEnAgujeroNegro();
    } else {
      console.log('fallo enviado');
    }
  }

  private absorberEnAgujeroNegro() {
    // Dispara el estado global (acelera el video de fondo drásticamente)
    this.themeService.triggerBlackHoleAbsorption();

    // Seleccionamos el panel actual (el de contacto o el de proyectos)
    const currentPanel = this.panels[this.scrollService.currentSectionIndex()];

    // Animación de ser tragado por el centro
    gsap.to(currentPanel, {
      z: -8000, // Se va a la profundidad extrema
      scale: 0, // Se hace minúsculo
      rotateZ: 720, // Gira sobre su eje
      autoAlpha: 0,
      filter: "blur(20px)", // Se distorsiona
      duration: 2,
      ease: "power4.in",
      onComplete: () => {
        // Después de ser absorbidos, esperamos unos segundos en el vacío
        // y reseteamos la web llevándolos a la sección Inicio.
        setTimeout(() => {
          this.scrollService.goToSection(0); // Volver al home
          this.themeService.resetGravity();

          // Restauramos los estilos que sobreescribimos
          gsap.set(currentPanel, { clearProps: "all" });
          this.buildMasterTimeline(); // Reconstruye los estados
        }, 3000);
      }
    });
  }
}
