import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { ClassesMembershipDao } from '../dao';
import { ClassesMembershipService } from './classes-membership.service';
import { ClassMembershipEntity } from '../entities';
import { AddMembershipDto } from '../dto';
import {
  MembershipAlreadyExistsError,
  MembershipNotFoundError,
} from '../errors';
import { InternalServerErrorException } from '@nestjs/common';

describe('ClassesMembershipService', () => {
  let classesMembershipService: ClassesMembershipService;
  let classesMembershipDao: DeepMocked<ClassesMembershipDao>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesMembershipService,
        {
          provide: ClassesMembershipDao,
          useValue: createMock<ClassesMembershipDao>(),
        },
      ],
    }).compile();

    classesMembershipService = module.get(ClassesMembershipService);
    classesMembershipDao = module.get(ClassesMembershipDao);
  });

  // ------------------------------------
  // Test suite for joinClass
  // ------------------------------------
  describe('joinClass', () => {
    it('should return the new membership', () => {
      const membership = createMock<ClassMembershipEntity>();
      membership.person_id = 7;
      membership.class_name = 'MI6';

      const dto = createMock<AddMembershipDto>();
      dto.class_name = 'MI6';

      classesMembershipDao.save.mockReturnValue(
        new Promise<ClassMembershipEntity>(() => membership),
      );

      expect(classesMembershipService.joinClass(7, dto)).resolves.toStrictEqual(
        membership,
      );
      expect(classesMembershipDao.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service throws an error', () => {
      const dto = createMock<AddMembershipDto>();
      dto.class_name = 'MI6';

      classesMembershipDao.save.mockImplementation(() => {
        return Promise.reject(
          new MembershipAlreadyExistsError('membership already exists'),
        );
      });

      expect(classesMembershipService.joinClass(7, dto)).rejects.toThrow(
        MembershipAlreadyExistsError,
      );
      expect(classesMembershipService.joinClass(7, dto)).rejects.toStrictEqual(
        new MembershipAlreadyExistsError('membership already exists'),
      );
      expect(classesMembershipDao.save).toHaveBeenCalledTimes(2);
    });
  });

  // ------------------------------------
  // Test suite for leaveClass
  // ------------------------------------
  describe('leaveClass', () => {
    it('should return the successfully deleted membership', () => {
      const membership = createMock<ClassMembershipEntity>();
      membership.person_id = 7;
      membership.class_name = 'MI6';

      classesMembershipDao.deleteOne.mockReturnValue(
        new Promise<ClassMembershipEntity>(() => membership),
      );

      expect(
        classesMembershipService.leaveClass(7, 'MI6'),
      ).resolves.toStrictEqual(membership);
      expect(classesMembershipDao.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should throw error if Dao throws an error', () => {
      classesMembershipDao.deleteOne.mockImplementation(() => {
        return Promise.reject(
          new MembershipNotFoundError('membership was not exists'),
        );
      });

      expect(classesMembershipService.leaveClass(7, 'MI6')).rejects.toThrow(
        MembershipNotFoundError,
      );
      expect(
        classesMembershipService.leaveClass(7, 'MI6'),
      ).rejects.toStrictEqual(
        new MembershipNotFoundError('membership was not exists'),
      );
      expect(classesMembershipDao.deleteOne).toHaveBeenCalledTimes(2);
    });
  });

  // ------------------------------------
  // Test suite for checkMembership
  // ------------------------------------
  describe('checkMembership', () => {
    it('should return true if Dao returns true', () => {
      classesMembershipDao.exists.mockReturnValue(
        new Promise<boolean>(() => true),
      );

      expect(
        classesMembershipService.checkMembership(7, 'MI6'),
      ).resolves.toStrictEqual(true);
      expect(classesMembershipDao.exists).toHaveBeenCalledTimes(1);
    });

    it('should return false if Dao returns false', () => {
      classesMembershipDao.exists.mockReturnValue(
        new Promise<boolean>(() => false),
      );

      expect(
        classesMembershipService.checkMembership(7, 'MI6'),
      ).resolves.toStrictEqual(false);
      expect(classesMembershipDao.exists).toHaveBeenCalledTimes(1);
    });

    it('should throw error if dao throws an error', () => {
      classesMembershipDao.exists.mockImplementation(() => {
        return Promise.reject(
          new InternalServerErrorException(
            'could not check membership existence',
          ),
        );
      });

      expect(
        classesMembershipService.checkMembership(7, 'MI6'),
      ).rejects.toThrow(InternalServerErrorException);
      expect(
        classesMembershipService.checkMembership(7, 'MI6'),
      ).rejects.toStrictEqual(
        new InternalServerErrorException(
          'could not check membership existence',
        ),
      );
      expect(classesMembershipDao.exists).toHaveBeenCalledTimes(2);
    });
  });
});
