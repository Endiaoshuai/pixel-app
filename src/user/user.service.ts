import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { getRepository, In, Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    return this;
  }

  public async register(input): Promise<User> {
    const data = JSON.parse(JSON.stringify(input));
    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.name = data.name;
    const result = user.save();
    return result;
  }

  public async findUser(id: number): Promise<User> {
    const result = await this.userRepository.findOne(id, {
      // relations: ['articles'],
    });
    return result;
  }

  public async findAll(): Promise<User[]> {
    const result = await this.userRepository.find();
    return result;
  }

  public async updateUser(input): Promise<User> {
    // const user = new User();
    const user = await this.userRepository.findOne(input.id);
    user.password = input.password;
    user.name = input.name;
    const result = await user.save();
    return result;
  }
}
