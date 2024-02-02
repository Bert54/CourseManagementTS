import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { PeopleService } from './people.service';
import { PeopleDao } from '../dao';
import { PersonEntity } from '../entities';
import { AddPersonDto } from '../dto';
import { PersonAlreadyExistsError, UnknownRoleError } from '../errors';
import { NotFoundError } from '../../common/errors';
import { ClassEntity, ClassMembershipEntity } from '../../classes/entities';
import { PeopleRelationsEnum } from '../enums';

describe('PeopleService', () => {
  let peopleService: PeopleService;
  let peopleDao: DeepMocked<PeopleDao>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: PeopleDao,
          useValue: createMock<PeopleDao>(),
        },
      ],
    }).compile();

    peopleService = module.get<PeopleService>(PeopleService);
    peopleDao = module.get(PeopleDao);
  });

  // ------------------------------------
  // Test suite for getPerson
  // ------------------------------------
  describe('getPerson', () => {
    it('should return a person based on id without memberships', () => {
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.name = 'james';

      peopleDao.findOne.mockReturnValue(
        new Promise<PersonEntity>(() => person),
      );

      const gottenPerson = peopleService.getPerson({
        id: 1,
      });

      expect(gottenPerson).resolves.toBe(person);
    });

    it('should return a person based on id with memberships', async () => {
      const class1 = createMock<ClassEntity>();
      class1.id = 7;
      class1.name = 'MI6';
      const membership1 = createMock<ClassMembershipEntity>();
      membership1.class_info = class1;

      const class2 = createMock<ClassEntity>();
      class2.id = 12;
      class2.name = 'Secret agent club';
      const membership2 = createMock<ClassMembershipEntity>();
      membership2.class_info = class2;

      const originalPerson = createMock<PersonEntity>();
      originalPerson.id = 1;
      originalPerson.name = 'james';
      originalPerson.memberships = [membership1, membership2];

      const expectedPerson = createMock<PersonEntity>();
      expectedPerson.id = 1;
      expectedPerson.name = 'james';
      expectedPerson.memberships = [membership1, membership2];
      expectedPerson.classes = [class1, class2];

      peopleDao.findOne.mockResolvedValue(originalPerson);

      const gottenPerson = await peopleService.getPerson(
        {
          id: 1,
        },
        [
          PeopleRelationsEnum.Memberships,
          PeopleRelationsEnum.Memberships_ClassInfo,
        ],
      );

      expect(JSON.stringify(gottenPerson)).toStrictEqual(
        JSON.stringify(expectedPerson),
      );
    });

    it('should return a person based on id', () => {
      const person1 = createMock<PersonEntity>();
      person1.id = 1;
      person1.name = 'james';

      const person2 = createMock<PersonEntity>();
      person2.id = 2;
      person2.name = 'natalya';

      peopleDao.findOne.mockImplementation((options): Promise<PersonEntity> => {
        let person: PersonEntity;
        if (options.id === 1) {
          person = person1;
        }
        if (options.id === 2) {
          person = person2;
        }
        return new Promise(() => person);
      });

      let gottenPerson = peopleService.getPerson({
        id: 1,
      });

      expect(gottenPerson).resolves.toBe(person1);

      gottenPerson = peopleService.getPerson({
        id: 2,
      });

      expect(gottenPerson).resolves.toBe(person2);
    });

    it('should throw an error', () => {
      peopleDao.findOne.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new NotFoundError('not found'));
      });

      expect(
        peopleService.getPerson({
          id: 1,
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getPersonByName', () => {
    it('should return a person', () => {
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.name = 'james';

      peopleDao.findOne.mockReturnValue(
        new Promise<PersonEntity>(() => person),
      );

      const gottenPerson = peopleService.getPerson({
        name: 'james',
      });

      expect(gottenPerson).resolves.toBe(person);
    });

    it('should return a person based on name', () => {
      const person1 = createMock<PersonEntity>();
      person1.id = 1;
      person1.name = 'james';

      const person2 = createMock<PersonEntity>();
      person2.id = 2;
      person2.name = 'natalya';

      peopleDao.findOne.mockReturnValue(
        new Promise<PersonEntity>(() => person1),
      );

      peopleDao.findOne.mockImplementation((options): Promise<PersonEntity> => {
        let person: PersonEntity;
        if (options.name === 'james') {
          person = person1;
        }
        if (options.name === 'natalya') {
          person = person2;
        }
        return new Promise(() => person);
      });

      let gottenPerson = peopleService.getPerson({
        name: 'james',
      });

      expect(gottenPerson).resolves.toBe(person1);

      gottenPerson = peopleService.getPerson({
        name: 'natalya',
      });

      expect(gottenPerson).resolves.toBe(person2);
    });

    it('should throw an error', () => {
      peopleDao.findOne.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new NotFoundError('not found'));
      });

      expect(
        peopleService.getPerson({
          name: 'james',
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  // ------------------------------------
  // Test suite for addPerson
  // ------------------------------------
  describe('addPerson', () => {
    it('should return a successfully added person', () => {
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.name = 'james';

      const dto = createMock<AddPersonDto>();
      dto.name = 'james';

      dto.toPersonEntity.mockReturnValue(person);

      peopleDao.save.mockReturnValue(new Promise<PersonEntity>(() => person));

      const gottenPerson = peopleService.addPerson(dto);

      expect(gottenPerson).resolves.toBe(person);
      expect(dto.toPersonEntity).toHaveBeenCalledTimes(1);
      expect(peopleDao.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the role is incorrect', () => {
      const dto = createMock<AddPersonDto>();
      dto.name = 'oddjob';
      dto.toPersonEntity.mockImplementation((): PersonEntity => {
        throw new UnknownRoleError('incorrect role');
      });

      expect(peopleService.addPerson(dto)).rejects.toThrow(UnknownRoleError);
      expect(dto.toPersonEntity).toHaveBeenCalledTimes(1);
      expect(peopleDao.save).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if the person already exists', () => {
      peopleDao.save.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new PersonAlreadyExistsError('already exists'));
      });

      const dto = createMock<AddPersonDto>();
      dto.name = 'james';

      expect(peopleService.addPerson(dto)).rejects.toThrow(
        PersonAlreadyExistsError,
      );
      expect(dto.toPersonEntity).toHaveBeenCalledTimes(1);
      expect(peopleDao.save).toHaveBeenCalledTimes(1);
    });
  });
});
