export abstract class PersonEntity {
  constructor(name: string, role: number) {
    this.name = name;
    this.role = role;
  }

  id: number;

  name: string;

  role: number;

  abstract getPermissions(): string[];
}
