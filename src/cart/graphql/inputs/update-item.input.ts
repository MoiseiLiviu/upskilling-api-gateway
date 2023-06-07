import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput {
  @Field(() => Int)
  productId: number;
  @Field(() => Int)
  newQuantity: number;
}
