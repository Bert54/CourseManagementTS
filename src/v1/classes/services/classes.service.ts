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

  async getClass(className: string): Promise<ClassEntity> {
    return await this.classesDao.findOneByName(className).then((cls) => {
      // transfer people gotten from memberships directly into the class object
      cls.members = [];
      cls.members_cls.forEach((membership) =>
        cls.members.push(membership.person),
      );
      return cls;
    });
  }

  removeClass(name: string): Promise<ClassEntity> {
    return this.classesDao.deleteOneByName(name);
  }
}
