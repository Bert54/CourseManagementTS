import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { PeopleService, PersonEntity } from '../../../../people';
import { CheckPermissionService } from './check-permission.service';
import { ForbiddenError, NotFoundError } from '../../../errors';

describe('CheckPermissionService', () => {
  let checkPermissionService: CheckPermissionService;
  let peopleService: DeepMocked<PeopleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckPermissionService,
        {
          provide: PeopleService,
          useValue: createMock<PeopleService>(),
        },
      ],
    }).compile();

    checkPermissionService = module.get(CheckPermissionService);
    peopleService = module.get(PeopleService);
  });

  // ------------------------------------
  // Test suite for hasPermission
  // ------------------------------------
  describe('hasPermission', () => {
    it('should grant permission (person has only one permission)', async () => {
      const person = createMock<PersonEntity>();
      person.getPermissions.mockReturnValue(['i.should.work']);

      peopleService.getPerson.mockResolvedValue(person);

      const hasPermission = await checkPermissionService.hasPermission(
        1,
        'i.should.work',
      );

      expect(hasPermission).toStrictEqual(true);
      expect(person.getPermissions).toHaveBeenCalledTimes(1);
      expect(peopleService.getPerson).toHaveBeenCalledTimes(1);
    });

    it('should grant permission (person has multiple permissions)', async () => {
      const person = createMock<PersonEntity>();
      person.getPermissions.mockReturnValue([
        'generic.permission.1',
        'generic.permission.2',
        'i.should.work',
        'generic.permission.4',
      ]);

      peopleService.getPerson.mockResolvedValue(person);

      const hasPermission = await checkPermissionService.hasPermission(
        1,
        'i.should.work',
      );

      expect(hasPermission).toStrictEqual(true);
      expect(person.getPermissions).toHaveBeenCalledTimes(1);
      expect(peopleService.getPerson).toHaveBeenCalledTimes(1);
    });

    it('should not grant permission (person has multiple permissions)', async () => {
      const person = createMock<PersonEntity>();
      person.getPermissions.mockReturnValue([
        'generic.permission.1',
        'generic.permission.2',
        'generic.permission.4',
      ]);

      peopleService.getPerson.mockResolvedValue(person);

      await expect(
        checkPermissionService.hasPermission(1, 'i.should.work'),
      ).rejects.toThrow(ForbiddenError);
      expect(person.getPermissions).toHaveBeenCalledTimes(1);
      expect(peopleService.getPerson).toHaveBeenCalledTimes(1);
    });

    it('should not grant permission (person has no permissions)', async () => {
      const person = createMock<PersonEntity>();
      person.getPermissions.mockReturnValue([]);

      peopleService.getPerson.mockResolvedValue(person);

      await expect(
        checkPermissionService.hasPermission(1, 'i.should.work'),
      ).rejects.toThrow(ForbiddenError);
      expect(person.getPermissions).toHaveBeenCalledTimes(1);
      expect(peopleService.getPerson).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if people service throws an error', async () => {
      peopleService.getPerson.mockRejectedValue(
        new NotFoundError('person not found'),
      );

      await expect(
        checkPermissionService.hasPermission(1, 'i.should.work'),
      ).rejects.toThrow(NotFoundError);
      expect(peopleService.getPerson).toHaveBeenCalledTimes(1);
    });
  });
});
