/* eslint-disable no-useless-constructor */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  public constructor(private readonly jwtService: JwtService) {
    return this;
  }

  public async validateUser(email: string, password: string): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('账号或密码错误！', 'BadRequestException');
  }

  public async generateToken(user: User): Promise<string> {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
