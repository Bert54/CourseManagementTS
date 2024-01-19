import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { AddPersonDtoBase } from '../dto';
import { PersonEntity } from '../entities';
import { UserAlreadyExistsError } from '../errors';
import { PeopleDao } from '../dao';

@Injectable()
export class PeopleService {
  getHello(): string {
    return 'Hello World!';
  }

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

  getPersonById(id: number): Promise<PersonEntity> {
    return this.peopleDao.findOneById(id);
  }

  getPersonByName(name: string): Promise<PersonEntity> {
    return this.peopleDao.findOneByName(name);
  }
}
