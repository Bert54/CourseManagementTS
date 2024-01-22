import { Module } from '@nestjs/common';

import { PeopleModule } from '../people';
import { CoursesController } from './controllers';

@Module({
  imports: [PeopleModule],
  controllers: [CoursesController],
})
export class CoursesModule {}
