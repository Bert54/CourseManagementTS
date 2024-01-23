import { Injectable } from '@nestjs/common';

import { ClassesDao } from '../dao';
import { AddClassBaseDto } from '../dto';
import { ClassEntity } from '../entities';

@Injectable()
export class ClassesService {
  constructor(private classesDao: ClassesDao) {}

  addClass(addClassDto: AddClassBaseDto): Promise<ClassEntity> {
    return this.classesDao.save(addClassDto.toClassEntity());
  }

  removeClass(name: string): Promise<ClassEntity> {
    return this.classesDao.deleteOneByName(name);
  }
}
