import { Module } from '@nestjs/common';
import { PeopleModule } from './people';
import { RouterModule } from '@nestjs/core';
import { RouteMapping } from './routes';

@Module({
  imports: [
    PeopleModule,
    RouterModule.register(RouteMapping),
  ],
  controllers: [],
  providers: [],
})
export class V1Module {
}
