import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdatePixelInput {
  @Field()
  public collection: string;

  @Field()
  public pixel: string;
}
