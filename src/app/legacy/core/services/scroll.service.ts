import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  // Guardamos el índice de la sección actual (0 = Inicio, 1 = About, etc.)
  public currentSectionIndex = signal<number>(0);

  // Total de secciones (lo actualizaremos desde el componente Scrolly)
  public totalSections = 4;

  goToSection(index: number) {
    if (index >= 0 && index < this.totalSections) {
      this.currentSectionIndex.set(index);
    }
  }
}
