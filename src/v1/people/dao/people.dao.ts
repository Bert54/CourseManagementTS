import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PersonEntity } from '../entities';

@Injectable()
export class PeopleDao {
  constructor(
    @InjectRepository(PersonEntity)
    private peopleRepository: Repository<PersonEntity>,
  ) {}

  async save(person: PersonEntity): Promise<PersonEntity> {
    return await this.peopleRepository
      .save<PersonEntity>(person)
      .then((resultEntity) => resultEntity);
  }
}
