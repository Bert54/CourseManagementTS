import { Body, Controller, Get, Post } from '@nestjs/common';
import { PeopleService } from '../services';
import { AddPersonDto } from '../dto';

@Controller('/people')
export class PeopleController {

  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  getHello(): string {
    return this.peopleService.getHello();
  }

  @Post()
  addUser(@Body() addPersonDto: AddPersonDto): any {
    return this.peopleService.addPerson(addPersonDto);
  }

}
