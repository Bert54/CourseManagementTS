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

  getPerson(options: Partial<GetUserOptionsInterface>): Promise<PersonEntity> {
    return this.peopleDao.findOne(options);
  }
}
