import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderCreatedType {
  @Field(() => Int)
  orderId: number;
}