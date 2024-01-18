import { PersonEntity } from './person.entity';

export class StudentEntity extends PersonEntity {
  getPermissions(): string[] {
    return ['student_tmp'];
  }
}
