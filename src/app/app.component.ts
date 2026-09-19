import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { Background3dComponent } from './features/background-3d/background-3d.component';
import { ScrollyContainerComponent } from './features/scrolly-container/scrolly-container.component';
import { ScrollIndicatorComponent } from './shared/scroll-indicator/scroll-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    Background3dComponent,
    ScrollyContainerComponent,
    ScrollIndicatorComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Toda la lógica de inicialización 3D y captura de gestos
  // ahora vive en sus respectivos componentes (Background3d y ScrollyContainer).
  // ¡Este archivo queda 100% limpio!
}
