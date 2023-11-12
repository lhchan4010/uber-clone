import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { jwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: jwtModuleOptions,
  ) {}
  sign(userId: number) {
    return jwt.sign({ id: userId }, this.options.privateKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}