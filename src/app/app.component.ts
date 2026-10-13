import {Component, inject} from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import {ThemeService} from './core/services/theme.service';
import {BackgroundPatternComponent} from './shared/background/background-pattern.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    BackgroundPatternComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public themeService = inject(ThemeService);

}
