import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  imageUrl: string;

  @Field(() => Int)
  unitsAvailable: number;

  @Field(() => [Int])
  categoriesIds: number[];
}
