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
      this.processRows.forEach((row, index) => {
        const el = row.nativeElement;
        const isDesktop = window.innerWidth > 768;
        const direction = isDesktop ? (index % 2 === 0 ? -50 : 50) : 0;

        // Definimos un start específico para compu y otro para celular
        const triggerStart = isDesktop ? 'top 85%' : 'top 250%';

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
              start: triggerStart,
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      ScrollTrigger.refresh();
    }, sectionEl);
  }

  ngOnDestroy(): void {
    this.scrollCtx?.revert();
  }
}
