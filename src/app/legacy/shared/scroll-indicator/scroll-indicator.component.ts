import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-scroll-indicator',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './scroll-indicator.component.html',
  styleUrls: ['./scroll-indicator.component.scss']
})
export class ScrollIndicatorComponent {
  scrollService = inject(ScrollService);

  // Escuchamos reactivamente en qué sección estamos
  currentIndex = computed(() => this.scrollService.currentSectionIndex());

  sections = [
    { id: 'home', labelKey: 'NAV.HOME' },
    { id: 'about', labelKey: 'NAV.ABOUT' },
    { id: 'vision', labelKey: 'NAV.VISION' },
    { id: 'projects', labelKey: 'NAV.PROJECTS' },
    { id: 'contact', labelKey: 'NAV.CONTACT' }
  ];

  goTo(index: number) {
    this.scrollService.goToSection(index);
  }
}
