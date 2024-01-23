import { AddMembershipBaseDto } from './add-membership-base.dto';
import { ClassMembershipEntity } from '../entities';

export class AddMembershipDto extends AddMembershipBaseDto {
  toClassMembershipEntity(personId: number): ClassMembershipEntity {
    return new ClassMembershipEntity(personId, this.class_name);
  }
}
