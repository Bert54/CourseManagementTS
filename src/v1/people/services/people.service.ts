import { Body, Injectable } from '@nestjs/common';
import { AddPersonDtoBase } from '../dto';
import { PersonEntity } from '../entities';

@Injectable()
export class PeopleService {
  getHello(): string {
    return 'Hello World!';
  }

  addPerson(@Body() addPersonDto: AddPersonDtoBase): PersonEntity {
    addPersonDto.format();
    return addPersonDto.toPersonEntity();
  }
}
