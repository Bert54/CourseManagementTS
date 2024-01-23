import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ClassMembershipEntity } from '../entities';
import { LoggerService } from '../../../common';
import { MembershipAlreadyExistsError } from '../errors';

@Injectable()
export class ClassesMembershipDao {
  constructor(
    @InjectRepository(ClassMembershipEntity)
    private classesMembershipRepository: Repository<ClassMembershipEntity>,
    private logger: LoggerService,
  ) {}

  async save(
    classMembershipEntity: ClassMembershipEntity,
  ): Promise<ClassMembershipEntity> {
    return await this.classesMembershipRepository
      .save<ClassMembershipEntity>(classMembershipEntity)
      .catch((error) => {
        this.logger.log(
          `Could not save new membership [error: '${error.message}']`,
        );
        throw new MembershipAlreadyExistsError(
          `Membership for person with id '${classMembershipEntity.person_id}' and class '${classMembershipEntity.class_name}' already exists`,
        );
      });
  }
}
