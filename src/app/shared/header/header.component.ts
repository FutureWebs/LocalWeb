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
}
