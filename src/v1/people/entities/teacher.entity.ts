import { ChildEntity } from 'typeorm';

import { PersonEntity } from './person.entity';
import { PERSON_ROLE_TEACHER } from '../constants';
import {
  CLASS_COURSE_FETCH,
  CLASS_JOIN,
  COURSE_CREATE,
  COURSE_FETCH,
} from '../../../common';

@ChildEntity(PERSON_ROLE_TEACHER)
export class TeacherEntity extends PersonEntity {
  constructor(name: string, id?: number) {
    super(name, id);
  }

  getPermissions(): string[] {
    return [COURSE_CREATE, COURSE_FETCH, CLASS_JOIN, CLASS_COURSE_FETCH];
  }
}
