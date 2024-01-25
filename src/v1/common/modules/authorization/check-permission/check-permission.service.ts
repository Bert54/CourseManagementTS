import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { PeopleService } from '../../../../people';
import { ForbiddenError } from '../../../errors';

@Injectable()
export class CheckPermissionService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private peopleService: PeopleService,
  ) {}

  async hasPermission(personId: number, permission: string): Promise<boolean> {
    const person = await this.peopleService.getPerson({
      id: personId,
    });
    if (!person.getPermissions().includes(permission)) {
      throw new ForbiddenError(`Person is not allowed to perform this action`);
    }
    return true;
  }
}
