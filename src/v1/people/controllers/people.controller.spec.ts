import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { PeopleController } from './people.controller';
import { PeopleService } from '../services';
import { PersonEntity } from '../entities';
import { AddPersonDto } from '../dto';
import { PersonAlreadyExistsError } from '../errors';
import { NotFoundError } from '../../common/errors';
import { GetUserOptionsInterface } from '../interfaces';
import { CheckPermissionService } from '../../common/modules/authorization/check-permission';

const getPersonMockImplementation = (
  person1: PersonEntity,
  person2: PersonEntity,
) => {
  return (options: Partial<GetUserOptionsInterface>): Promise<PersonEntity> => {
    let person: PersonEntity;
    if (options.id === 1) {
      person = person1;
    }
    if (options.id === 2) {
      person = person2;
    }
    return new Promise(() => person);
  };
};

describe('PeopleController', () => {
  let peopleController: PeopleController;
  let peopleService: DeepMocked<PeopleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        {
          provide: PeopleService,
          useValue: createMock<PeopleService>(),
        },
        {
          provide: CheckPermissionService,
          useValue: createMock<CheckPermissionService>(),
        },
      ],
    }).compile();

    peopleController = module.get<PeopleController>(PeopleController);
    peopleService = module.get(PeopleService);
  });

  // ------------------------------------
  // Test suite for getPersonById
  // ------------------------------------
  describe('getPersonById', () => {
    it('should return a person', () => {
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.name = 'james';

      peopleService.getPerson.mockReturnValue(
        new Promise<PersonEntity>(() => person),
      );

      const gottenPerson = peopleController.getPersonById({
        id: 1,
      });

      expect(gottenPerson).resolves.toHaveProperty([
        ['id', 1],
        ['name', 'james'],
      ]);
    });

    it('should return a person based on id', () => {
      const person1 = createMock<PersonEntity>();
      person1.id = 1;
      person1.name = 'james';

      const person2 = createMock<PersonEntity>();
      person2.id = 2;
      person2.name = 'natalya';

      peopleService.getPerson.mockImplementation(
        getPersonMockImplementation(person1, person2),
      );

      let gottenPerson = peopleController.getPersonById({
        id: 1,
      });

      expect(gottenPerson).resolves.toHaveProperty([
        ['id', 1],
        ['name', 'james'],
      ]);

      gottenPerson = peopleController.getPersonById({
        id: 2,
      });

      expect(gottenPerson).resolves.toHaveProperty([
        ['id', 2],
        ['name', 'natalya'],
      ]);
    });

    it('should throw an error', () => {
      peopleService.getPerson.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new NotFoundError('not found'));
      });

      expect(
        peopleController.getPersonById({
          id: 1,
        }),
      ).rejects.toThrow(NotFoundError);

      expect(
        peopleController.getPersonById({
          id: 1,
        }),
      ).rejects.toStrictEqual(new NotFoundError('not found'));
    });
  });

  // ------------------------------------
  // Test suite for getPersonByName
  // ------------------------------------
  describe('getPersonByName', () => {
    it('should return a person', () => {
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.name = 'james';

      peopleService.getPerson.mockReturnValue(
        new Promise<PersonEntity>(() => person),
      );

      const gottenPerson = peopleController.getPersonByName('james');

      expect(gottenPerson).resolves.toHaveProperty([
        ['id', 1],
        ['name', 'james'],
      ]);
    });

    it('should return a person based on name', () => {
      const person1 = createMock<PersonEntity>();
      person1.id = 1;
      person1.name = 'james';

      const person2 = createMock<PersonEntity>();
      person2.id = 2;
      person2.name = 'natalya';

      peopleService.getPerson.mockReturnValue(
        new Promise<PersonEntity>(() => person1),
      );

      peopleService.getPerson.mockImplementation(
        getPersonMockImplementation(person1, person2),
      );

      let gottenPerson = peopleController.getPersonByName('james');

      expect(gottenPerson).resolves.toHaveProperty([
        ['id', 1],
        ['name', 'james'],
      ]);

      gottenPerson = peopleController.getPersonByName('natalya');

      expect(gottenPerson).resolves.toHaveProperty([
        ['id', 2],
        ['name', 'natalya'],
      ]);
    });

    it('should throw an error', () => {
      peopleService.getPerson.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new NotFoundError('not found'));
      });

      expect(peopleController.getPersonByName('james')).rejects.toThrow(
        NotFoundError,
      );

      expect(peopleController.getPersonByName('james')).rejects.toStrictEqual(
        new NotFoundError('not found'),
      );
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

      peopleService.addPerson.mockReturnValue(
        new Promise<PersonEntity>(() => person),
      );

      const gottenPerson = peopleController.addPerson(dto);

      expect(gottenPerson).resolves.toBe(person);
    });

    it('should throw an appropriate error if the person already exists', () => {
      peopleService.addPerson.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new PersonAlreadyExistsError('already exists'));
      });

      const dto = createMock<AddPersonDto>();
      dto.name = 'james';

      expect(peopleController.addPerson(dto)).rejects.toThrow(
        PersonAlreadyExistsError,
      );

      expect(peopleController.addPerson(dto)).rejects.toStrictEqual(
        new PersonAlreadyExistsError('already exists'),
      );
    });
  });
});
