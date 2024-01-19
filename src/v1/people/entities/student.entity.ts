import { ChildEntity } from 'typeorm';

import { PersonEntity } from './person.entity';

@ChildEntity()
export class StudentEntity extends PersonEntity {
  constructor(name: string, role: string) {
    super(name, role);
  }
  getPermissions(): string[] {
    return ['student_tmp'];
  }
}
