import {Component, inject, signal} from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import {ThemeService} from './core/services/theme.service';
import {BackgroundPatternComponent} from './shared/background/background-pattern.component';
import {AboutComponent} from './features/about/about.component';
import {CommonModule} from '@angular/common';
import {ProjectsComponent} from './features/projects/projects.component';
import {HeroComponent} from './features/hero/hero.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BackgroundPatternComponent,
    AboutComponent,
    ProjectsComponent,
    HeroComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentSection = signal<'about' | 'projects'>('about');

  switchToProjects() {
    this.currentSection.set('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  switchToAbout() {
    this.currentSection.set('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
