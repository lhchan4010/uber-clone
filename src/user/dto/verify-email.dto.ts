import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { Veryfication } from '../entities/veryfication.entity';

@InputType()
export class VerifyEmailInput extends PickType(Veryfication, ['code']) {}

@ObjectType()
export class VerifyEmailOutput extends MutationOutput {}
