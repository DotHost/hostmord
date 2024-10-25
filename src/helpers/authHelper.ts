import { Injectable, Global } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { countries } from 'countries-list';
import { GeoLocationRecord } from '@prisma/client';

@Global()
@Injectable()
export class AuthHelper {
  constructor(private readonly prisma: PrismaService) {}

  async hashData(data: string) {
    return await argon.hash(data);
  }

  async generateOTP(length: number = 4) {
    return Array.from({ length }, () =>
      Math.random().toString(36).charAt(2),
    ).join('');
  }

  async fetchUserByIdentifier(identifier: string) {
    const searchCriteria = {
      OR: [
        { email: identifier },
        { telephone: identifier },
        { username: identifier },
        { userid: identifier },
      ],
    };
    return await this.prisma.user.findFirst({
      where: searchCriteria,
    });
  }

  async updateUser(
    id: any,
    data: Partial<{
      otp: string;
      isVerified: boolean;
      isActive: boolean;
      otpExpiry: Date;
      password: string;
      confirm_password: string;
      token: string;
    }>,
  ) {
    return await this.prisma.user.update({
      where: { userid: id },
      data,
    });
  }

  async validateUser(userId: string) {
    return await this.prisma.user.findUnique({
      where: { userid: userId },
    });
  }

  sanitizeUser(user: any) {
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    delete sanitizedUser.confirm_password;
    delete sanitizedUser.otp;
    delete sanitizedUser.otpExpiry;
    delete sanitizedUser.fingerprint;
    delete sanitizedUser.token;
    return sanitizedUser;
  }

  async upsertGeolocation(
    userid: string,
    data: any,
  ): Promise<GeoLocationRecord> {
    const {
      geoname_id,
      isp,
      connection_type,
      organization,
      country_emoji,
      currency,
      time_zone,
    } = data;

    // Check if the geolocation record already exists for this userid
    const existingGeolocation = await this.prisma.geoLocationRecord.findUnique({
      where: { userid },
    });

    if (existingGeolocation) {
      // If geolocation exists, update the related currency and timezone, then update geolocation
      await this.prisma.currency.update({
        where: { id: existingGeolocation.currencyid },
        data: {
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
        },
      });

      await this.prisma.timeZone.update({
        where: { id: existingGeolocation.timeZoneId },
        data: {
          name: time_zone.name,
          offset: time_zone.offset,
          offsetWithDst: time_zone.offset_with_dst,
          currentTime: new Date(time_zone.current_time),
          currentTimeUnix: time_zone.current_time_unix,
          isDst: time_zone.is_dst,
          dstSavings: time_zone.dst_savings,
          dstExists: time_zone.dst_exists,
          dstStart: time_zone.dst_start || null,
          dstEnd: time_zone.dst_end || null,
        },
      });

      const updatedGeolocation = await this.prisma.geoLocationRecord.update({
        where: { userid },
        data: {
          geonameId: geoname_id,
          isp,
          connectionType: connection_type || null,
          organization,
          countryEmoji: country_emoji,
        },
      });

      return updatedGeolocation;
    } else {
      // If geolocation does not exist, create new currency, timezone, and geolocation records
      const newCurrency = await this.prisma.currency.create({
        data: {
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
        },
      });

      const newTimeZone = await this.prisma.timeZone.create({
        data: {
          name: time_zone.name,
          offset: time_zone.offset,
          offsetWithDst: time_zone.offset_with_dst,
          currentTime: new Date(time_zone.current_time),
          currentTimeUnix: time_zone.current_time_unix,
          isDst: time_zone.is_dst,
          dstSavings: time_zone.dst_savings,
          dstExists: time_zone.dst_exists,
          dstStart: time_zone.dst_start || null,
          dstEnd: time_zone.dst_end || null,
        },
      });

      const newGeolocation = await this.prisma.geoLocationRecord.create({
        data: {
          userid,
          geonameId: geoname_id,
          isp,
          connectionType: connection_type || null,
          organization,
          countryEmoji: country_emoji,
          currencyid: newCurrency.id,
          timeZoneId: newTimeZone.id,
        },
      });

      return newGeolocation;
    }
  }

  getCountryPhoneCode = (countryName: string): string => {
    // Normalize country name to ensure case-insensitive matching
    const normalizedCountryName = countryName.toLowerCase();

    // Loop through countries to find the phone code
    for (const countryCode in countries) {
      const countryData = countries[countryCode];

      // Check if the name matches (either the native or English name)
      if (
        countryData.name.toLowerCase() === normalizedCountryName ||
        (countryData.native &&
          countryData.native.toLowerCase() === normalizedCountryName)
      ) {
        // Return the phone code without a plus sign
        return `${countryData.phone}`;
      }
    }

    // If no match is found, throw an error
    throw new Error(`Phone code for country "${countryName}" not found.`);
  };

  generateUniqueRandomNumber = (): number => {
    const digits: number[] = [];

    while (digits.length < 5) {
      const randomDigit = Math.floor(Math.random() * 10);

      // Ensure the digit is unique in the array
      if (!digits.includes(randomDigit)) {
        digits.push(randomDigit);
      }
    }

    // Join the digits and convert to a number
    return parseInt(digits.join(''), 10);
  };
}
