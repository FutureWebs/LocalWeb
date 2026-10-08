import { Component, Input } from '@angular/core';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [LabelComponent],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() kicker = '';
  @Input() subtitle = '';
}
