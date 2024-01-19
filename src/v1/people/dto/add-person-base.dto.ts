import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PersonEntity } from '../entities';

export abstract class AddPersonDtoBase {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsString()
  role: string;

  format(): void {
    this.name = this.name.trim();
    this.role = this.role.trim().toLowerCase();
  }

  abstract toPersonEntity(): PersonEntity;
}
