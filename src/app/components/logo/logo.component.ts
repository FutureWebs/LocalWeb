import { Component, Input } from '@angular/core';
import { DATA_ENVIRONMENT } from '../../data-environment';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  @Input() name: string = DATA_ENVIRONMENT.brand.name;
}
