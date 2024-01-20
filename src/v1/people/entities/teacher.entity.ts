import { ChildEntity } from 'typeorm';

import { PersonEntity } from './person.entity';
import { PERSON_ROLE_TEACHER } from '../constants';

@ChildEntity(PERSON_ROLE_TEACHER)
export class TeacherEntity extends PersonEntity {
  constructor(name: string, id?: number) {
    super(name, id);
  }

  getPermissions(): string[] {
    return ['teacher_tmp'];
  }
}
