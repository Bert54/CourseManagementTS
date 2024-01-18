import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleController } from './controllers';
import { PeopleService } from './services';
import { PersonEntity } from './entities';
import { PeopleDao } from './dao';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity])],
  controllers: [PeopleController],
  providers: [PeopleService, PeopleDao],
})
export class PeopleModule {}
