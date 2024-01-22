import { forwardRef, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { PeopleModule } from './people';
import { RouteMapping } from './routes';
import { CoursesModule } from './courses';
import { AuthorizationModule } from './common';

@Module({
  imports: [
    PeopleModule,
    CoursesModule,
    forwardRef(() => AuthorizationModule),
    RouterModule.register(RouteMapping),
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
