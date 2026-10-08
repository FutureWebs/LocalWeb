import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { DATA_ENVIRONMENT } from '../../data-environment';
import { initReveals } from '../../services/anime.helpers';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [PageHeaderComponent, SectionTitleComponent, CardComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;

  readonly translator = inject(TranslationService);
  readonly content = computed(() => this.translator.localize(DATA_ENVIRONMENT.equipo));

  private cleanup: () => void = () => undefined;

  ngAfterViewInit(): void {
    this.cleanup = initReveals(this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
