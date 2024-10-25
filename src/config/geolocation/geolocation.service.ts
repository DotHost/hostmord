import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GeolocationService {
  private readonly geoApiUrl =
    'https://IPGeolocation-API.proxy-production.allthingsdev.co/ipgeo';
  private readonly networkApiUrl =
    'https://Network-IP-Finder-API.proxy-production.allthingsdev.co/?format=json';
  private readonly geoApiKey = process.env.ipKey;
  private readonly geoHeaders = {
    'x-apihub-key': process.env.apiHubKey,
    'x-apihub-host': 'IPGeolocation-API.allthingsdev.co',
    'x-apihub-endpoint': 'ffb70087-dbb2-4cf2-8a44-15d95f806ee3',
  };
  private readonly networkHeaders = {
    'x-apihub-key': process.env.apiHubKey,
    'x-apihub-host': 'Network-IP-Finder-API.allthingsdev.co',
    'x-apihub-endpoint': '970e51c9-0623-4dea-9608-d91853079f89',
  };
  private readonly currencyApiKey = process.env.currencyApiKey;

  // CurrencyFreaks API details
  private readonly currencyApiUrl =
    'https://CurrencyFreaks-API.proxy-production.allthingsdev.co/v2.0/rates/latest';
  private readonly currencyHeaders = {
    'x-apihub-key': process.env.apiHubKey,
    'x-apihub-host': 'CurrencyFreaks-API.allthingsdev.co',
    'x-apihub-endpoint': '9a64667c-09c4-4f6e-a311-2bd3699503eb',
  };

  constructor(private readonly httpService: HttpService) {}

  // Utility function to handle API requests with error catching
  private async fetchApi(url: string, headers: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }).pipe(
          catchError((error) => {
            console.error('API Request Failed:', error);
            throw new HttpException(
              'API Request Failed',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get geolocation data
  async getGeolocation(ipAddress: string): Promise<any> {
    const url = `${this.geoApiUrl}?ip=${ipAddress}&apiKey=${this.geoApiKey}`;
    return this.fetchApi(url, this.geoHeaders);
  }

  // Get network info
  async getNetworkInfo(): Promise<string> {
    // Return IP only
    const data = await this.fetchApi(this.networkApiUrl, this.networkHeaders);
    return data.ip;
  }

  // Get currency rate with parallel requests
  async getCurrencyRate(): Promise<any> {
    try {
      // Fetch both network info and geolocation in parallel
      const [ip, geoLocate] = await Promise.all([
        this.getNetworkInfo(),
        this.getGeolocation(await this.getNetworkInfo()),
      ]);

      const currencyCode = geoLocate.currency.code;
      const url = `${this.currencyApiUrl}?apikey=${this.currencyApiKey}&symbols=${currencyCode}`;

      const currencyData = await this.fetchApi(url, this.currencyHeaders);
      const exchangeRate = currencyData.rates;

      return {
        Location: geoLocate,
        Exchange_rate: exchangeRate,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch currency rate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
