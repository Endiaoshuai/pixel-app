import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ShopInput {
  @Field()
  public id: string;

  @Field()
  @IsEmail()
  public email: string;

  @Field()
  public domain: string;

  @Field()
  public primaryDomain?: string;

  @Field()
  public accessToken: string;
}
