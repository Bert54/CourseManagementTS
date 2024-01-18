import { Injectable } from '@nestjs/common';
import { AddPersonDtoBase } from '../dto';
import { PersonEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    addPersonDto.format();
    return this.peopleRepository.save(addPersonDto.toPersonEntity());
  }
}
