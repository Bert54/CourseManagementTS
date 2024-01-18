import { PersonEntity } from './person.entity';

export class TeacherEntity extends PersonEntity {
  constructor(name: string, role: number) {
    super(name, role);
  }

  getPermissions(): string[] {
    return ['teacher_tmp'];
  }
}
