import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { handleResponse } from 'src/common';

@Injectable()
export class WhoisService {
  private readonly whoisurl = process.env.WHOIS_CHECKER;

  constructor(private readonly httpService: HttpService) {}

  async getDomainData(domain: string): Promise<any> {
    // Reference this.whoisurl to access the class property
    const url = `${this.whoisurl}/${domain}`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new handleResponse(HttpStatus.NOT_FOUND, 'Domain is Available');
      //console.error(`Failed to fetch domain data: ${error.message}`);
      //throw new Error('Could not fetch domain data');
    }
  }
}
