import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

export interface ContactFormData {
  nombreCompleto: string;
  correo: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly SERVICE_ID = 'service_m9bdz6h';
  private readonly TEMPLATE_ID = 'template_d8wt22v';
  private readonly PUBLIC_KEY = 'sDRdYX3uylxg3MajX';

  constructor() {
    emailjs.init(this.PUBLIC_KEY);
  }

  async sendEmail(formData: ContactFormData): Promise<boolean> {
    try {
      const templateParams = {
        from_name: formData.nombreCompleto,
        from_email: formData.correo,
        message: formData.mensaje,
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams
      );

      console.log('Email enviado exitosamente:', response);
      return true;
    } catch (error) {
      console.error('Error al enviar el email:', error);
      return false;
    }
  }
}
