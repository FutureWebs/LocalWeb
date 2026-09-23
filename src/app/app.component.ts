import {Component, inject} from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { Background3dComponent } from './features/background-3d/background-3d.component';
import { ScrollyContainerComponent } from './features/scrolly-container/scrolly-container.component';
import { ScrollIndicatorComponent } from './shared/scroll-indicator/scroll-indicator.component';
import {ProjectsListComponent} from './features/projects-list/projects-list.component';
import {ThemeService} from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    Background3dComponent,
    ScrollyContainerComponent,
    ScrollIndicatorComponent,
    ProjectsListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public themeService = inject(ThemeService);

}
