import { Injectable } from '@nestjs/common';
import { AddPersonDtoBase } from '../dto';

@Injectable()
export class PeopleService {

  getHello(): string {
    return 'Hello World!';
  }

  addPerson(addPersonDto: AddPersonDtoBase): any {
    return addPersonDto;
  }

}
