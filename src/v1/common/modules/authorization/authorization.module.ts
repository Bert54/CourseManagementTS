import { forwardRef, Global, Module } from '@nestjs/common';

import {
  CheckPermissionGuard,
  CheckPermissionService,
} from './check-permission';
import { PeopleModule } from '../../../people/people.module';

@Global()
@Module({
  imports: [forwardRef(() => PeopleModule)],
  providers: [CheckPermissionGuard, CheckPermissionService],
  exports: [CheckPermissionService],
})
export class AuthorizationModule {}
