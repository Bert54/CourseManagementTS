import { ChildEntity } from 'typeorm';

import { PersonEntity } from './person.entity';
import { PERSON_ROLE_STUDENT } from '../constants';
import { CLASS_COURSE_FETCH, CLASS_JOIN } from '../../../common';

@ChildEntity(PERSON_ROLE_STUDENT)
export class StudentEntity extends PersonEntity {
  constructor(name: string, id?: number) {
    super(name, id);
  }

  getPermissions(): string[] {
    return [CLASS_JOIN, CLASS_COURSE_FETCH];
  }
}
