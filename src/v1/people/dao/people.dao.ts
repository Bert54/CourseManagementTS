import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PersonEntity } from '../entities';
import { GetUserOptionsInterface } from '../interfaces';
import { LoggerService } from '../../../common/modules/logger';
import { PersonAlreadyExistsError, PersonNotFoundError } from '../errors';
import { PeopleRelationsEnum } from '../enums';

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

  async findOne(
    conditions: Partial<GetUserOptionsInterface>,
    relations?: PeopleRelationsEnum[],
  ): Promise<PersonEntity> {
    return await this.peopleRepository
      .findOne({
        where: conditions,
        relations: relations,
      })
      .then((person: PersonEntity) => {
        if (!person) {
          throw new PersonNotFoundError(`Person was not found`);
        }
        return person;
      })
      .catch((error) => {
        this.logger.log(`Could not fetch person [error: '${error.message}']`);
        throw error;
      });
  }
}
