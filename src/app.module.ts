import { Module } from '@nestjs/common';
import { V1Module } from './v1';

@Module({
  imports: [
    V1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
