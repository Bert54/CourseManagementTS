import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PersonEntity } from '../entities';
import { UserAlreadyExistsError, UserNotFoundError } from '../errors';

@Injectable()
export class PeopleDao {
  constructor(
    @InjectRepository(PersonEntity)
    private peopleRepository: Repository<PersonEntity>,
  ) {}

  async save(person: PersonEntity): Promise<PersonEntity> {
    return await this.peopleRepository.save<PersonEntity>(person).catch(() => {
      throw new UserAlreadyExistsError(
        `Person with name '${person.name}' already exists`,
      );
    });
  }

  async findOneById(id: number): Promise<PersonEntity> {
    return await this.peopleRepository
      .findOneBy({
        id: id,
      })
      .then((person: PersonEntity) => {
        if (!person) {
          throw new UserNotFoundError(`Person with id '${id}' was not found`);
        }
        return person;
      });
  }

  async findOneByName(name: string): Promise<PersonEntity> {
    return await this.peopleRepository
      .findOneBy({
        name: name,
      })
      .then((person: PersonEntity) => {
        if (!person) {
          throw new UserNotFoundError(
            `Person with name '${name}' was not found`,
          );
        }
        return person;
      });
  }
}
