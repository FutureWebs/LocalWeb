import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { EmailService, ContactFormData } from '../../core/services/email.service';

@Component({
  selector: 'app-contact-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './contact-footer.component.html',
  styleUrls: ['./contact-footer.component.scss']
})
export class ContactFooterComponent {
  private emailService = inject(EmailService);

  formData: ContactFormData = {
    nombreCompleto: '',
    correo: '',
    mensaje: ''
  };

  isSubmitting = false;
  successMessage = false;
  errorMessage = false;

  async onSubmit() {
    if (!this.formData.nombreCompleto || !this.formData.correo || !this.formData.mensaje) return;

    this.isSubmitting = true;
    this.successMessage = false;
    this.errorMessage = false;

    const sent = await this.emailService.sendEmail(this.formData);

    if (sent) {
      this.successMessage = true;
      this.formData = { nombreCompleto: '', correo: '', mensaje: '' };
    } else {
      this.errorMessage = true;
    }

    this.isSubmitting = false;
  }
}
