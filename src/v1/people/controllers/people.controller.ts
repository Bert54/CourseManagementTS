import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PeopleService } from '../services';
import { AddPersonDto } from '../dto';
import { PersonEntity } from '../entities';

@Controller('/people')
@UseInterceptors(ClassSerializerInterceptor)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  getHello(): string {
    return this.peopleService.getHello();
  }

  @Post()
  addUser(@Body() addPersonDto: AddPersonDto): Promise<PersonEntity> {
    return this.peopleService.addPerson(addPersonDto);
  }
}
