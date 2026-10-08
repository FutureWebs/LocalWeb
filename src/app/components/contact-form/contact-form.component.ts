import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { animate } from 'animejs';
import { DATA_ENVIRONMENT } from '../../data-environment';
import { prefersReducedMotion } from '../../services/anime.helpers';
import { EmailService } from '../../services/email.service';
import { TranslationService } from '../../services/translation.service';
import { ButtonComponent } from '../button/button.component';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';
type FieldName = 'name' | 'email' | 'message';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, ButtonComponent],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent {
  @ViewChild('statusBox', { static: false }) statusBox!: ElementRef<HTMLDivElement>;

  private readonly fb = inject(FormBuilder);
  private readonly emailService = inject(EmailService);

  readonly translator = inject(TranslationService);
  readonly ui = DATA_ENVIRONMENT.contacto.form;
  readonly status = signal<FormStatus>('idle');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  showError(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  errorFor(field: FieldName): string | null {
    if (!this.showError(field)) return null;

    const control = this.form.controls[field];
    if (control.errors?.['required']) return this.translator.pick(this.ui.required);
    if (control.errors?.['email']) return this.translator.pick(this.ui.invalidEmail);
    if (control.errors?.['minlength']) return this.translator.pick(this.ui.minLength);
    return null;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.shakeInvalid();
      return;
    }

    this.status.set('sending');

    const payload = this.form.getRawValue();
    const sent = await this.emailService.sendEmail({
      name: payload.name,
      email: payload.email,
      message: payload.message,
    });

    if (sent) {
      this.form.reset({ name: '', email: '', message: '' });
      this.status.set('success');
    } else {
      this.status.set('error');
    }

    this.animateStatus();
  }

  private shakeInvalid(): void {
    if (prefersReducedMotion()) return;

    const invalid = Array.from(
      document.querySelectorAll<HTMLElement>('.field.is-invalid .field__control'),
    );
    if (!invalid.length) return;

    animate(invalid, {
      x: [
        { to: -7 },
        { to: 7 },
        { to: -4 },
        { to: 0 },
      ],
      duration: 420,
      ease: 'outQuad',
      overwrite: true,
    });
  }

  private animateStatus(): void {
    setTimeout(() => {
      const box = this.statusBox?.nativeElement;
      if (!box || prefersReducedMotion()) return;
      animate(box, {
        opacity: { from: 0, to: 1 },
        y: { from: -12, to: 0 },
        duration: 460,
        ease: 'outBack',
        overwrite: true,
      });
    }, 0);
  }
}
