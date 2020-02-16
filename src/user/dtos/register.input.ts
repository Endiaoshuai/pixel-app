import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  public email: string;

  @Field()
  public password: string;

  @Field()
  public name: string;
}
