import { PersonEntity } from './person.entity';
import { ChildEntity } from 'typeorm';

@ChildEntity()
export class TeacherEntity extends PersonEntity {
  constructor(name: string, role: string) {
    super(name, role);
  }

  getPermissions(): string[] {
    return ['teacher_tmp'];
  }
}
