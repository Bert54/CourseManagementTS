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
import { UnknownRoleError } from '../errors';

export class AddPersonDto extends AddPersonDtoBase {
  toPersonEntity(): PersonEntity {
    this.format();
    switch (this.role) {
      case PersonRolesEnum.Administrator:
        return new AdministratorEntity(this.name);
      case PersonRolesEnum.Teacher:
        return new TeacherEntity(this.name);
      case PersonRolesEnum.Student:
        return new StudentEntity(this.name);
    }
    throw new UnknownRoleError(`Unknown role: '${this.role}'`);
  }
}
