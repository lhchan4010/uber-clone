import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-accout.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import {
  UpdateProfileInput,
  UpdateProfileOutput,
} from './dto/update-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto';
import { Veryfication } from './entities/veryfication.entity';
import { GetProfileOutput } from './dto/user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Veryfication)
    private readonly verifications: Repository<Veryfication>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }

      const newUser = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(
        this.verifications.create({ user: newUser }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users
        .createQueryBuilder('user')
        .addSelect('user.password') // 비밀번호 필드를 명시적으로 선택
        .where('user.email = :email', { email })
        .getOne();

      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      const isCorrectPassword = await user.ValidatePassword(password);
      if (!isCorrectPassword) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }

      const token = this.jwtService.sign(user.id);
      return { ok: true, token };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<GetProfileOutput> {
    try {
      const user = await this.users
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.id = :id', { id })
        .getOne();
      if (user) {
        return { ok: true, user };
      }
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async updateProfile(
    userId: number,
    { email, password }: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (email) {
        user.email = email;
        user.isVerified = false;
        await this.verifications.save(this.verifications.create({ user }));
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile.' };
    }
  }

  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verification) {
        verification.user.isVerified = true;
        this.users.save(verification.user);
        this.verifications.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
