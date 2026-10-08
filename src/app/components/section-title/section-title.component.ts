import { Component, Input } from '@angular/core';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [LabelComponent],
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss'],
})
export class SectionTitleComponent {
  @Input({ required: true }) title = '';
  @Input() kicker = '';
  @Input() subtitle = '';
  @Input() align: 'left' | 'center' = 'left';
}
