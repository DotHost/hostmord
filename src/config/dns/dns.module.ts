import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DNSService } from './dns.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [DNSService],
  exports: [DNSService],
})
export class DNSModule {}
