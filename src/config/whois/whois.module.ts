import { Global, Module } from '@nestjs/common';
import { WhoisService } from './whois.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [WhoisService],
  exports: [WhoisService],
})
export class WhoisModule {}
