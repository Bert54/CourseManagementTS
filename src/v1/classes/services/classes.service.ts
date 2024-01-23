import { Injectable } from '@nestjs/common';
import { ClassesDao } from '../dao/classes.dao';

@Injectable()
export class ClassesService {
  constructor(private classesDao: ClassesDao) {}
}
