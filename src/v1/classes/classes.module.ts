import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassesController } from './controllers';
import { ClassesService } from './services';
import { ClassEntity } from './entities';
import { ClassesDao } from './dao/classes.dao';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity])],
  controllers: [ClassesController],
  providers: [ClassesService, ClassesDao],
})
export class ClassesModule {}
