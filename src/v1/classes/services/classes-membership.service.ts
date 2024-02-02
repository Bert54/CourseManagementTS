import { Injectable } from '@nestjs/common';
import { ClassesMembershipDao } from '../dao';
import { AddMembershipDto } from '../dto';
import { ClassMembershipEntity } from '../entities';

@Injectable()
export class ClassesMembershipService {
  constructor(private classesMembershipDao: ClassesMembershipDao) {}

  joinClass(
    personId: number,
    addMembershipDto: AddMembershipDto,
  ): Promise<ClassMembershipEntity> {
    return this.classesMembershipDao.save(
      addMembershipDto.toClassMembershipEntity(personId),
    );
  }

  leaveClass(
    personId: number,
    className: string,
  ): Promise<ClassMembershipEntity> {
    return this.classesMembershipDao.deleteOne(personId, className);
  }

  checkMembership(personId: number, className: string): Promise<boolean> {
    return this.classesMembershipDao.exists(personId, className);
  }
}
