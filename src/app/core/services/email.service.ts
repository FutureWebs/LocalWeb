import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment'; // Asegúrate de que apunte a tu environment

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
      // 1. Envío principal con EmailJS
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

      // 2. Respaldo a Telegram (usando las variables inyectadas de forma segura)
      this.sendTelegramNotification(formData);

      return true;
    } catch (error) {
      console.error('Error al enviar el email:', error);
      return false;
    }
  }

  private sendTelegramNotification(formData: ContactFormData) {
    const token = (environment as any).telegramBotToken;
    const chatId = (environment as any).telegramChatId;

    if (!token || !chatId) return; // Si no están configuradas (ej. en desarrollo local), se omite sin romper nada

    const text = `📩 *Nuevo mensaje de FutureWebs*%0A👤 *Nombre:* ${formData.nombreCompleto}%0A📧 *Email:* ${formData.correo}%0A💬 *Mensaje:* ${formData.mensaje}`;

    fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=Markdown`)
      .catch(err => console.log('Telegram backup notification skipped', err));
  }
}
