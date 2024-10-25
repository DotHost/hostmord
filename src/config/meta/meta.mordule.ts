import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MetaService } from './meta.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [MetaService],
  exports: [MetaService],
})
export class MetaModule {}
