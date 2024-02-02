import { IsNotEmpty, IsString, Length } from 'class-validator';

import {
  AdministratorEntity,
  PersonEntity,
  StudentEntity,
  TeacherEntity,
} from '../entities';
import { PersonRolesEnum } from '../enums';
import { UnknownRoleError } from '../errors';

export class AddPersonDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  format(): void {
    this.name = this.name.trim();
    this.role = this.role.trim().toLowerCase();
  }

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
