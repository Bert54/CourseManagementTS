import { forwardRef, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';

import { RouteMapping } from './routes';
import { ErrorHandlerInterceptor } from './common/interceptors';
import { PeopleModule } from './people/people.module';
import { CoursesModule } from './courses/courses.module';
import { ClassesModule } from './classes/classes.module';
import { AuthorizationModule } from './common/modules/authorization/authorization.module';

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
