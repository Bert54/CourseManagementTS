import { PersonEntity } from './person.entity';
import { ChildEntity } from 'typeorm';

@ChildEntity()
export class StudentEntity extends PersonEntity {
  constructor(name: string, role: string) {
    super(name, role);
  }
  getPermissions(): string[] {
    return ['student_tmp'];
  }
}
