import { ChildEntity } from 'typeorm';

import { PersonEntity } from './person.entity';
import { PERSON_ROLE_ADMINISTRATOR } from '../constants';

@ChildEntity(PERSON_ROLE_ADMINISTRATOR)
export class AdministratorEntity extends PersonEntity {
  constructor(name: string) {
    super(name);
  }

  getPermissions(): string[] {
    return ['administrator_tmp'];
  }
}
