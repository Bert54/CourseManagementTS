import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { PeopleService } from './people.service';
import { PeopleDao } from '../dao';
import { PersonEntity } from '../entities';
import { NotFoundError } from '../../common';
import { AddPersonDtoBase } from '../dto';
import { PersonAlreadyExistsError } from '../errors';

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
  // Test suite for getPersonById
  // ------------------------------------
  describe('getPersonById', () => {
    it('should return a person', () => {
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.name = 'james';

      peopleDao.findOneById.mockReturnValue(
        new Promise<PersonEntity>(() => person),
      );

      const gottenPerson = peopleService.getPersonById(1);

      expect(gottenPerson).resolves.toBe(person);
    });

    it('should return a person based on id', () => {
      const person1 = createMock<PersonEntity>();
      person1.id = 1;
      person1.name = 'james';

      const person2 = createMock<PersonEntity>();
      person2.id = 2;
      person2.name = 'natalya';

      peopleDao.findOneById.mockImplementation(
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

      let gottenPerson = peopleService.getPersonById(1);

      expect(gottenPerson).resolves.toBe(person1);

      gottenPerson = peopleService.getPersonById(2);

      expect(gottenPerson).resolves.toBe(person2);
    });

    it('should throw an error', () => {
      peopleDao.findOneById.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new NotFoundError('not found'));
      });

      expect(peopleService.getPersonById(1)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getPersonByName', () => {
    it('should return a person', () => {
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.name = 'james';

      peopleDao.findOneByName.mockReturnValue(
        new Promise<PersonEntity>(() => person),
      );

      const gottenPerson = peopleService.getPersonByName('james');

      expect(gottenPerson).resolves.toBe(person);
    });

    it('should return a person based on name', () => {
      const person1 = createMock<PersonEntity>();
      person1.id = 1;
      person1.name = 'james';

      const person2 = createMock<PersonEntity>();
      person2.id = 2;
      person2.name = 'natalya';

      peopleDao.findOneByName.mockReturnValue(
        new Promise<PersonEntity>(() => person1),
      );

      peopleDao.findOneByName.mockImplementation(
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

      let gottenPerson = peopleService.getPersonByName('james');

      expect(gottenPerson).resolves.toBe(person1);

      gottenPerson = peopleService.getPersonByName('natalya');

      expect(gottenPerson).resolves.toBe(person2);
    });

    it('should throw an error', () => {
      peopleDao.findOneByName.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new NotFoundError('not found'));
      });

      expect(peopleService.getPersonByName('james')).rejects.toThrow(
        NotFoundError,
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

      dto.toPersonEntity.mockReturnValue(person);

      peopleDao.save.mockReturnValue(new Promise<PersonEntity>(() => person));

      const gottenPerson = peopleService.addPerson(dto);

      expect(gottenPerson).resolves.toBe(person);

      expect(dto.toPersonEntity).toBeCalledTimes(1);
    });

    it('should throw an error if the person already exists', () => {
      peopleDao.save.mockImplementation((): Promise<PersonEntity> => {
        return Promise.reject(new PersonAlreadyExistsError('already exists'));
      });

      const dto = createMock<AddPersonDtoBase>();
      dto.name = 'james';

      expect(peopleService.addPerson(dto)).rejects.toThrow(
        PersonAlreadyExistsError,
      );

      expect(dto.toPersonEntity).toBeCalledTimes(1);
    });
  });
});
