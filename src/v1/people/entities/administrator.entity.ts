import { ChildEntity } from 'typeorm';

import { PersonEntity } from './person.entity';
import { PERSON_ROLE_ADMINISTRATOR } from '../constants';
import { CLASS_CREATE, CLASS_DELETE } from '../../../common';

@ChildEntity(PERSON_ROLE_ADMINISTRATOR)
export class AdministratorEntity extends PersonEntity {
  constructor(name: string, id?: number) {
    super(name, id);
  }

  getPermissions(): string[] {
    return [CLASS_CREATE, CLASS_DELETE];
  }
}
