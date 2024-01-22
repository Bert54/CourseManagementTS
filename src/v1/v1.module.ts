import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { PeopleModule } from './people';
import { RouteMapping } from './routes';
import { CoursesModule } from './courses';

@Module({
  imports: [PeopleModule, CoursesModule, RouterModule.register(RouteMapping)],
  controllers: [],
  providers: [],
})
export class V1Module {}
