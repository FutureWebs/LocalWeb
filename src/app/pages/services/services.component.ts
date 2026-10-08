import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { DATA_ENVIRONMENT } from '../../data-environment';
import { initReveals } from '../../services/anime.helpers';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;

  readonly translator = inject(TranslationService);
  readonly content = computed(() => this.translator.localize(DATA_ENVIRONMENT.servicios));

  private cleanup: () => void = () => undefined;

  ngAfterViewInit(): void {
    this.cleanup = initReveals(this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
