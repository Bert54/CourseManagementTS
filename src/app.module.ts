import { Module } from '@nestjs/common';
import { PeopleModule } from './people';

@Module({
  imports: [PeopleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
