import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PersonEntity } from '../entities';
import { PersonAlreadyExistsError, PersonNotFoundError } from '../errors';
import { LoggerService } from '../../../common';

@Injectable()
export class PeopleDao {
  constructor(
    @InjectRepository(PersonEntity)
    private peopleRepository: Repository<PersonEntity>,
    private logger: LoggerService,
  ) {}

  async save(person: PersonEntity): Promise<PersonEntity> {
    return await this.peopleRepository
      .save<PersonEntity>(person)
      .catch((error) => {
        this.logger.log(
          `Could not save new person [error: '${error.message}']`,
        );
        throw new PersonAlreadyExistsError(
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
          throw new PersonNotFoundError(`Person with id '${id}' was not found`);
        }
        return person;
      })
      .catch((error) => {
        this.logger.log(
          `Could not fetch person using id [error: '${error.message}']`,
        );
        throw error;
      });
  }

  async findOneByName(name: string): Promise<PersonEntity> {
    return await this.peopleRepository
      .findOneBy({
        name: name,
      })
      .then((person: PersonEntity) => {
        if (!person) {
          throw new PersonNotFoundError(
            `Person with name '${name}' was not found`,
          );
        }
        return person;
      })
      .catch((error) => {
        this.logger.warn(
          `Could not fetch person using name [error: '${error.message}']`,
        );
        throw error;
      });
  }
}
