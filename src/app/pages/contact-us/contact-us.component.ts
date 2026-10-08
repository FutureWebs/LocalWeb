import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, computed, inject } from '@angular/core';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { DATA_ENVIRONMENT } from '../../data-environment';
import { initReveals } from '../../services/anime.helpers';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [PageHeaderComponent, ContactFormComponent],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;

  readonly translator = inject(TranslationService);
  readonly content = computed(() => this.translator.localize(DATA_ENVIRONMENT.contacto));

  private cleanup: () => void = () => undefined;

  ngAfterViewInit(): void {
    this.cleanup = initReveals(this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
