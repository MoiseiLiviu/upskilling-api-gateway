import { Args, Query, registerEnumType, Resolver } from '@nestjs/graphql';
import { OrderGraphqlType } from '../types/order-graphql.type';
import {
  GetOrderStatusResponse,
  OrderServiceClient,
  OrderStatus,
} from '../../proto/order.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { OrderStatusGraphqlType } from '../types/order-status-graphql.type';
import { firstValueFrom } from 'rxjs';
import { Inject } from "@nestjs/common";

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@Resolver(() => OrderGraphqlType)
export class OrderResolver {
  private orderServiceClient: OrderServiceClient;

  constructor(
    @Inject('ORDER_PACKAGE')
    private readonly clientGrpc: ClientGrpc) {
    this.orderServiceClient =
      this.clientGrpc.getClientByServiceName<OrderServiceClient>(
        'OrderService',
      );
  }

  @Query(() => OrderStatusGraphqlType)
  async getOrderStatus(
    @Args('orderId') id: number,
  ): Promise<OrderStatusGraphqlType> {
    const orderStatusResponse: GetOrderStatusResponse = await firstValueFrom(
      this.orderServiceClient.getOrderStatus({ orderId: id }),
    );
    return {
      value: orderStatusResponse.status,
    };
  }
}
