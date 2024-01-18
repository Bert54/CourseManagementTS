import { InjectRepository } from '@nestjs/typeorm';
import { PersonEntity } from '../entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

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
