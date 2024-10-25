import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { DnsRecordType } from 'src/helpers';
import { handleResponse } from 'src/common';

@Injectable()
export class DNSService {
  private readonly sslApiUrl =
    'https://WhoisFreaks-API.proxy-production.allthingsdev.co/v1.0/ssl/live';
  private readonly dnsApiUrl =
    'https://WhoisFreaks-API.proxy-production.allthingsdev.co/v2.0/dns/live';
  private readonly apiKey = process.env.dnsKey;
  private readonly headers = {
    'x-apihub-key': process.env.apiHubKey,
    'x-apihub-host': 'WhoisFreaks-API.allthingsdev.co',
    'x-apihub-endpoint': '65c2cd33-f407-47c7-9414-33c0e13519c6',
  };

  constructor(private readonly httpService: HttpService) {}

  async getSslInfo(domainName: string) {
    const url = `${this.sslApiUrl}?apiKey=${this.apiKey}&domainName=${domainName}&chain=true&sslRaw=true`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers: this.headers }),
      );
      return new handleResponse(
        HttpStatus.OK,
        'SSL Certificate Found',
        response.data,
      ).getResponse();
    } catch (error) {
      throw new handleResponse(
        HttpStatus.NOT_FOUND,
        'SSL Certificate Not Found',
      );
      //console.error('Error fetching SSL info:', error);
      //throw error;
    }
  }

  async getDnsInfo(
    domainName: string,
    type: DnsRecordType = DnsRecordType.ALL,
  ) {
    const url = `${this.dnsApiUrl}?apiKey=${this.apiKey}&domainName=${domainName}&type=${type}&ipAddress=`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers: this.headers }),
      );
      return new handleResponse(
        HttpStatus.OK,
        'DNS Records Found',
        response.data,
      ).getResponse();
    } catch (error) {
      throw new handleResponse(HttpStatus.NOT_FOUND, 'DNS Records Not Found');
      //console.error('Error fetching DNS info:', error);
      //throw error;
    }
  }
}
