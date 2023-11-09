import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-accout.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const result = await this.userService.createAccount(createAccountInput);
      return result;
    } catch (error) {
      return { ok: false, error: "Couldn't create account" };
    }
  }
}
