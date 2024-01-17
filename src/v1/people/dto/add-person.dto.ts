import { AddPersonDtoBase } from './add-person-base.dto';
import { PersonEntity } from '../entities';

export class AddPersonDto extends AddPersonDtoBase {

  constructor() {
    super();
  }

  toPersonEntity(): PersonEntity {
    return undefined;
  }

}
