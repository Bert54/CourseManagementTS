import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ForbiddenError } from '../../../errors';
import { PeopleService } from '../../../../people/services';
import { PersonEntity } from '../../../../people/entities';

@Injectable()
export class CheckPermissionService {
  constructor(
    @Inject(forwardRef(() => PeopleService))
    private peopleService: PeopleService,
  ) {}

  async hasPermission(personId: number, permission: string): Promise<boolean> {
    return await this.peopleService
      .getPerson({
        id: personId,
      })
      .then((person: PersonEntity) => {
        if (!person.getPermissions().includes(permission)) {
          throw new ForbiddenError(
            `Person is not allowed to perform this action`,
          );
        }
        return true;
      });
  }
}
