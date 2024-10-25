import { Global, Module } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
