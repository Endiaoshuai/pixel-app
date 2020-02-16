import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  public password: string;

  @Field()
  public re_Password: string;

  @Field()
  public name: string;
}
