import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePixelInput {
  @Field()
  public collection: string;

  @Field()
  public pixel: string;
}
