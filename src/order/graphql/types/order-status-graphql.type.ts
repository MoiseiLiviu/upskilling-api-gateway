import { OrderStatus } from '../../proto/order.pb';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderStatusGraphqlType {
  value: OrderStatus;
}