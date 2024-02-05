import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ClassMembershipEntity } from '../entities';

export class AddMembershipDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  class_name: string;

  format(): void {
    this.class_name = this.class_name.trim();
  }

  toClassMembershipEntity(personId: number): ClassMembershipEntity {
    return new ClassMembershipEntity(personId, this.class_name);
  }
}
