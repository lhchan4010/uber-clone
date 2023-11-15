import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-accout.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetProfileArgs, GetProfileOutput } from './dto/user-profile.dto';
import {
  UpdateProfileInput,
  UpdateProfileOutput,
} from './dto/update-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return await this.userService.login(loginInput);
    } catch (error) {
      return { ok: false, error: "Couldn't Login" };
    }
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @UseGuards(AuthGuard)
  @Query(() => GetProfileOutput)
  getProfile(
    @Args() getProfileArgs: GetProfileArgs,
  ): Promise<GetProfileOutput> {
    console.log('-------------', getProfileArgs);
    return this.userService.findById(getProfileArgs.userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateProfileOutput)
  async updateProfile(
    @AuthUser() authUser: User,
    @Args('input') updateProfileInput: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    return this.userService.updateProfile(authUser.id, updateProfileInput);
  }

  @Mutation(() => VerifyEmailOutput)
  verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmail(verifyEmailInput);
  }
}
