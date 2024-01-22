import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleController } from './controllers';
import { PeopleService } from './services';
import {
  AdministratorEntity,
  PersonEntity,
  StudentEntity,
  TeacherEntity,
} from './entities';
import { PeopleDao } from './dao';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonEntity,
      TeacherEntity,
      StudentEntity,
      AdministratorEntity,
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService, PeopleDao],
  exports: [PeopleService],
})
export class PeopleModule {}
