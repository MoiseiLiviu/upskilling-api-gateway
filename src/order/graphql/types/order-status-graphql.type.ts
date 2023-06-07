import { OrderStatus } from '../../proto/order.pb';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderStatusGraphqlType {
  @Field(() => OrderStatus)
  value: OrderStatus;
}
