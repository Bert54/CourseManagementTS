import { AddPersonDto } from './add-person.dto';
import {
  AdministratorEntity,
  PersonEntity,
  StudentEntity,
  TeacherEntity,
} from '../entities';
import { UnknownRoleError } from '../errors';

describe('AddPersonDto', () => {
  // ------------------------------------
  // Test suite for format
  // ------------------------------------
  describe('format', () => {
    let expected: AddPersonDto;

    beforeEach(() => {
      expected = new AddPersonDto();
      expected.name = 'trevelyan';
      expected.role = 'head of janus';
    });

    it('should do nothing', () => {
      const actual = new AddPersonDto();
      actual.name = 'trevelyan';
      actual.role = 'head of janus';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim left', () => {
      const actual = new AddPersonDto();
      actual.name = '   trevelyan';
      actual.role = '    head of janus';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim right', () => {
      const actual = new AddPersonDto();
      actual.name = 'trevelyan    ';
      actual.role = 'head of janus     ';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim left and right', () => {
      const actual = new AddPersonDto();
      actual.name = '   trevelyan    ';
      actual.role = '     head of janus     ';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should convert role to lowercase', () => {
      const actual = new AddPersonDto();
      actual.name = 'trevelyan';
      actual.role = 'heAD oF jaNus';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim and convert role to lowercase', () => {
      const actual = new AddPersonDto();
      actual.name = ' trevelyan  ';
      actual.role = '    heAD oF jaNus  ';

      actual.format();

      expect(actual).toEqual(expected);
    });
  });
  // ------------------------------------
  // Test suite for toPersonEntity
  // ------------------------------------
  describe('toPersonEntity', () => {
    it('should create a student entity', () => {
      const expected: PersonEntity = new StudentEntity('mishkin');

      const dto = new AddPersonDto();
      dto.name = 'mishkin';
      dto.role = 'student';

      const actual = dto.toPersonEntity();

      expect(actual).toBeInstanceOf(StudentEntity);
      expect(actual).toEqual(expected);
    });

    it('should create a teacher entity', () => {
      const expected: PersonEntity = new TeacherEntity('boris');

      const dto = new AddPersonDto();
      dto.name = 'boris';
      dto.role = 'teacher';

      const actual = dto.toPersonEntity();

      expect(actual).toBeInstanceOf(TeacherEntity);
      expect(actual).toEqual(expected);
    });

    it('should create an administrator entity', () => {
      const expected: PersonEntity = new AdministratorEntity('james');

      const dto = new AddPersonDto();
      dto.name = 'james';
      dto.role = 'administrator';

      const actual = dto.toPersonEntity();

      expect(actual).toBeInstanceOf(AdministratorEntity);
      expect(actual).toEqual(expected);
    });

    it('should throw an error due to unknown role', () => {
      const dto = new AddPersonDto();
      dto.name = 'trevelyan';
      dto.role = 'head of janus';

      // need to encapsulate called function into another one, otherwise Jest can't test the error and the test will
      // fail
      const ref = () => {
        dto.toPersonEntity();
      };
      expect(ref).toThrow(UnknownRoleError);
    });
  });
});
