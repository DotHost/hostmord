import { Injectable, HttpStatus } from '@nestjs/common';
import { AuthHelper } from 'src/helpers';
import { handleResponse } from 'src/common/filters/responseHandler';

@Injectable()
export class UsersService {
  constructor(private readonly authServiceHelper: AuthHelper) {}

  async getProfile(userId: string) {
    const user = await this.authServiceHelper.validateUser(userId);

    if (!user) {
      throw new handleResponse(
        HttpStatus.UNAUTHORIZED,
        'User session not authorized',
      );
    }

    const sanitizedUser = this.authServiceHelper.sanitizeUser(user);

    return new handleResponse(
      HttpStatus.OK,
      'User found',
      sanitizedUser,
    ).getResponse();
  }
}
