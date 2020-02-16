import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ID } from 'type-graphql';

import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from './current-user.decorator';
import { RegisterInput } from './dtos/register.input';
import { UpdateUserInput } from './dtos/update-user-input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {
    return this;
  }

  @Mutation(() => User)
  public async register(@Args('input') input: RegisterInput): Promise<User> {
    // const result = await User.create(input).save();
    // return result;
    const result = await this.userService.register(input);
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  public async user(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<User> {
    const result = await this.userService.findUser(id);
    return result;
  }

  @UseGuards(AuthGuard)
  @Query(() => [User])
  public async users(): Promise<User[]> {
    const result = await this.userService.findAll();
    return result;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  public async updateUser(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    if (!input.password || input.password !== input.re_Password) {
      // throw new HttpException('重复密码不一致', 400);
      throw new BadRequestException('重复密码不一致', 'BadRequestException');
    }
    const result = await this.userService.updateUser({
      id: user.id,
      password: input.password,
      name: input.name,
    });
    return result;
  }
}
