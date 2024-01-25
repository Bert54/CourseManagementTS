import { Injectable } from '@nestjs/common';

import { AddPersonDtoBase } from '../dto';
import { PersonEntity } from '../entities';
import { PeopleDao } from '../dao';
import { GetUserOptionsInterface } from '../interfaces';

@Injectable()
export class PeopleService {
  constructor(private peopleDao: PeopleDao) {}

  addPerson(addPersonDto: AddPersonDtoBase): Promise<PersonEntity> {
    let personEntity: PersonEntity;
    try {
      personEntity = addPersonDto.toPersonEntity();
    } catch (error) {
      return new Promise<PersonEntity>(() => {
        throw error;
      });
    }

    return this.peopleDao.save(personEntity);
  }

  async getPerson(
    options: Partial<GetUserOptionsInterface>,
  ): Promise<PersonEntity> {
    return await this.peopleDao.findOne(options).then((person) => {
      // transfer classes gotten from memberships directly into the person object
      person.classes = [];
      person.memberships.forEach((membership) =>
        person.classes.push(membership.class_info),
      );
      return person;
    });
  }
}
