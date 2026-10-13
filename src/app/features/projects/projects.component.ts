import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  @Output() reachTop = new EventEmitter<void>();

  // Detecta el scroll hacia arriba cuando estás en la parte superior absoluta
  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (window.scrollY <= 5 && event.deltaY < 0) {
      this.reachTop.emit();
    }
  }

  // Soporte para gestos táctiles (Swipe hacia abajo para volver a About en celulares)
  private touchStartY = 0;

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('window:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndY = event.changedTouches[0].clientY;
    if (window.scrollY <= 5 && touchEndY - this.touchStartY > 70) {
      this.reachTop.emit();
    }
  }

  projectsList = [
    { title: 'STUDER Platform', desc: 'Educational modular platform with interactive challenges.', tag: 'Angular & Spring' },
    { title: 'Animator Studio', desc: '2D desktop animation application built with modern tooling.', tag: 'Wails & Go' },
    { title: 'STUDER Platform', desc: 'Educational modular platform with interactive challenges.', tag: 'Angular & Spring' },
    { title: 'Animator Studio', desc: '2D desktop animation application built with modern tooling.', tag: 'Wails & Go' },
    { title: 'STUDER Platform', desc: 'Educational modular platform with interactive challenges.', tag: 'Angular & Spring' },
    { title: 'Animator Studio', desc: '2D desktop animation application built with modern tooling.', tag: 'Wails & Go' },
    { title: 'STUDER Platform', desc: 'Educational modular platform with interactive challenges.', tag: 'Angular & Spring' },
    { title: 'Animator Studio', desc: '2D desktop animation application built with modern tooling.', tag: 'Wails & Go' },
    { title: 'FutureWebs Brand', desc: 'Visual identity, landing pages and canvas components.', tag: 'UI/UX & SCSS' }
  ];
}
