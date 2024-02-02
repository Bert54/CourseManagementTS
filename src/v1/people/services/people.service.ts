import { Injectable } from '@nestjs/common';

import { AddPersonDto } from '../dto';
import { PersonEntity } from '../entities';
import { PeopleDao } from '../dao';
import { GetUserOptionsInterface } from '../interfaces';
import { PeopleRelationsEnum } from '../enums';

@Injectable()
export class PeopleService {
  constructor(private peopleDao: PeopleDao) {}

  addPerson(addPersonDto: AddPersonDto): Promise<PersonEntity> {
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
    relations?: PeopleRelationsEnum[],
  ): Promise<PersonEntity> {
    return await this.peopleDao.findOne(options, relations).then((person) => {
      // transfer classes gotten from memberships directly into the person object if possible
      if (
        !!relations &&
        relations.includes(PeopleRelationsEnum.Memberships) &&
        relations.includes(PeopleRelationsEnum.Memberships_ClassInfo)
      ) {
        person.classes = [];
        person.memberships.forEach((membership) =>
          person.classes.push(membership.class_info),
        );
      }
      return person;
    });
  }
}
