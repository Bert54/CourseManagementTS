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
  addUser(@Body() addPersonDto: AddPersonDto): PersonEntity {
    const res = this.peopleService.addPerson(addPersonDto);
    console.log(res);
    return res;
  }
}
