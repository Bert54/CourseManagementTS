import { AddPersonDtoBase } from './add-person-base.dto';
import {
  AdministratorEntity,
  PersonEntity,
  StudentEntity,
  TeacherEntity,
} from '../entities';
import { PersonRolesEnum } from '../enums';
import {
  PERSON_ROLE_ADMINISTRATOR,
  PERSON_ROLE_STUDENT,
  PERSON_ROLE_TEACHER,
} from '../constants';

export class AddPersonDto extends AddPersonDtoBase {
  toPersonEntity(): PersonEntity {
    switch (this.role) {
      case PersonRolesEnum.Administrator:
        return new AdministratorEntity(this.name, PERSON_ROLE_ADMINISTRATOR);
      case PersonRolesEnum.Teacher:
        return new TeacherEntity(this.name, PERSON_ROLE_TEACHER);
      case PersonRolesEnum.Student:
        return new StudentEntity(this.name, PERSON_ROLE_STUDENT);
    }
    throw new Error(`Unknown role: ${this.role}`);
  }
}
