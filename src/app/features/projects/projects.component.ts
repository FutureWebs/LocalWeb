import { Component, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  titleKey: string;
  descKey: string;
  tagKey: string;
  image: string;
  link: string;
  align: 'left' | 'right';
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('projectItem') projectItems!: QueryList<ElementRef>;

  projectsList: Project[] = [
    {
      titleKey: 'PROJECTS.STUDER.TITLE',
      descKey: 'PROJECTS.STUDER.DESC',
      tagKey: 'PROJECTS.STUDER.TAG',
      image: 'assets/images/project-studer.jpg',
      link: '#',
      align: 'left'
    },
    {
      titleKey: 'PROJECTS.TEG.TITLE',
      descKey: 'PROJECTS.TEG.DESC',
      tagKey: 'PROJECTS.TEG.TAG',
      image: 'assets/images/project-teg.jpg',
      link: '#',
      align: 'right'
    },
    {
      titleKey: 'PROJECTS.FUTUREWEBS.TITLE',
      descKey: 'PROJECTS.FUTUREWEBS.DESC',
      tagKey: 'PROJECTS.FUTUREWEBS.TAG',
      image: 'assets/images/project-futurewebs.jpg',
      link: '#',
      align: 'left'
    }
  ];

  private scrollCtx?: gsap.Context;

  ngAfterViewInit(): void {
    // Desactivamos animaciones pesadas de scroll scrub en celulares para garantizar que NUNCA traben el touch o el scroll
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      this.initPolaroidRevealAnimation();
    }
  }

  initPolaroidRevealAnimation(): void {
    this.scrollCtx = gsap.context(() => {
      this.projectItems.forEach((item) => {
        const el = item.nativeElement;
        const photoMask = el.querySelector('.polaroid-reveal-mask');
        const infoContent = el.querySelector('.project-info');

        // Animación de revelado estilo Polaroid real al entrar en pantalla
        gsap.fromTo(photoMask,
          { y: '100%' }, // La foto empieza oculta por debajo del marco
          {
            y: '0%',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'top 40%',
              scrub: true
            }
          }
        );

        // Aparición suave del texto descriptivo
        gsap.fromTo(infoContent,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    });
  }

  openProject(link: string) {
    if (link && link !== '#') {
      window.open(link, '_blank');
    }
  }

  ngOnDestroy(): void {
    this.scrollCtx?.revert();
  }
}
