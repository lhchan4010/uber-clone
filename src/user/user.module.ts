import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Veryfication } from './entities/veryfication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Veryfication])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
