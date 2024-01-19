import { IsNumberString } from 'class-validator';

export class NumericIdValidator {
  @IsNumberString()
  id: number;
}
