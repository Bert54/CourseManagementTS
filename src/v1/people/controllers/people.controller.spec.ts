import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { PeopleController } from './people.controller';
import { PeopleService } from '../services';
import { PersonEntity } from '../entities';
import { CheckPermissionService, NotFoundError } from '../../common';
import { AddPersonDtoBase } from '../dto';
import { PersonAlreadyExistsError } from '../errors';

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

      peopleService.getPersonById.mockReturnValue(
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

      peopleService.getPersonById.mockImplementation(
        (id: number): Promise<PersonEntity> => {
          let person: PersonEntity;
          if (id === 1) {
            person = person1;
          }
          if (id === 2) {
            person = person2;
          }
          return new Promise(() => person);
        },
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
      peopleService.getPersonById.mockImplementation(
        (): Promise<PersonEntity> => {
          return Promise.reject(new NotFoundError('not found'));
        },
      );

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

      peopleService.getPersonByName.mockReturnValue(
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

      peopleService.getPersonByName.mockReturnValue(
        new Promise<PersonEntity>(() => person1),
      );

      peopleService.getPersonByName.mockImplementation(
        (name: string): Promise<PersonEntity> => {
          let person: PersonEntity;
          if (name === 'james') {
            person = person1;
          }
          if (name === 'natalya') {
            person = person2;
          }
          return new Promise(() => person);
        },
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
      peopleService.getPersonByName.mockImplementation(
        (): Promise<PersonEntity> => {
          return Promise.reject(new NotFoundError('not found'));
        },
      );

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

      const dto = createMock<AddPersonDtoBase>();
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

      const dto = createMock<AddPersonDtoBase>();
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
