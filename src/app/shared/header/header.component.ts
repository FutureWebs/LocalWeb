import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl:'./header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  themeService = inject(ThemeService);

  toggleLang() {
    this.themeService.toggleLanguage();
  }

  toggleTheme(event: MouseEvent) {
    const nextTheme = this.themeService.current === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(nextTheme, { animate: true, event: event });
  }

  get currentThemeIcon(): string {
    return this.themeService.current === 'light' ? 'pi pi-moon' : 'pi pi-sun';
  }
}
