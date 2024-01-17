import { IsNotEmpty, IsString } from 'class-validator';
import { PersonEntity } from '../entities';

export abstract class AddPersonDtoBase {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  role: string;

  abstract toPersonEntity(): PersonEntity;

}
