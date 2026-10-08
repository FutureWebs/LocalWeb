import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject } from '@angular/core';
import { ConstellationComponent } from '../../components/constellation/constellation.component';
import { LabelComponent } from '../../components/label/label.component';
import { DATA_ENVIRONMENT } from '../../data-environment';
import { initReveals } from '../../services/anime.helpers';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-constellation-page',
  standalone: true,
  imports: [LabelComponent, ConstellationComponent],
  templateUrl: './constellation-page.component.html',
  styleUrls: ['./constellation-page.component.scss'],
})
export class ConstellationPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;

  readonly translator = inject(TranslationService);

  readonly content = computed(() => this.translator.localize(DATA_ENVIRONMENT.map));

  private cleanup: () => void = () => undefined;

  ngAfterViewInit(): void {
    this.cleanup = initReveals(this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
