import { forwardRef, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';

import { PeopleModule } from './people';
import { RouteMapping } from './routes';
import { CoursesModule } from './courses';
import { ClassesModule } from './classes';
import { AuthorizationModule } from './common/modules/authorization';
import { ErrorHandlerInterceptor } from './common/interceptors';

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
