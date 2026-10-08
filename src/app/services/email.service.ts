import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../data-environment';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor() {
    emailjs.init(EMAIL_CONFIG.publicKey);
  }

  async sendEmail(payload: ContactPayload): Promise<boolean> {
    try {
      const templateParams = {
        from_name: payload.name,
        from_email: payload.email,
        message: payload.message,
      };

      await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams);
      return true;
    } catch (error) {
      console.error('Error al enviar el email:', error);
      return false;
    }
  }
}
