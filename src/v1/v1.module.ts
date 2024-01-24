import { forwardRef, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';

import { PeopleModule } from './people';
import { RouteMapping } from './routes';
import { CoursesModule } from './courses';
import { AuthorizationModule, ErrorHandlerInterceptor } from './common';
import { ClassesModule } from './classes';

@Module({
  imports: [
    PeopleModule,
    CoursesModule,
    ClassesModule,
    forwardRef(() => AuthorizationModule),
    RouterModule.register(RouteMapping),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorHandlerInterceptor,
    },
  ],
})
export class V1Module {}
