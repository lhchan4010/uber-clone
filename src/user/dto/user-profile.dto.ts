import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class GetProfileArgs {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class GetProfileOutput extends MutationOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
