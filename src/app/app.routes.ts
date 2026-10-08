import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'FutureWebs · Constelación digital',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
  {
    path: 'mapa',
    title: 'Constelación · FutureWebs',
    loadComponent: () =>
      import('./pages/constellation-page/constellation-page.component').then(
        (m) => m.ConstellationPageComponent,
      ),
  },
  {
    path: 'equipo',
    title: 'Equipo · FutureWebs',
    loadComponent: () =>
      import('./pages/about-us/about-us.component').then((m) => m.AboutUsComponent),
  },
  {
    path: 'servicios',
    title: 'Servicios · FutureWebs',
    loadComponent: () =>
      import('./pages/services/services.component').then((m) => m.ServicesComponent),
  },
  {
    path: 'proyectos',
    title: 'Proyectos · FutureWebs',
    loadComponent: () =>
      import('./pages/projects/projects.component').then((m) => m.ProjectsComponent),
  },
  {
    path: 'contacto',
    title: 'Contacto · FutureWebs',
    loadComponent: () =>
      import('./pages/contact-us/contact-us.component').then((m) => m.ContactUsComponent),
  },
  { path: '**', redirectTo: '' },
];
