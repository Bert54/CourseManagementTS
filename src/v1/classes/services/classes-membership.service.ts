import { Injectable } from '@nestjs/common';
import { ClassesMembershipDao } from '../dao';
import { AddMembershipBaseDto } from '../dto';
import { ClassMembershipEntity } from '../entities';

@Injectable()
export class ClassesMembershipService {
  constructor(private classesMembershipDao: ClassesMembershipDao) {}

  joinClass(
    personId: number,
    addMembershipDto: AddMembershipBaseDto,
  ): Promise<ClassMembershipEntity> {
    return this.classesMembershipDao.save(
      addMembershipDto.toClassMembershipEntity(personId),
    );
  }
}
