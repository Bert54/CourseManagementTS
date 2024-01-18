import { Injectable } from '@nestjs/common';
import { AddPersonDtoBase } from '../dto';
import { PersonEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlreadyExistsError } from '../errors';
import { BaseError } from '../../../common';

@Injectable()
export class PeopleService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    @InjectRepository(PersonEntity)
    private peopleRepository: Repository<PersonEntity>,
  ) {}

  addPerson(addPersonDto: AddPersonDtoBase): Promise<PersonEntity> {
    let personEntity: PersonEntity;
    try {
      personEntity = addPersonDto.toPersonEntity();
    } catch (error) {
      return new Promise<PersonEntity>(() => {
        throw error;
      });
    }

    return this.peopleRepository.save(personEntity).catch(() => {
      throw new AlreadyExistsError(
        `Person with name '${personEntity.name}' already exists`,
      );
    });
  }
}
