import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { MutationOutput } from 'src/common/dto/output.dto';

@InputType()
export class UpdateProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class UpdateProfileOutput extends MutationOutput {}
