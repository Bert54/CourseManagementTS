import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ClassEntity } from '../entities';
import { LoggerService } from '../../../common';
import { ClassAlreadyExistsError, ClassNotFoundError } from '../errors';

@Injectable()
export class ClassesDao {
  constructor(
    @InjectRepository(ClassEntity)
    private classesRepository: Repository<ClassEntity>,
    private logger: LoggerService,
  ) {}

  async save(classEntity: ClassEntity): Promise<ClassEntity> {
    return await this.classesRepository
      .save<ClassEntity>(classEntity)
      .catch((error) => {
        this.logger.log(`Could not save new class [error: '${error.message}']`);
        throw new ClassAlreadyExistsError(
          `Class with name '${classEntity.name}' already exists`,
        );
      });
  }

  async findOneByName(name: string): Promise<ClassEntity> {
    return await this.classesRepository
      .findOne({
        where: {
          name: name,
        },
        relations: ['members_cls', 'members_cls.person'],
      })
      .then((person: ClassEntity) => {
        if (!person) {
          throw new ClassNotFoundError(
            `Class with name '${name}' was not found`,
          );
        }
        return person;
      })
      .catch((error) => {
        this.logger.log(
          `Could not fetch class using name [error: '${error.message}']`,
        );
        throw error;
      });
  }

  async deleteOneByName(name: string): Promise<ClassEntity> {
    const findPromise = Promise.resolve(this.findOneByName(name));
    const deletePromise = Promise.resolve(
      this.classesRepository
        .delete({
          name: name,
        })
        .then((result): void => {
          if (result.affected === 0) {
            throw new ClassNotFoundError(
              `Class with name '${name}' was not found`,
            );
          }
          return undefined;
        })
        .catch((error) => {
          this.logger.log(
            `Could not fetch person using name [error: '${error.message}']`,
          );
          throw error;
        }),
    );
    return await Promise.all([findPromise, deletePromise]).then((values) => {
      let classEntity: ClassEntity;
      values.forEach((currentValue) => {
        if (!!currentValue) {
          classEntity = currentValue;
        }
      });
      return classEntity;
    });
  }
}
