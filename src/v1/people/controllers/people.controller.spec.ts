import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpException, HttpStatus } from '@nestjs/common';

import { PeopleController } from './people.controller';
import { PeopleService } from '../services';
import { PersonEntity } from '../entities';
import { NotFoundError } from '../../common';


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
      ],
    }).compile();

    peopleController = module.get<PeopleController>(PeopleController);
    peopleService = module.get(PeopleService);
  });

  describe('getPersonById OK', () => {
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

      peopleService.getPersonById.mockReturnValue(
        new Promise<PersonEntity>(() => person1),
      );

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
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.name = 'james';

      peopleService.getPersonById.mockImplementation(
        (): Promise<PersonEntity> => {
          return Promise.reject(new NotFoundError('not found'));
        },
      );

      expect(
        peopleController.getPersonById({
          id: 1,
        }),
      ).rejects.toThrow(HttpException);

      expect(
        peopleController.getPersonById({
          id: 1,
        }),
      ).rejects.toHaveProperty('response', {
        status: HttpStatus.NOT_FOUND,
        error: 'not found',
      });
    });
  });
});
