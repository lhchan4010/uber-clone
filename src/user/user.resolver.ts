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

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const result = await this.userService.login(loginInput);
      return result;
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
  async getProfile(
    @Args() getProfileArgs: GetProfileArgs,
  ): Promise<GetProfileOutput> {
    try {
      const user = await this.userService.findById(getProfileArgs.userId);
      console.log(user);
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'fail to find profile' };
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateProfileOutput)
  async updateProfile(
    @AuthUser() authUser: User,
    @Args('input') updateProfileInput: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    try {
      const user = await this.userService.updateProfile(
        authUser.id,
        updateProfileInput,
      );
      if (!user) {
        return { ok: false, error: 'fail to update Profile' };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'fail to update Profile' };
    }
  }
}
