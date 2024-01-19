import { ChildEntity } from 'typeorm';

import { PersonEntity } from './person.entity';
import { PERSON_ROLE_STUDENT } from '../constants';

@ChildEntity(PERSON_ROLE_STUDENT)
export class StudentEntity extends PersonEntity {
  constructor(name: string) {
    super(name);
  }
  getPermissions(): string[] {
    return ['student_tmp'];
  }
}
