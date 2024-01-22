import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

import { CheckPermissionService } from './check-permission.service';
import { CheckPermission } from './check-permission.decorator';
import {
  BadRequestError,
  handleError,
  UnauthorizedError,
} from '../../../errors';

const headerWithPersonId: string = 'x-personid';

@Injectable()
export class CheckPermissionGuard implements CanActivate {
  constructor(
    private permissionService: CheckPermissionService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissionToCheck: string = this.reflector.get(
      CheckPermission,
      context.getHandler(),
    );
    if (!permissionToCheck) {
      return true;
    }
    const personIdToCheckStr = context.switchToHttp().getRequest().headers[
      headerWithPersonId
    ];
    if (!personIdToCheckStr) {
      throw handleError(new UnauthorizedError('No person ID provided'));
    }
    const personIdToCheck = Number(personIdToCheckStr);
    if (isNaN(personIdToCheck)) {
      throw handleError(new BadRequestError('Invalid person ID provided'));
    }

    return this.permissionService
      .hasPermission(personIdToCheck, permissionToCheck)
      .catch((error) => {
        throw handleError(error);
      });
  }
}
