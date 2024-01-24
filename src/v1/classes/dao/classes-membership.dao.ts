import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ClassMembershipEntity } from '../entities';
import { LoggerService } from '../../../common';
import {
  MembershipAlreadyExistsError,
  MembershipNotFoundError,
} from '../errors';

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
    // Need to check for existence of membership manually since typeorm won't return an error if one already exists
    const checkExistsPromise = await Promise.resolve(
      this.exists(
        classMembershipEntity.person_id,
        classMembershipEntity.class_name,
      ),
    );
    const savePromise = await Promise.resolve(
      this.classesMembershipRepository
        .save<ClassMembershipEntity>(classMembershipEntity)
        .catch((error) => {
          this.logger.log(
            `Could not save new membership [error: '${error.message}']`,
          );
          throw error;
        }),
    );
    return await Promise.all([checkExistsPromise, savePromise])
      .then((results) => {
        if (results[0]) {
          throw new MembershipAlreadyExistsError(
            `Membership for person with id '${classMembershipEntity.person_id}' and class '${classMembershipEntity.class_name}' already exists`,
          );
        }
        return results[1];
      })
      .catch((error) => {
        this.logger.log(
          `Could not save new membership [error: '${error.message}']`,
        );
        throw error;
      });
  }

  async findOne(
    personId: number,
    className: string,
  ): Promise<ClassMembershipEntity> {
    return await this.classesMembershipRepository
      .findOneBy({
        person_id: personId,
        class_name: className,
      })
      .then((membership: ClassMembershipEntity) => {
        if (!membership) {
          throw new MembershipNotFoundError(
            `Membership for person with id '${personId}' and class '${className}' was not found`,
          );
        }
        return membership;
      })
      .catch((error) => {
        this.logger.log(
          `Could not fetch membership [error: '${error.message}']`,
        );
        throw error;
      });
  }

  async exists(personId: number, className: string): Promise<boolean> {
    return await this.classesMembershipRepository
      .existsBy({
        person_id: personId,
        class_name: className,
      })
      .catch((error) => {
        this.logger.log(
          `Could not check for existence of membership [error: '${error.message}']`,
        );
        throw error;
      });
  }

  async deleteOne(
    personId: number,
    className: string,
  ): Promise<ClassMembershipEntity> {
    const findPromise = await Promise.resolve(
      this.findOne(personId, className),
    );
    const deletePromise = await Promise.resolve(
      this.classesMembershipRepository
        .delete({
          person_id: personId,
          class_name: className,
        })
        .then((result): void => {
          if (result.affected === 0) {
            throw new MembershipNotFoundError(
              `Membership for person with id '${personId}' and class '${className}' was not found`,
            );
          }
        })
        .catch((error) => {
          this.logger.log(
            `Could not delete membership [error: '${error.message}']`,
          );
          throw error;
        }),
    );

    return await Promise.all([findPromise, deletePromise]).then((values) => {
      return values[0];
    });
  }
}
