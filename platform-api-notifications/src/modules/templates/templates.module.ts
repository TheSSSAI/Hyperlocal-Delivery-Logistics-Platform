import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { TemplatesRepository } from './templates.repository';
import { Template } from './entities/template.entity';
import { ITemplatesRepository } from './interfaces/templates-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  providers: [
    TemplatesService,
    {
      provide: ITemplatesRepository,
      useClass: TemplatesRepository,
    },
  ],
  exports: [TemplatesService],
})
export class TemplatesModule {}