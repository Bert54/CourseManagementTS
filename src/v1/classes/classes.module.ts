import { Module } from '@nestjs/common';

import { ClassesController } from './controllers';
import { ClassesService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities';
import { ClassesDao } from './dao/classes.dao';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity])],
  controllers: [ClassesController],
  providers: [ClassesService, ClassesDao],
})
export class ClassesModule {}
