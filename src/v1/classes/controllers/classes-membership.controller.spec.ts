import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { ClassesMembershipService } from '../services';
import { ClassesMembershipController } from './classes-membership.controller';
import { ClassMembershipEntity } from '../entities';
import { AddMembershipDto } from '../dto';
import {
  MembershipAlreadyExistsError,
  MembershipNotFoundError,
} from '../errors';
import { CheckPermissionService } from '../../common/modules/authorization/check-permission';

describe('ClassesMembershipController', () => {
  let classesMembershipController: ClassesMembershipController;
  let classesMembershipService: DeepMocked<ClassesMembershipService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesMembershipController],
      providers: [
        {
          provide: ClassesMembershipService,
          useValue: createMock<ClassesMembershipService>(),
        },
        {
          provide: CheckPermissionService,
          useValue: createMock<CheckPermissionService>(),
        },
      ],
    }).compile();

    classesMembershipController = module.get(ClassesMembershipController);
    classesMembershipService = module.get(ClassesMembershipService);
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

      classesMembershipService.joinClass.mockReturnValue(
        new Promise<ClassMembershipEntity>(() => membership),
      );

      expect(
        classesMembershipController.joinClass('7', dto),
      ).resolves.toStrictEqual(membership);
      expect(classesMembershipService.joinClass).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service throws an error', () => {
      const dto = createMock<AddMembershipDto>();
      dto.class_name = 'MI6';

      classesMembershipService.joinClass.mockImplementation(() => {
        return Promise.reject(
          new MembershipAlreadyExistsError('membership already exists'),
        );
      });

      expect(classesMembershipController.joinClass('7', dto)).rejects.toThrow(
        MembershipAlreadyExistsError,
      );
      expect(
        classesMembershipController.joinClass('7', dto),
      ).rejects.toStrictEqual(
        new MembershipAlreadyExistsError('membership already exists'),
      );
      expect(classesMembershipService.joinClass).toHaveBeenCalledTimes(2);
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

      classesMembershipService.leaveClass.mockReturnValue(
        new Promise<ClassMembershipEntity>(() => membership),
      );

      expect(
        classesMembershipController.leaveClass('7', 'MI6'),
      ).resolves.toStrictEqual(membership);
      expect(classesMembershipService.leaveClass).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service throws an error', () => {
      classesMembershipService.leaveClass.mockImplementation(() => {
        return Promise.reject(
          new MembershipNotFoundError('membership was not found'),
        );
      });

      expect(
        classesMembershipController.leaveClass('7', 'MI6'),
      ).rejects.toThrow(MembershipNotFoundError);
      expect(
        classesMembershipController.leaveClass('7', 'MI6'),
      ).rejects.toStrictEqual(
        new MembershipNotFoundError('membership was not found'),
      );
      expect(classesMembershipService.leaveClass).toHaveBeenCalledTimes(2);
    });
  });
});
