import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { PeopleService } from '../../../../people';
import { ForbiddenError } from '../../../errors';

@Injectable()
export class CheckPermissionService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private peopleService: PeopleService,
  ) {}

  hasPermission(personId: number, permission: string): Promise<boolean> {
    return this.peopleService.getPersonById(personId).then((person) => {
      if (!person.getPermissions().includes(permission)) {
        throw new ForbiddenError(
          `Person is not allowed to perform this action`,
        );
      }
      return true;
    });
  }
}
