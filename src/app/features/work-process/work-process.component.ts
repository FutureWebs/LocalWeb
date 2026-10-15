import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-work-process',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './work-process.component.html',
  styleUrls: ['./work-process.component.scss']
})
export class WorkProcessComponent implements AfterViewInit, OnDestroy {
  @ViewChild('processSection', { static: true }) processSection!: ElementRef<HTMLElement>;
  @ViewChildren('processRow') processRows!: QueryList<ElementRef>;

  private scrollCtx?: gsap.Context;

  ngAfterViewInit(): void {
    const sectionEl = this.processSection.nativeElement;

    this.scrollCtx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        // 🖥️ Escritorio: Mantiene toda la elegancia de la animación en zig-zag con GSAP
        "(min-width: 769px)": () => {
          this.processRows.forEach((row, index) => {
            const el = row.nativeElement;
            const direction = index % 2 === 0 ? -50 : 50;

            gsap.fromTo(el,
              { opacity: 0, x: direction, y: 30 },
              {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 85%',
                  toggleActions: 'play none none none'
                }
              }
            );
          });
        },

        // 📱 Celular: Cero ScrollTrigger pesado. Los elementos se muestran perfectos y estáticos sin tirones ni fondo bailando
        "(max-width: 768px)": () => {
          this.processRows.forEach((row) => {
            gsap.set(row.nativeElement, { opacity: 1, x: 0, y: 0 });
          });
        }
      });
    }, sectionEl);
  }

  ngOnDestroy(): void {
    this.scrollCtx?.revert();
  }
}
