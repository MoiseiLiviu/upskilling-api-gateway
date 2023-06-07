import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartGraphqlType } from '../types/cart-graphql.type';
import { HttpException, Inject, OnModuleInit, UseGuards } from '@nestjs/common';
import { CartItemInput } from '../inputs/cart-item.input';
import { UpdateItemInput } from '../inputs/update-item.input';
import { AuthGuard } from '../../../auth/auth.guard';
import { CurrentUserId } from '../../../decorators/current-user-id.decorator';
import { CartServiceClient } from '../../proto/cart.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderCreatedType } from '../types/order-created.type';
import { LoggerAdapterToken, LoggerPort } from '@nest-upskilling/common/dist';

@Resolver()
@UseGuards(AuthGuard)
export class CartResolver implements OnModuleInit {
  private cartServiceClient: CartServiceClient;

  constructor(
    @Inject('CART_PACKAGE')
    private readonly clientGrpc: ClientGrpc,
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
  ) {}

  onModuleInit() {
    this.cartServiceClient =
      this.clientGrpc.getService<CartServiceClient>('CartService');
  }

  @Query(() => CartGraphqlType, { name: 'cart', nullable: true })
  async getCart(@CurrentUserId() userId: number): Promise<CartGraphqlType> {
    const cartPayload = await firstValueFrom(
      this.cartServiceClient.getCartByUserId({ userId }),
    );
    return CartGraphqlType.fromCartPayload(cartPayload);
  }

  @Mutation(() => String)
  async addToCart(
    @Args('input') cartItemInput: CartItemInput,
    @CurrentUserId() userId: number,
  ): Promise<string> {
    const response = await firstValueFrom(
      this.cartServiceClient.addItem({
        userId,
        productId: cartItemInput.productId,
        quantity: cartItemInput.quantity,
      }),
    );
    console.log(response);

    if (response.status === 201) {
      return response.message;
    } else {
      throw new HttpException(response.error, response.status);
    }
  }

  @Mutation(() => String)
  async updateItemQuantity(
    @CurrentUserId() userId: number,
    @Args('input') updateItemInput: UpdateItemInput,
  ): Promise<string> {
    const response = await firstValueFrom(
      this.cartServiceClient.updateItemQuantity({
        userId,
        productId: updateItemInput.productId,
        newQuantity: updateItemInput.newQuantity,
      }),
    );

    if (response.status === 200) {
      return response.message;
    } else {
      throw new HttpException(response.error, response.status);
    }
  }

  @Mutation(() => String)
  async clearCart(@CurrentUserId() userId: number): Promise<string> {
    const response = await firstValueFrom(
      this.cartServiceClient.clearCart({
        userId,
      }),
    );

    if (response.status === 204) {
      return response.message;
    } else {
      throw new HttpException(response.error, response.status);
    }
  }

  @Mutation(() => OrderCreatedType)
  async initOrder(@CurrentUserId() userId: number): Promise<OrderCreatedType> {
    this.loggerPort.log(
      'CartResolver',
      `Received init order request from user with id ${userId}`,
    );
    const response = await firstValueFrom(
      this.cartServiceClient.initOrder({
        userId,
      }),
    );
    this.loggerPort.log(
      'CartResolver',
      `Order initiated successfully, created order id: ${response.orderId}`,
    );

    return {
      orderId: response.orderId,
    };
  }

  @Mutation(() => String)
  async removeItem(
    @Args('productId') productId: number,
    @CurrentUserId() userId: number,
  ): Promise<string> {
    const response = await firstValueFrom(
      this.cartServiceClient.removeItem({
        userId,
        productId,
      }),
    );
    console.log(response);
    if (response.status === 200) {
      return response.message;
    } else {
      throw new HttpException(response.error, response.status);
    }
  }
}
