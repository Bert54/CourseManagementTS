import { Controller, Get } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('/people')
export class PeopleController {

  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  getHello(): string {
    return this.peopleService.getHello();
  }

}