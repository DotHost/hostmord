import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MetaService {
  private readonly accessToken = process.env.WHATSAPP_API_TOKEN;
  private readonly version = process.env.WHATSAPP_VERSION;
  private readonly phoneId = process.env.PHONE_NUMBER_ID;
  constructor(private readonly httpService: HttpService) {}

  async sendMessage(to: string, template_name: any): Promise<any> {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template_name,
        language: {
          code: 'en',
        },
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `https://graph.facebook.com/${this.version}/${this.phoneId}/messages`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to send message',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
