import { Module } from '@nestjs/common';
import { PeopleController } from './controllers';
import { PeopleService } from './services';

@Module({
  imports: [],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
