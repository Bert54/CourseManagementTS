import { PersonEntity } from './person.entity';

export class AdministratorEntity extends PersonEntity {
  constructor(name: string, role: number) {
    super(name, role);
  }

  getPermissions(): string[] {
    return ['administrator_tmp'];
  }
}
