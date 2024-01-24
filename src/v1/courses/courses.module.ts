import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoursesController } from './controllers';
import { CoursesService } from './services';
import { CoursesDao } from './dao';
import { CourseEntity } from './entities';
import { ClassesModule } from '../classes';

@Module({
  imports: [ClassesModule, TypeOrmModule.forFeature([CourseEntity])],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesDao],
})
export class CoursesModule {}
