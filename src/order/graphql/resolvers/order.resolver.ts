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
import { Inject } from '@nestjs/common';
import { LoggerAdapterToken, LoggerPort } from '@nest-upskilling/common/dist';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@Resolver(() => OrderGraphqlType)
export class OrderResolver {
  private orderServiceClient: OrderServiceClient;

  constructor(
    @Inject('ORDER_PACKAGE')
    private readonly clientGrpc: ClientGrpc,
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
  ) {
    this.orderServiceClient =
      this.clientGrpc.getService<OrderServiceClient>(
        'OrderService',
      );
  }

  @Query(() => OrderStatusGraphqlType, { name: 'orderStatus' })
  async getOrderStatus(
    @Args('orderId') orderId: number,
  ): Promise<OrderStatusGraphqlType> {
    this.loggerPort.log(
      'OrderResolver',
      `Fetching order status for order with id: ${orderId}`,
    );
    const orderStatusResponse: GetOrderStatusResponse = await firstValueFrom(
      this.orderServiceClient.getOrderStatus({ orderId }),
    );
    return {
      value: orderStatusResponse.status,
    };
  }
}
