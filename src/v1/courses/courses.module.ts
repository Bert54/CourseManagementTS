import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoursesController } from './controllers';
import { CoursesService } from './services';
import { CoursesDao } from './dao';
import { CourseBaseEntity, CourseEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([CourseBaseEntity, CourseEntity])],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesDao],
})
export class CoursesModule {}
