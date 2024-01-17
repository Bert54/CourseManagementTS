export abstract class PersonEntity {

  id: number;

  name: string;

  role: number;

  abstract getPermissions(): string[];

}
