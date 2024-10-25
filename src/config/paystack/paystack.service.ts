import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { handleResponse } from 'src/common';

@Injectable()
export class PaystackService {
  private readonly paystackSecret = process.env.PAYSTACK_SECRET_KEY;

  constructor(private readonly httpService: HttpService) {}

  // Create Paystack Customer
  async createPaystackCustomer(
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
  ): Promise<any> {
    try {
      if (!this.paystackSecret) {
        throw new InternalServerErrorException('Paystack secret key not set');
      }

      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paystack.co/customer',
          { email, first_name: firstName, last_name: lastName, phone },
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecret}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (![HttpStatus.OK, HttpStatus.CREATED].includes(response.status)) {
        throw new InternalServerErrorException(
          'Error creating Paystack customer',
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error creating Paystack customer:',
        error.response?.data || error.message,
      );
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Unauthorized request to Paystack');
      }
      throw new handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating Paystack customer',
        error.response?.data || error.message,
      );
    }
  }

  // Create Dedicated Account
  async createDedicatedAccount(customerCode: string): Promise<any> {
    try {
      if (!this.paystackSecret) {
        throw new InternalServerErrorException('Paystack secret key not set');
      }

      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paystack.co/dedicated_account',
          {
            customer: customerCode,
            preferred_bank: 'titan-paystack', // Replace with your preferred bank
          },
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecret}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (![HttpStatus.OK, HttpStatus.CREATED].includes(response.status)) {
        throw new InternalServerErrorException(
          'Error creating Paystack dedicated account',
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error creating dedicated account:',
        error.response?.data || error.message,
      );
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Unauthorized request to Paystack');
      }
      throw new handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating Paystack dedicated account',
        error.response?.data || error.message,
      );
    }
  }

  // Retrieve Dedicated Account
  async retrieveDedicatedAccount(customerCode: string): Promise<any> {
    try {
      if (!this.paystackSecret) {
        throw new InternalServerErrorException('Paystack secret key not set');
      }

      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.paystack.co/dedicated_account/${customerCode}`,
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecret}`,
            },
          },
        ),
      );

      if (![HttpStatus.OK].includes(response.status)) {
        throw new InternalServerErrorException(
          'Error retrieving Paystack dedicated account',
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error retrieving dedicated account:',
        error.response?.data || error.message,
      );
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Unauthorized request to Paystack');
      }
      throw new handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error retrieving Paystack dedicated account',
        error.response?.data || error.message,
      );
    }
  }

  // Retrieve Customer Code by Email
  async retrieveCustomerCode(email: string): Promise<any> {
    try {
      if (!this.paystackSecret) {
        throw new InternalServerErrorException('Paystack secret key not set');
      }

      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.paystack.co/customer?email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecret}`,
            },
          },
        ),
      );

      if (![HttpStatus.OK].includes(response.status)) {
        throw new InternalServerErrorException(
          'Error retrieving Paystack customer code',
        );
      }

      const customer = response.data.data[0];
      return customer.customer_code;
    } catch (error) {
      console.error(
        'Error retrieving customer code:',
        error.response?.data || error.message,
      );
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Unauthorized request to Paystack');
      }
      throw new handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error retrieving Paystack customer code',
        error.response?.data || error.message,
      );
    }
  }

  // Initialize Transaction
  async initializeTransaction(
    email: string,
    amount: number,
    currency: string,
  ): Promise<any> {
    try {
      if (!this.paystackSecret) {
        throw new InternalServerErrorException('Paystack secret key not set');
      }

      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paystack.co/transaction/initialize',
          {
            email,
            amount: amount * 100, // Amount in kobo
            currency,
          },
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecret}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (![HttpStatus.OK, HttpStatus.CREATED].includes(response.status)) {
        throw new handleResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Error initializing transaction',
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error initializing transaction:',
        error.response?.data || error.message,
      );
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Unauthorized request to Paystack');
      }
      throw new handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error initializing transaction',
        error.response?.data || error.message,
      );
    }
  }

  // Verify Transaction
  async verifyTransaction(reference: string): Promise<any> {
    try {
      if (!this.paystackSecret) {
        throw new InternalServerErrorException('Paystack secret key not set');
      }

      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecret}`,
            },
          },
        ),
      );

      if (![HttpStatus.OK].includes(response.status)) {
        throw new handleResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Error verifying transaction',
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error verifying transaction:',
        error.response?.data || error.message,
      );
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Unauthorized request to Paystack');
      }
      throw new handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error verifying transaction',
        error.response?.data || error.message,
      );
    }
  }
}
