import {AfterViewInit, Component, inject, signal} from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import {ThemeService} from './core/services/theme.service';
import {BackgroundPatternComponent} from './shared/background/background-pattern.component';
import {AboutComponent} from './features/about/about.component';
import {CommonModule} from '@angular/common';
import {ProjectsComponent} from './features/projects/projects.component';
import {HeroComponent} from './features/hero/hero.component';
import {WorkProcessComponent} from './features/work-process/work-process.component';
import {ContactFooterComponent} from './shared/contact-footer/contact-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BackgroundPatternComponent,
    AboutComponent,
    ProjectsComponent,
    HeroComponent,
    WorkProcessComponent,
    ContactFooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent  implements AfterViewInit{
  currentSection = signal<'about' | 'projects'>('about');

  switchToProjects() {
    this.currentSection.set('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  switchToAbout() {
    this.currentSection.set('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    // Forzamos un recálculo de todas las posiciones de scroll tras aplicar márgenes y cargas
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
  }
}
