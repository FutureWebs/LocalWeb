import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

interface SketchItem {
  textEs: string;
  textEn: string;
  font: 'gasoek' | 'reenie' | 'caveat' | 'kalam' | 'cursive-script' | 'elegant';
  rotate: number;
  size: string;
  italic?: boolean;
  weight?: string;
}

@Component({
  selector: 'app-background-pattern',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background-pattern.component.html',
  styleUrls: ['./background-pattern.component.scss']
})
export class BackgroundPatternComponent {
  private themeService = inject(ThemeService);

  // Muestra de frases y elementos de marca con gran variedad de tipografías
  private baseItems: SketchItem[] = [
    { textEs: 'Future Webs', textEn: 'Future Webs', font: 'reenie', rotate: -12, size: '2.4rem' },
    { textEs: 'FUTURE WEBS', textEn: 'FUTURE WEBS', font: 'gasoek', rotate: -5, size: '1.1rem' },
    { textEs: 'futurewebscba@gmail.com', textEn: 'futurewebscba@gmail.com', font: 'caveat', rotate: -15, size: '1.5rem', italic: true, weight: '700' },
    { textEs: '@futurewebscba', textEn: '@futurewebscba', font: 'cursive-script', rotate: 8, size: '1.9rem' },
    { textEs: 'desarrollo a medida', textEn: 'custom software', font: 'kalam', rotate: -8, size: '1.2rem' },
    { textEs: 'Future Webs', textEn: 'Future Webs', font: 'elegant', rotate: 6, size: '2rem' },
    { textEs: 'código limpio', textEn: 'clean code', font: 'caveat', rotate: -18, size: '1.6rem', italic: true },
    { textEs: 'futurewebscba@gmail.com', textEn: 'futurewebscba@gmail.com', font: 'kalam', rotate: 12, size: '1.1rem' },
    { textEs: 'innovación digital', textEn: 'digital innovation', font: 'cursive-script', rotate: -10, size: '1.8rem' },
    { textEs: '@futurewebscba', textEn: '@futurewebscba', font: 'reenie', rotate: -14, size: '2.2rem' },
    { textEs: 'Future Webs', textEn: 'Future Webs', font: 'gasoek', rotate: 4, size: '1rem' },
    { textEs: 'futurewebscba@gmail.com', textEn: 'futurewebscba@gmail.com', font: 'elegant', rotate: -6, size: '1.4rem' },
    { textEs: 'apps web & mobile', textEn: 'web & mobile apps', font: 'caveat', rotate: 15, size: '1.5rem', italic: true },
    { textEs: 'Future Webs', textEn: 'Future Webs', font: 'reenie', rotate: -8, size: '2.6rem' },
    { textEs: 'soluciones tecnológicas', textEn: 'tech solutions', font: 'kalam', rotate: -7, size: '1.2rem' }
  ];

  // Duplicamos el listado para llenar toda la cuadrícula homogéneamente
  items = computed(() => {
    const lang = this.themeService.currentLanguage();
    const mapped = this.baseItems.map(item => ({
      ...item,
      currentText: lang === 'es' ? item.textEs : item.textEn
    }));
    // Generamos repeticiones para cubrir resoluciones grandes
    return [...mapped, ...mapped, ...mapped];
  });
}
